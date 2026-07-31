# Component Library — Phase 2 (Atoms) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the 10 Phase-2 atoms (Text, Button, TextField, Icon, Avatar, Badge, Chip, Switch, Checkbox, Radio) as theme-driven `styled-components/native` components under `src/design-system/`, and wire up real light/dark theme switching so they (and the rest of the app) render correctly in both.

**Architecture:** A new `src/design-system/ThemeProvider.tsx` composes `theme.ts`'s `colors`/`colorsDark` into two `styled-components` themes keyed off `useColorScheme()`. Every atom lives in its own file under `src/design-system/atoms/`, styled via `styled-components/native` reading `props.theme` — never a static `theme.ts` import. `src/app/_layout.tsx` wraps the app in `ThemeProvider`.

**Tech Stack:** Expo SDK 57, React Native 0.86, TypeScript, `styled-components/native`, `expo-symbols` (SF Symbols) + `@expo/vector-icons` (Ionicons fallback), `expo-haptics`, Jest + `jest-expo` + `@testing-library/react-native`.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-31-component-library-atoms-design.md` — this plan implements it exactly; consult it for anything not repeated here.
- No StyleSheet.create, no inline `style={{ ... }}` for anything themeable — use `styled-components/native`.
- No static `theme.ts` imports inside atom/component files — read colors/typography/spacing/radius/elevation/opacity/motion/pressed via `props.theme` (from `ThemeProvider`), so light/dark switching works everywhere.
- Path alias `@/*` → `./src/*` (already configured in `tsconfig.json`).
- Interactive atoms (Button, TextField, Chip, Switch, Checkbox, Radio) must have a ≥44×44 hit target regardless of visual size.
- `tsc --noEmit` and `npx jest` must be clean after every task.
- Test files are colocated next to the file they test, named `<Name>.test.tsx` (matches existing `testMatch` in `package.json`).

---

### Task 1: Dependency setup

**Files:**
- Modify: `package.json`

**Interfaces:**
- Consumes: nothing
- Produces: `@expo/vector-icons`, `expo-haptics`, `@testing-library/react-native`, `react-test-renderer` available for every later task. `lucide-react-native` removed.

- [ ] **Step 1: Install `@expo/vector-icons`**

Run: `npx expo install @expo/vector-icons`

- [ ] **Step 2: Install `expo-haptics`**

Run: `npx expo install expo-haptics`

- [ ] **Step 3: Install test tooling (dev dependencies)**

Run: `npm install --save-dev @testing-library/react-native react-test-renderer`

If this fails with an `ERESOLVE` peer-dependency error (this repo has a pre-existing unrelated peer conflict around `@expo/router-server`'s optional `react-dom` peer), retry with:
`npm install --save-dev --legacy-peer-deps @testing-library/react-native react-test-renderer`

- [ ] **Step 4: Remove the unused `lucide-react-native` dependency**

Edit `package.json` to delete the line:
```json
    "lucide-react-native": "^1.27.0",
```
Then run:
```bash
rm -rf node_modules/lucide-react-native
```
(Do not run `npm uninstall` — in this repo it triggers the same unrelated peer-dependency resolution error as a full `npm install`; editing `package.json` directly and removing the folder is the proven-working approach here.)

- [ ] **Step 5: Verify the test tooling actually works**

Create a temporary file `src/design-system/__smoke__.test.tsx`:

```tsx
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';

it('renders with @testing-library/react-native', () => {
  const { getByText } = render(<Text>hello</Text>);
  expect(getByText('hello')).toBeTruthy();
});
```

Run: `npx jest src/design-system/__smoke__.test.tsx`
Expected: 1 test passes.

Then delete the file:
```bash
rm src/design-system/__smoke__.test.tsx
```

- [ ] **Step 6: Verify the app still type-checks and bundles**

Run: `npx tsc --noEmit`
Expected: no output (clean).

Run: `npx expo export --platform ios --output-dir /tmp/cometa-export-check && rm -rf /tmp/cometa-export-check`
Expected: exports successfully.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add vector-icons/haptics/testing deps, drop unused lucide-react-native"
```

---

### Task 2: ThemeProvider and theme typing

**Files:**
- Create: `src/design-system/ThemeProvider.tsx`
- Create: `src/design-system/ThemeProvider.test.tsx`
- Create: `src/design-system/styled.d.ts`

**Interfaces:**
- Consumes: `colors`, `colorsDark`, `typography`, `spacing`, `radius`, `elevation`, `opacity`, `motion`, `pressed` from `@/constants/theme`.
- Produces: `ThemeProvider` (React component, wraps children), `Theme` (exported type — the exact shape of `props.theme` everywhere downstream). Every later task's styled-components read `props.theme.colors.x`, `props.theme.typography.x`, etc. using this shape.

- [ ] **Step 1: Write the failing test**

`src/design-system/ThemeProvider.test.tsx`:

```tsx
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { useColorScheme } from 'react-native';
import { useTheme } from 'styled-components/native';
import { ThemeProvider } from './ThemeProvider';

jest.mock('react-native/Libraries/Utilities/useColorScheme');

function ThemeConsumer() {
  const theme = useTheme();
  return <Text testID="bg">{theme.colors.background}</Text>;
}

describe('ThemeProvider', () => {
  it('provides the light theme when the system scheme is light', () => {
    (useColorScheme as jest.Mock).mockReturnValue('light');
    const { getByTestId } = render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(getByTestId('bg').props.children).toBe('#FFFFFF');
  });

  it('provides the dark theme when the system scheme is dark', () => {
    (useColorScheme as jest.Mock).mockReturnValue('dark');
    const { getByTestId } = render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(getByTestId('bg').props.children).toBe('#000000');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/design-system/ThemeProvider.test.tsx`
Expected: FAIL — `Cannot find module './ThemeProvider'`.

- [ ] **Step 3: Write `ThemeProvider.tsx`**

`src/design-system/ThemeProvider.tsx`:

```tsx
import type { ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import {
  colors,
  colorsDark,
  typography,
  spacing,
  radius,
  elevation,
  opacity,
  motion,
  pressed,
} from '@/constants/theme';

const lightTheme = {
  scheme: 'light' as const,
  colors,
  typography,
  spacing,
  radius,
  elevation,
  opacity,
  motion,
  pressed,
};

const darkTheme = {
  scheme: 'dark' as const,
  colors: colorsDark,
  typography,
  spacing,
  radius,
  elevation: { ...elevation, level2: elevation.level2Dark },
  opacity,
  motion,
  pressed,
};

export type Theme = typeof lightTheme;

export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;
  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
}
```

- [ ] **Step 4: Write the `styled-components/native` type augmentation**

`src/design-system/styled.d.ts`:

```ts
import 'styled-components/native';
import type { Theme } from './ThemeProvider';

declare module 'styled-components/native' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx jest src/design-system/ThemeProvider.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 6: Verify types**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 7: Commit**

```bash
git add src/design-system/ThemeProvider.tsx src/design-system/ThemeProvider.test.tsx src/design-system/styled.d.ts
git commit -m "feat(design-system): add ThemeProvider with light/dark theme switching"
```

---

### Task 3: Wire ThemeProvider into the app

**Files:**
- Modify: `src/app/_layout.tsx`
- Modify: `src/app/index.tsx`

**Interfaces:**
- Consumes: `ThemeProvider` from `@/design-system/ThemeProvider` (Task 2).
- Produces: nothing new for later tasks — this proves the wiring works end-to-end in the real app, not just in tests.

- [ ] **Step 1: Rewrite `src/app/_layout.tsx` to wrap the app in `ThemeProvider`**

```tsx
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import styled, { useTheme } from "styled-components/native";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { ThemeProvider } from "@/design-system/ThemeProvider";

const Root = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore — the splash may have already hidden if a prior boot failed.
});

function Navigation() {
  const theme = useTheme();
  return (
    <Root>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
    </Root>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <StatusBar hidden />
        <Navigation />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
```

(`Navigation` exists as a separate component because `useTheme()` must be called from a descendant of `ThemeProvider`, not from `RootLayout` itself, which renders the provider.)

- [ ] **Step 2: Rewrite `src/app/index.tsx` to read theme via props instead of static import**

```tsx
import styled from "styled-components/native";

const Screen = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Title = styled.Text`
  font-family: ${({ theme }) => theme.typography.headlineMobile.fontFamily};
  font-size: ${({ theme }) => theme.typography.headlineMobile.fontSize}px;
  line-height: ${({ theme }) => theme.typography.headlineMobile.lineHeight}px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export default function Index() {
  return (
    <Screen>
      <Title>Cometa</Title>
    </Screen>
  );
}
```

- [ ] **Step 3: Verify types**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 4: Verify the bundle still exports**

Run: `npx expo export --platform ios --output-dir /tmp/cometa-export-check && rm -rf /tmp/cometa-export-check`
Expected: exports successfully.

- [ ] **Step 5: Manually verify dark mode**

Run `npx expo start`, open in the iOS simulator, and toggle the simulator's system appearance (Settings → Developer → Dark Appearance, or Simulator menu → Features → Toggle Appearance). Confirm the screen background/text flips between white-on-black-text and black-on-white-text.

- [ ] **Step 6: Commit**

```bash
git add src/app/_layout.tsx src/app/index.tsx
git commit -m "feat(app): wire ThemeProvider into root layout, drop static theme imports"
```

---

### Task 4: Text atom

**Files:**
- Create: `src/design-system/atoms/Text.tsx`
- Create: `src/design-system/atoms/Text.test.tsx`

**Interfaces:**
- Consumes: `Theme` type from `@/design-system/ThemeProvider` (Task 2).
- Produces: `Text` component and `TextProps` type, used by Avatar, Badge, Button, Chip, TextField (Tasks 6, 7, 8, 10, 9).

- [ ] **Step 1: Write the test**

`src/design-system/atoms/Text.test.tsx`:

```tsx
import { render } from '@testing-library/react-native';
import { Text } from './Text';
import { ThemeProvider } from '@/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Text', () => {
  it('renders its children', () => {
    const { getByText } = renderWithTheme(<Text>Cometa</Text>);
    expect(getByText('Cometa')).toBeTruthy();
  });

  it('applies the requested typography variant', () => {
    const { getByText } = renderWithTheme(<Text variant="headline">Cometa</Text>);
    const style = getByText('Cometa').props.style;
    expect(JSON.stringify(style)).toContain('28');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/design-system/atoms/Text.test.tsx`
Expected: FAIL — `Cannot find module './Text'`.

- [ ] **Step 3: Write `Text.tsx`**

`src/design-system/atoms/Text.tsx`:

```tsx
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import styled from 'styled-components/native';
import type { Theme } from '@/design-system/ThemeProvider';

type TypographyVariant = keyof Theme['typography'];
type ColorKey = keyof Theme['colors'];

export type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  color?: ColorKey;
};

const StyledText = styled(RNText)<{ variant: TypographyVariant; color: ColorKey }>`
  font-family: ${({ theme, variant }) => theme.typography[variant].fontFamily};
  font-size: ${({ theme, variant }) => theme.typography[variant].fontSize}px;
  line-height: ${({ theme, variant }) => theme.typography[variant].lineHeight}px;
  color: ${({ theme, color }) => theme.colors[color]};
  ${({ theme, variant }) => {
    const { letterSpacing } = theme.typography[variant] as { letterSpacing?: number };
    return letterSpacing !== undefined ? `letter-spacing: ${letterSpacing}px;` : '';
  }}
`;

export function Text({ variant = 'body', color = 'textPrimary', ...rest }: TextProps) {
  return <StyledText variant={variant} color={color} {...rest} />;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/design-system/atoms/Text.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Verify types**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 6: Commit**

```bash
git add src/design-system/atoms/Text.tsx src/design-system/atoms/Text.test.tsx
git commit -m "feat(design-system): add Text atom"
```

---

### Task 5: Icon atom

**Files:**
- Create: `src/design-system/atoms/Icon.tsx`
- Create: `src/design-system/atoms/Icon.test.tsx`

**Interfaces:**
- Consumes: `Theme` type from `@/design-system/ThemeProvider`; `Ionicons` from `@expo/vector-icons`; `SymbolView` from `expo-symbols`; `SFSymbol` type from `sf-symbols-typescript` (transitive dep of `expo-symbols`, already in `node_modules`).
- Produces: `Icon` component and `IconProps` type, used by Button (leading icon), Chip (leading icon), Checkbox (checkmark) — Tasks 8, 10, 12.

- [ ] **Step 1: Write the test**

`src/design-system/atoms/Icon.test.tsx`:

```tsx
import { Platform } from 'react-native';
import { render } from '@testing-library/react-native';
import { Icon } from './Icon';
import { ThemeProvider } from '@/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Icon', () => {
  it('renders without crashing using the Ionicons fallback name', () => {
    Platform.OS = 'android';
    const { toJSON } = renderWithTheme(<Icon name="cart" />);
    expect(toJSON()).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/design-system/atoms/Icon.test.tsx`
Expected: FAIL — `Cannot find module './Icon'`.

- [ ] **Step 3: Write `Icon.tsx`**

`src/design-system/atoms/Icon.tsx`:

```tsx
import { Platform } from 'react-native';
import { SymbolView } from 'expo-symbols';
import type { SFSymbol } from 'sf-symbols-typescript';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import type { Theme } from '@/design-system/ThemeProvider';

type ColorKey = keyof Theme['colors'];

export type IconProps = {
  name: keyof typeof Ionicons.glyphMap;
  sf?: SFSymbol;
  size?: number;
  color?: ColorKey;
};

export function Icon({ name, sf, size = 24, color = 'textPrimary' }: IconProps) {
  const theme = useTheme();
  const tintColor = theme.colors[color];

  if (Platform.OS === 'ios' && sf) {
    return <SymbolView name={sf} size={size} tintColor={tintColor} />;
  }

  return <Ionicons name={name} size={size} color={tintColor} />;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/design-system/atoms/Icon.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Verify types**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 6: Commit**

```bash
git add src/design-system/atoms/Icon.tsx src/design-system/atoms/Icon.test.tsx
git commit -m "feat(design-system): add Icon atom (SF Symbols on iOS, Ionicons fallback)"
```

---

### Task 6: Avatar atom

**Files:**
- Create: `src/design-system/atoms/Avatar.tsx`
- Create: `src/design-system/atoms/Avatar.test.tsx`

**Interfaces:**
- Consumes: `Text` from `./Text` (Task 4).
- Produces: `Avatar` component and `AvatarProps` type. No later task depends on it.

- [ ] **Step 1: Write the test**

`src/design-system/atoms/Avatar.test.tsx`:

```tsx
import { render } from '@testing-library/react-native';
import { Avatar } from './Avatar';
import { ThemeProvider } from '@/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Avatar', () => {
  it('renders initials when no source is given', () => {
    const { getByText } = renderWithTheme(<Avatar initials="AL" />);
    expect(getByText('AL')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/design-system/atoms/Avatar.test.tsx`
Expected: FAIL — `Cannot find module './Avatar'`.

- [ ] **Step 3: Write `Avatar.tsx`**

`src/design-system/atoms/Avatar.tsx`:

```tsx
import { Image, type ImageSourcePropType } from 'react-native';
import styled from 'styled-components/native';
import { Text } from './Text';

export type AvatarProps = {
  source?: ImageSourcePropType;
  initials?: string;
  size?: number;
};

const Circle = styled.View<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: ${({ size }) => size / 2}px;
  background-color: ${({ theme }) => theme.colors.surface};
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const AvatarImage = styled(Image)<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
`;

export function Avatar({ source, initials, size = 40 }: AvatarProps) {
  return (
    <Circle size={size}>
      {source ? (
        <AvatarImage source={source} size={size} />
      ) : (
        <Text variant="subheadline" color="textSecondary">
          {initials}
        </Text>
      )}
    </Circle>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/design-system/atoms/Avatar.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Verify types**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 6: Commit**

```bash
git add src/design-system/atoms/Avatar.tsx src/design-system/atoms/Avatar.test.tsx
git commit -m "feat(design-system): add Avatar atom"
```

---

### Task 7: Badge atom

**Files:**
- Create: `src/design-system/atoms/Badge.tsx`
- Create: `src/design-system/atoms/Badge.test.tsx`

**Interfaces:**
- Consumes: `Text` from `./Text` (Task 4); `Theme` type from `@/design-system/ThemeProvider`.
- Produces: `Badge` component and `BadgeProps` type. No later task depends on it.

- [ ] **Step 1: Write the test**

`src/design-system/atoms/Badge.test.tsx`:

```tsx
import { render } from '@testing-library/react-native';
import { Badge } from './Badge';
import { ThemeProvider } from '@/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Badge', () => {
  it('renders the count', () => {
    const { getByText } = renderWithTheme(<Badge count={3} />);
    expect(getByText('3')).toBeTruthy();
  });

  it('caps the displayed count at 99+', () => {
    const { getByText } = renderWithTheme(<Badge count={150} />);
    expect(getByText('99+')).toBeTruthy();
  });

  it('renders nothing when count is 0', () => {
    const { toJSON } = renderWithTheme(<Badge count={0} />);
    expect(toJSON()).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/design-system/atoms/Badge.test.tsx`
Expected: FAIL — `Cannot find module './Badge'`.

- [ ] **Step 3: Write `Badge.tsx`**

`src/design-system/atoms/Badge.tsx`:

```tsx
import styled from 'styled-components/native';
import type { Theme } from '@/design-system/ThemeProvider';
import { Text } from './Text';

type BadgeVariant = 'primary' | 'error' | 'success' | 'neutral';
type ColorKey = keyof Theme['colors'];

export type BadgeProps = {
  count?: number;
  variant?: BadgeVariant;
};

const VARIANT_COLOR: Record<BadgeVariant, ColorKey> = {
  primary: 'primary',
  error: 'error',
  success: 'success',
  neutral: 'textSecondary',
};

const NumberBadge = styled.View<{ color: ColorKey }>`
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  padding-horizontal: 6px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, color }) => theme.colors[color]};
`;

const DotBadge = styled.View<{ color: ColorKey }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ theme, color }) => theme.colors[color]};
`;

export function Badge({ count, variant = 'error' }: BadgeProps) {
  if (count === 0) return null;

  const color = VARIANT_COLOR[variant];

  if (count === undefined) {
    return <DotBadge color={color} />;
  }

  return (
    <NumberBadge color={color}>
      <Text variant="caption" color="onPrimary">
        {count > 99 ? '99+' : String(count)}
      </Text>
    </NumberBadge>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/design-system/atoms/Badge.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Verify types**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 6: Commit**

```bash
git add src/design-system/atoms/Badge.tsx src/design-system/atoms/Badge.test.tsx
git commit -m "feat(design-system): add Badge atom"
```

---

### Task 8: Button atom

**Files:**
- Create: `src/design-system/atoms/Button.tsx`
- Create: `src/design-system/atoms/Button.test.tsx`

**Interfaces:**
- Consumes: `Text` from `./Text` (Task 4); `Theme` type from `@/design-system/ThemeProvider`; `expo-haptics`.
- Produces: `Button`, `ButtonProps`, `ButtonVariant`, `ButtonSize`, `ButtonShape`. No later atom task depends on it (Molecules phase will).

- [ ] **Step 1: Write the test**

`src/design-system/atoms/Button.test.tsx`:

```tsx
import { ActivityIndicator } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';
import { ThemeProvider } from '@/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Button', () => {
  it('fires onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = renderWithTheme(<Button onPress={onPress}>Confirm</Button>);
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByRole } = renderWithTheme(
      <Button onPress={onPress} disabled>
        Confirm
      </Button>
    );
    fireEvent.press(getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not fire onPress and renders an ActivityIndicator when loading', () => {
    const onPress = jest.fn();
    const { getByRole, UNSAFE_getByType, queryByText } = renderWithTheme(
      <Button onPress={onPress} loading>
        Confirm
      </Button>
    );
    fireEvent.press(getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
    expect(queryByText('Confirm')).toBeNull();
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/design-system/atoms/Button.test.tsx`
Expected: FAIL — `Cannot find module './Button'`.

- [ ] **Step 3: Write `Button.tsx`**

`src/design-system/atoms/Button.tsx`:

```tsx
import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, type GestureResponderEvent } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import * as Haptics from 'expo-haptics';
import type { Theme } from '@/design-system/ThemeProvider';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'text' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonShape = 'default' | 'pill' | 'circle';

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  children?: ReactNode;
};

type ColorKey = keyof Theme['colors'];

const VARIANT_STYLE: Record<
  ButtonVariant,
  { background: ColorKey | 'transparent'; label: ColorKey; border: ColorKey | 'transparent' }
> = {
  primary: { background: 'primary', label: 'onPrimary', border: 'transparent' },
  secondary: { background: 'secondary', label: 'onSecondary', border: 'transparent' },
  success: { background: 'success', label: 'onPrimary', border: 'transparent' },
  danger: { background: 'error', label: 'onPrimary', border: 'transparent' },
  outline: { background: 'transparent', label: 'primary', border: 'primary' },
  ghost: { background: 'surface', label: 'textPrimary', border: 'transparent' },
  text: { background: 'transparent', label: 'primary', border: 'transparent' },
};

const SIZE_STYLE: Record<ButtonSize, { height: number; paddingHorizontal: number }> = {
  sm: { height: 36, paddingHorizontal: 12 },
  md: { height: 44, paddingHorizontal: 16 },
  lg: { height: 52, paddingHorizontal: 20 },
};

const Container = styled.View<{
  variant: ButtonVariant;
  size: ButtonSize;
  shape: ButtonShape;
  disabled: boolean;
}>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: ${({ size }) => Math.max(SIZE_STYLE[size].height, 44)}px;
  min-width: ${({ shape, size }) => (shape === 'circle' ? Math.max(SIZE_STYLE[size].height, 44) : 44)}px;
  padding-horizontal: ${({ shape, size }) => (shape === 'circle' ? 0 : SIZE_STYLE[size].paddingHorizontal)}px;
  border-radius: ${({ shape, theme }) => (shape === 'default' ? theme.radius.md : theme.radius.pill)}px;
  background-color: ${({ theme, variant }) => {
    const bg = VARIANT_STYLE[variant].background;
    return bg === 'transparent' ? 'transparent' : theme.colors[bg];
  }};
  border-width: ${({ variant }) => (VARIANT_STYLE[variant].border === 'transparent' ? 0 : 1)}px;
  border-color: ${({ theme, variant }) => {
    const border = VARIANT_STYLE[variant].border;
    return border === 'transparent' ? 'transparent' : theme.colors[border];
  }};
  opacity: ${({ theme, disabled }) => (disabled ? theme.opacity[40] : theme.opacity[100])};
`;

export function Button({
  variant = 'primary',
  size = 'md',
  shape = 'default',
  loading = false,
  disabled = false,
  icon,
  onPress,
  children,
}: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;
  const labelColor = VARIANT_STYLE[variant].label;

  const handlePress = (event: GestureResponderEvent) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress?.(event);
  };

  return (
    <Pressable
      onPress={isDisabled ? undefined : handlePress}
      disabled={isDisabled}
      accessibilityRole="button"
      style={({ pressed: isPressed }) => ({
        opacity: isPressed && !isDisabled ? theme.pressed.opacity : 1,
      })}
    >
      <Container variant={variant} size={size} shape={shape} disabled={isDisabled}>
        {loading ? (
          <ActivityIndicator color={theme.colors[labelColor]} />
        ) : (
          <>
            {icon}
            {children ? (
              <Text variant="bodyEmphasized" color={labelColor}>
                {children}
              </Text>
            ) : null}
          </>
        )}
      </Container>
    </Pressable>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/design-system/atoms/Button.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Verify types**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 6: Commit**

```bash
git add src/design-system/atoms/Button.tsx src/design-system/atoms/Button.test.tsx
git commit -m "feat(design-system): add Button atom"
```

---

### Task 9: TextField atom

**Files:**
- Create: `src/design-system/atoms/TextField.tsx`
- Create: `src/design-system/atoms/TextField.test.tsx`

**Interfaces:**
- Consumes: `Text` from `./Text` (Task 4).
- Produces: `TextField`, `TextFieldProps`. The Molecules phase (Password/Search/OTP/Phone/Currency) will compose on top of this later.

- [ ] **Step 1: Write the test**

`src/design-system/atoms/TextField.test.tsx`:

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { TextField } from './TextField';
import { ThemeProvider } from '@/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('TextField', () => {
  it('fires onChangeText with the typed value', () => {
    const onChangeText = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <TextField label="Email" onChangeText={onChangeText} accessibilityLabel="Email" />
    );
    fireEvent.changeText(getByLabelText('Email'), 'hi@cometa.co');
    expect(onChangeText).toHaveBeenCalledWith('hi@cometa.co');
  });

  it('renders the error message when error is set', () => {
    const { getByText } = renderWithTheme(<TextField label="Email" error="Invalid email" />);
    expect(getByText('Invalid email')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/design-system/atoms/TextField.test.tsx`
Expected: FAIL — `Cannot find module './TextField'`.

- [ ] **Step 3: Write `TextField.tsx`**

`src/design-system/atoms/TextField.tsx`:

```tsx
import { useState } from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import styled from 'styled-components/native';
import { Text } from './Text';

export type TextFieldProps = TextInputProps & {
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
};

const Container = styled.View`
  gap: 4px;
`;

const Field = styled(TextInput)<{ focused: boolean; hasError: boolean; disabled: boolean }>`
  height: 44px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({ theme, focused, hasError }) =>
    hasError ? theme.colors.error : focused ? theme.colors.primary : theme.colors.border};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  opacity: ${({ theme, disabled }) => (disabled ? theme.opacity[40] : theme.opacity[100])};
`;

export function TextField({ label, error, helperText, disabled, editable, ...rest }: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <Container>
      {label ? (
        <Text variant="footnote" color="textSecondary">
          {label}
        </Text>
      ) : null}
      <Field
        {...rest}
        editable={editable ?? !disabled}
        focused={focused}
        hasError={!!error}
        disabled={!!disabled}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
      />
      {error ? (
        <Text variant="caption" color="error">
          {error}
        </Text>
      ) : helperText ? (
        <Text variant="caption" color="textSecondary">
          {helperText}
        </Text>
      ) : null}
    </Container>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/design-system/atoms/TextField.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Verify types**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 6: Commit**

```bash
git add src/design-system/atoms/TextField.tsx src/design-system/atoms/TextField.test.tsx
git commit -m "feat(design-system): add TextField atom"
```

---

### Task 10: Chip atom

**Files:**
- Create: `src/design-system/atoms/Chip.tsx`
- Create: `src/design-system/atoms/Chip.test.tsx`

**Interfaces:**
- Consumes: `Text` from `./Text` (Task 4).
- Produces: `Chip`, `ChipProps`. No later atom task depends on it.

- [ ] **Step 1: Write the test**

`src/design-system/atoms/Chip.test.tsx`:

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Chip } from './Chip';
import { ThemeProvider } from '@/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Chip', () => {
  it('fires onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = renderWithTheme(<Chip label="Fast delivery" onPress={onPress} />);
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('reflects the selected prop via accessibilityState', () => {
    const { getByRole } = renderWithTheme(<Chip label="Fast delivery" selected onPress={() => {}} />);
    expect(getByRole('button').props.accessibilityState.selected).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/design-system/atoms/Chip.test.tsx`
Expected: FAIL — `Cannot find module './Chip'`.

- [ ] **Step 3: Write `Chip.tsx`**

`src/design-system/atoms/Chip.tsx`:

```tsx
import type { ReactNode } from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';
import { Text } from './Text';

export type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: ReactNode;
};

const withAlpha = (hex: string, alphaHex: string) => `${hex}${alphaHex}`;

const Container = styled.View<{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding-horizontal: 12px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
  background-color: ${({ theme, selected }) =>
    selected ? withAlpha(theme.colors.primary, '1A') : theme.colors.surface};
  border-width: 1px;
  border-color: ${({ theme, selected }) => (selected ? theme.colors.primary : theme.colors.border)};
`;

export function Chip({ label, selected = false, onPress, icon }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      hitSlop={6}
    >
      <Container selected={selected}>
        {icon}
        <Text variant="footnote" color={selected ? 'primary' : 'textPrimary'}>
          {label}
        </Text>
      </Container>
    </Pressable>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/design-system/atoms/Chip.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Verify types**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 6: Commit**

```bash
git add src/design-system/atoms/Chip.tsx src/design-system/atoms/Chip.test.tsx
git commit -m "feat(design-system): add Chip atom"
```

---

### Task 11: Switch atom

**Files:**
- Create: `src/design-system/atoms/Switch.tsx`
- Create: `src/design-system/atoms/Switch.test.tsx`

**Interfaces:**
- Consumes: nothing from other atoms.
- Produces: `Switch`, `SwitchProps`. No later atom task depends on it.

- [ ] **Step 1: Write the test**

`src/design-system/atoms/Switch.test.tsx`:

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Switch } from './Switch';
import { ThemeProvider } from '@/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Switch', () => {
  it('fires onValueChange with the toggled value', () => {
    const onValueChange = jest.fn();
    const { getByRole } = renderWithTheme(<Switch value={false} onValueChange={onValueChange} />);
    fireEvent(getByRole('switch'), 'valueChange', true);
    expect(onValueChange).toHaveBeenCalledWith(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/design-system/atoms/Switch.test.tsx`
Expected: FAIL — `Cannot find module './Switch'`.

- [ ] **Step 3: Write `Switch.tsx`**

`src/design-system/atoms/Switch.tsx`:

```tsx
import { Switch as RNSwitch } from 'react-native';
import { useTheme } from 'styled-components/native';

export type SwitchProps = {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
};

export function Switch({ value, onValueChange, disabled }: SwitchProps) {
  const theme = useTheme();
  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
      thumbColor={theme.colors.background}
      ios_backgroundColor={theme.colors.border}
    />
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/design-system/atoms/Switch.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Verify types**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 6: Commit**

```bash
git add src/design-system/atoms/Switch.tsx src/design-system/atoms/Switch.test.tsx
git commit -m "feat(design-system): add Switch atom"
```

---

### Task 12: Checkbox atom

**Files:**
- Create: `src/design-system/atoms/Checkbox.tsx`
- Create: `src/design-system/atoms/Checkbox.test.tsx`

**Interfaces:**
- Consumes: `Icon` from `./Icon` (Task 5).
- Produces: `Checkbox`, `CheckboxProps`. No later atom task depends on it.

- [ ] **Step 1: Write the test**

`src/design-system/atoms/Checkbox.test.tsx`:

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Checkbox } from './Checkbox';
import { ThemeProvider } from '@/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Checkbox', () => {
  it('fires onChange with the toggled value', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(<Checkbox checked={false} onChange={onChange} />);
    fireEvent.press(getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('does not fire onChange when disabled', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(<Checkbox checked={false} onChange={onChange} disabled />);
    fireEvent.press(getByRole('checkbox'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/design-system/atoms/Checkbox.test.tsx`
Expected: FAIL — `Cannot find module './Checkbox'`.

- [ ] **Step 3: Write `Checkbox.tsx`**

`src/design-system/atoms/Checkbox.tsx`:

```tsx
import { Pressable } from 'react-native';
import styled from 'styled-components/native';
import { Icon } from './Icon';

export type CheckboxProps = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
};

const Box = styled.View<{ checked: boolean; disabled: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, checked }) => (checked ? theme.colors.primary : 'transparent')};
  border-width: 1px;
  border-color: ${({ theme, checked }) => (checked ? theme.colors.primary : theme.colors.border)};
  opacity: ${({ theme, disabled }) => (disabled ? theme.opacity[40] : theme.opacity[100])};
`;

export function Checkbox({ checked = false, onChange, disabled = false }: CheckboxProps) {
  return (
    <Pressable
      onPress={disabled ? undefined : () => onChange?.(!checked)}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      hitSlop={11}
    >
      <Box checked={checked} disabled={disabled}>
        {checked ? <Icon name="checkmark" size={16} color="onPrimary" /> : null}
      </Box>
    </Pressable>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/design-system/atoms/Checkbox.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Verify types**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 6: Commit**

```bash
git add src/design-system/atoms/Checkbox.tsx src/design-system/atoms/Checkbox.test.tsx
git commit -m "feat(design-system): add Checkbox atom"
```

---

### Task 13: Radio atom

**Files:**
- Create: `src/design-system/atoms/Radio.tsx`
- Create: `src/design-system/atoms/Radio.test.tsx`

**Interfaces:**
- Consumes: nothing from other atoms.
- Produces: `Radio`, `RadioProps`. No later atom task depends on it.

- [ ] **Step 1: Write the test**

`src/design-system/atoms/Radio.test.tsx`:

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Radio } from './Radio';
import { ThemeProvider } from '@/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Radio', () => {
  it('fires onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = renderWithTheme(<Radio selected={false} onPress={onPress} />);
    fireEvent.press(getByRole('radio'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByRole } = renderWithTheme(<Radio selected={false} onPress={onPress} disabled />);
    fireEvent.press(getByRole('radio'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/design-system/atoms/Radio.test.tsx`
Expected: FAIL — `Cannot find module './Radio'`.

- [ ] **Step 3: Write `Radio.tsx`**

`src/design-system/atoms/Radio.tsx`:

```tsx
import { Pressable } from 'react-native';
import styled from 'styled-components/native';

export type RadioProps = {
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
};

const Outer = styled.View<{ selected: boolean; disabled: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ theme, selected }) => (selected ? theme.colors.primary : theme.colors.border)};
  opacity: ${({ theme, disabled }) => (disabled ? theme.opacity[40] : theme.opacity[100])};
`;

const Inner = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export function Radio({ selected = false, onPress, disabled = false }: RadioProps) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
      hitSlop={11}
    >
      <Outer selected={selected} disabled={disabled}>
        {selected ? <Inner /> : null}
      </Outer>
    </Pressable>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/design-system/atoms/Radio.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Verify types**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 6: Commit**

```bash
git add src/design-system/atoms/Radio.tsx src/design-system/atoms/Radio.test.tsx
git commit -m "feat(design-system): add Radio atom"
```

---

### Task 14: Barrel export and final verification

**Files:**
- Create: `src/design-system/atoms/index.ts`

**Interfaces:**
- Consumes: every atom from Tasks 4–13.
- Produces: a single import surface (`@/design-system/atoms`) for the Molecules phase and product screens to consume.

- [ ] **Step 1: Write `index.ts`**

`src/design-system/atoms/index.ts`:

```ts
export { Text, type TextProps } from './Text';
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize, type ButtonShape } from './Button';
export { TextField, type TextFieldProps } from './TextField';
export { Icon, type IconProps } from './Icon';
export { Avatar, type AvatarProps } from './Avatar';
export { Badge, type BadgeProps } from './Badge';
export { Chip, type ChipProps } from './Chip';
export { Switch, type SwitchProps } from './Switch';
export { Checkbox, type CheckboxProps } from './Checkbox';
export { Radio, type RadioProps } from './Radio';
```

- [ ] **Step 2: Verify the barrel compiles**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 3: Run the full test suite**

Run: `npx jest`
Expected: all suites pass (ThemeProvider + 10 atoms — 6 with dedicated interaction tests, 4 with smoke tests).

- [ ] **Step 4: Verify the app still bundles**

Run: `npx expo export --platform ios --output-dir /tmp/cometa-export-check && rm -rf /tmp/cometa-export-check`
Expected: exports successfully.

- [ ] **Step 5: Commit**

```bash
git add src/design-system/atoms/index.ts
git commit -m "feat(design-system): add atoms barrel export"
```
