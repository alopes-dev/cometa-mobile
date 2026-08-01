# Home / Browse & Discovery — Phase 4a Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Home tab's placeholder with a real, mock-data-backed browse experience: search + category filter + restaurant list, and a Restaurant Detail screen showing its menu.

**Architecture:** A `src/features/home/` module holds domain types, hand-written mock data, and a small data-access layer (`getRestaurants`, `getRestaurantById`, `getMenuItems`, `getCategories`) that's the only thing screens/components ever import — swapping in a real API later means rewriting just that one file. Two new generic molecules (`SearchBar`, `Card`) join the design system; three feature-specific components (`CategoryChipList`, `RestaurantCard`, `MenuItemRow`) compose them with domain data. The Home tab's existing Stack gains a `restaurant/[id]` route presented as a full-screen modal.

**Tech Stack:** Expo SDK 57, expo-router ~57.0.8, React Native 0.86, TypeScript, `styled-components/native`, `expo-image` (already installed, used for restaurant/menu images), Jest + `jest-expo` + `@testing-library/react-native`. No new dependencies.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-01-home-browse-discovery-design.md` — this plan implements it exactly; consult it for anything not repeated here.
- Restaurants vertical only. Mock/static data only — no real API integration.
- Menu items are view-only: no add-to-cart button or interaction anywhere in this phase (deferred to Phase 4b).
- Theme import path is `@/components/design-system/ThemeProvider` (the design system now lives under `src/components/design-system/`, not `src/design-system/`).
- New molecules/feature components follow the atoms' existing folder-per-component convention: `Component.tsx`, `Component.styles.ts` (styled-components, theme-driven — no `StyleSheet.create`, no inline `style={{...}}` for anything themeable), `Component.test.tsx`, `index.ts`. A component with no themeable styling needs no `.styles.ts` file.
- Path alias `@/*` → `./src/*` (already configured in `tsconfig.json`).
- `tsc --noEmit` and `npx jest` must be clean after every task.
- Known non-issue (already adjudicated in Phase 3): `npx expo export` does not regenerate `.expo/types/router.d.ts` in this Expo version. Still run it after adding new routes as a bundle-builds smoke check, but don't expect it to affect typed-route checking.
- Route files under `src/app/` are not unit-tested directly (established convention) — correctness verified via `tsc`, `expo export`, and a manual run-through.
- Test files are colocated next to the file they test, named `<Name>.test.ts`/`.test.tsx` (matches existing `testMatch` in `package.json`).

---

### Task 1: Home feature data layer

**Files:**
- Create: `src/features/home/types.ts`
- Create: `src/features/home/mockData.ts`
- Create: `src/features/home/data.ts`
- Create: `src/features/home/data.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `Restaurant`, `MenuItem` types; `getRestaurants(): Restaurant[]`, `getRestaurantById(id: string): Restaurant | undefined`, `getMenuItems(restaurantId: string): MenuItem[]`, `getCategories(): string[]`. Used by every later task in this plan.

- [ ] **Step 1: Write `types.ts`**

`src/features/home/types.ts`:

```ts
export type Restaurant = {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  cuisine: string;
  deliveryTimeMinutes: number;
  deliveryFee: number;
};

export type MenuItem = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
};
```

- [ ] **Step 2: Write `mockData.ts`**

`src/features/home/mockData.ts`:

```ts
import type { MenuItem, Restaurant } from './types';

export const mockRestaurants: Restaurant[] = [
  {
    id: 'r1',
    name: 'Sabores de Cabinda',
    imageUrl: 'https://picsum.photos/seed/r1/400/300',
    rating: 4.7,
    cuisine: 'Angolana',
    deliveryTimeMinutes: 25,
    deliveryFee: 500,
  },
  {
    id: 'r2',
    name: 'Marisqueira do Kinaxixe',
    imageUrl: 'https://picsum.photos/seed/r2/400/300',
    rating: 4.5,
    cuisine: 'Marisco',
    deliveryTimeMinutes: 35,
    deliveryFee: 700,
  },
  {
    id: 'r3',
    name: 'Pizza Talatona',
    imageUrl: 'https://picsum.photos/seed/r3/400/300',
    rating: 4.3,
    cuisine: 'Italiana',
    deliveryTimeMinutes: 30,
    deliveryFee: 600,
  },
  {
    id: 'r4',
    name: 'Burger Ingombota',
    imageUrl: 'https://picsum.photos/seed/r4/400/300',
    rating: 4.2,
    cuisine: 'Fast Food',
    deliveryTimeMinutes: 20,
    deliveryFee: 400,
  },
  {
    id: 'r5',
    name: 'Muxima Grill',
    imageUrl: 'https://picsum.photos/seed/r5/400/300',
    rating: 4.8,
    cuisine: 'Grelhados',
    deliveryTimeMinutes: 40,
    deliveryFee: 800,
  },
  {
    id: 'r6',
    name: 'Sushi Luanda',
    imageUrl: 'https://picsum.photos/seed/r6/400/300',
    rating: 4.6,
    cuisine: 'Japonesa',
    deliveryTimeMinutes: 45,
    deliveryFee: 900,
  },
];

export const mockMenuItems: MenuItem[] = [
  {
    id: 'r1-1',
    restaurantId: 'r1',
    name: 'Calulu de Peixe',
    description: 'Peixe seco cozinhado com quiabo, jinguba e óleo de palma.',
    price: 4500,
    imageUrl: 'https://picsum.photos/seed/r1-1/200/200',
    category: 'Pratos Principais',
  },
  {
    id: 'r1-2',
    restaurantId: 'r1',
    name: 'Funge com Feijão',
    description: 'Funge de bombó acompanhado de feijão de óleo de palma.',
    price: 3200,
    imageUrl: 'https://picsum.photos/seed/r1-2/200/200',
    category: 'Pratos Principais',
  },
  {
    id: 'r1-3',
    restaurantId: 'r1',
    name: 'Gindungo Frito',
    description: 'Entrada picante de pimenta gindungo frita.',
    price: 1500,
    imageUrl: 'https://picsum.photos/seed/r1-3/200/200',
    category: 'Entradas',
  },
  {
    id: 'r1-4',
    restaurantId: 'r1',
    name: 'Kissangua',
    description: 'Bebida tradicional fermentada de milho.',
    price: 1000,
    imageUrl: 'https://picsum.photos/seed/r1-4/200/200',
    category: 'Bebidas',
  },
  {
    id: 'r2-1',
    restaurantId: 'r2',
    name: 'Camarão Grelhado',
    description: 'Camarão fresco grelhado com alho e limão.',
    price: 6500,
    imageUrl: 'https://picsum.photos/seed/r2-1/200/200',
    category: 'Pratos Principais',
  },
  {
    id: 'r2-2',
    restaurantId: 'r2',
    name: 'Caranguejo à Moda da Casa',
    description: 'Caranguejo cozido no molho da casa.',
    price: 7200,
    imageUrl: 'https://picsum.photos/seed/r2-2/200/200',
    category: 'Pratos Principais',
  },
  {
    id: 'r2-3',
    restaurantId: 'r2',
    name: 'Salada de Polvo',
    description: 'Polvo cozido com cebola, azeite e coentros.',
    price: 3800,
    imageUrl: 'https://picsum.photos/seed/r2-3/200/200',
    category: 'Entradas',
  },
  {
    id: 'r2-4',
    restaurantId: 'r2',
    name: 'Sumo de Maboque',
    description: 'Sumo natural de fruta maboque.',
    price: 1200,
    imageUrl: 'https://picsum.photos/seed/r2-4/200/200',
    category: 'Bebidas',
  },
  {
    id: 'r3-1',
    restaurantId: 'r3',
    name: 'Pizza Margherita',
    description: 'Molho de tomate, mozzarella e manjericão fresco.',
    price: 4000,
    imageUrl: 'https://picsum.photos/seed/r3-1/200/200',
    category: 'Pratos Principais',
  },
  {
    id: 'r3-2',
    restaurantId: 'r3',
    name: 'Pizza Pepperoni',
    description: 'Molho de tomate, mozzarella e pepperoni.',
    price: 4800,
    imageUrl: 'https://picsum.photos/seed/r3-2/200/200',
    category: 'Pratos Principais',
  },
  {
    id: 'r3-3',
    restaurantId: 'r3',
    name: 'Bruschetta',
    description: 'Pão tostado com tomate, alho e azeite.',
    price: 2000,
    imageUrl: 'https://picsum.photos/seed/r3-3/200/200',
    category: 'Entradas',
  },
  {
    id: 'r3-4',
    restaurantId: 'r3',
    name: 'Tiramisu',
    description: 'Sobremesa italiana com café e mascarpone.',
    price: 2500,
    imageUrl: 'https://picsum.photos/seed/r3-4/200/200',
    category: 'Sobremesas',
  },
  {
    id: 'r4-1',
    restaurantId: 'r4',
    name: 'Cheeseburger Clássico',
    description: 'Hambúrguer de carne, queijo cheddar, alface e tomate.',
    price: 3000,
    imageUrl: 'https://picsum.photos/seed/r4-1/200/200',
    category: 'Pratos Principais',
  },
  {
    id: 'r4-2',
    restaurantId: 'r4',
    name: 'Burger Duplo Bacon',
    description: 'Duas carnes, bacon crocante e molho especial.',
    price: 3800,
    imageUrl: 'https://picsum.photos/seed/r4-2/200/200',
    category: 'Pratos Principais',
  },
  {
    id: 'r4-3',
    restaurantId: 'r4',
    name: 'Batata Frita',
    description: 'Porção de batata frita crocante.',
    price: 1200,
    imageUrl: 'https://picsum.photos/seed/r4-3/200/200',
    category: 'Entradas',
  },
  {
    id: 'r4-4',
    restaurantId: 'r4',
    name: 'Milkshake de Chocolate',
    description: 'Milkshake cremoso de chocolate.',
    price: 1800,
    imageUrl: 'https://picsum.photos/seed/r4-4/200/200',
    category: 'Bebidas',
  },
  {
    id: 'r5-1',
    restaurantId: 'r5',
    name: 'Espetada de Frango',
    description: 'Espetada de frango grelhado com pimentos.',
    price: 4200,
    imageUrl: 'https://picsum.photos/seed/r5-1/200/200',
    category: 'Pratos Principais',
  },
  {
    id: 'r5-2',
    restaurantId: 'r5',
    name: 'Costela de Porco Grelhada',
    description: 'Costela suína grelhada com molho barbecue.',
    price: 5200,
    imageUrl: 'https://picsum.photos/seed/r5-2/200/200',
    category: 'Pratos Principais',
  },
  {
    id: 'r5-3',
    restaurantId: 'r5',
    name: 'Salada Mista',
    description: 'Alface, tomate, cebola e pepino.',
    price: 1500,
    imageUrl: 'https://picsum.photos/seed/r5-3/200/200',
    category: 'Entradas',
  },
  {
    id: 'r5-4',
    restaurantId: 'r5',
    name: 'Cerveja Cuca',
    description: 'Cerveja angolana gelada.',
    price: 1000,
    imageUrl: 'https://picsum.photos/seed/r5-4/200/200',
    category: 'Bebidas',
  },
  {
    id: 'r6-1',
    restaurantId: 'r6',
    name: 'Combo Sashimi',
    description: '12 peças variadas de sashimi fresco.',
    price: 7500,
    imageUrl: 'https://picsum.photos/seed/r6-1/200/200',
    category: 'Pratos Principais',
  },
  {
    id: 'r6-2',
    restaurantId: 'r6',
    name: 'Uramaki Philadelphia',
    description: 'Salmão, queijo creme e pepino.',
    price: 5500,
    imageUrl: 'https://picsum.photos/seed/r6-2/200/200',
    category: 'Pratos Principais',
  },
  {
    id: 'r6-3',
    restaurantId: 'r6',
    name: 'Edamame',
    description: 'Vagens de soja cozidas com sal marinho.',
    price: 1800,
    imageUrl: 'https://picsum.photos/seed/r6-3/200/200',
    category: 'Entradas',
  },
  {
    id: 'r6-4',
    restaurantId: 'r6',
    name: 'Chá Verde Gelado',
    description: 'Chá verde japonês servido gelado.',
    price: 1100,
    imageUrl: 'https://picsum.photos/seed/r6-4/200/200',
    category: 'Bebidas',
  },
];
```

- [ ] **Step 3: Write the failing test for `data.ts`**

`src/features/home/data.test.ts`:

```ts
import { getCategories, getMenuItems, getRestaurantById, getRestaurants } from './data';

describe('data', () => {
  it('getRestaurants returns a non-empty array of restaurants with the expected shape', () => {
    const restaurants = getRestaurants();
    expect(restaurants.length).toBeGreaterThan(0);
    for (const restaurant of restaurants) {
      expect(typeof restaurant.id).toBe('string');
      expect(typeof restaurant.name).toBe('string');
      expect(typeof restaurant.imageUrl).toBe('string');
      expect(typeof restaurant.rating).toBe('number');
      expect(typeof restaurant.cuisine).toBe('string');
      expect(typeof restaurant.deliveryTimeMinutes).toBe('number');
      expect(typeof restaurant.deliveryFee).toBe('number');
    }
  });

  it('getRestaurantById returns the matching restaurant', () => {
    const [first] = getRestaurants();
    expect(getRestaurantById(first.id)).toEqual(first);
  });

  it('getRestaurantById returns undefined for an unknown id', () => {
    expect(getRestaurantById('does-not-exist')).toBeUndefined();
  });

  it('getMenuItems returns only items belonging to the given restaurant', () => {
    const [first] = getRestaurants();
    const items = getMenuItems(first.id);
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.restaurantId).toBe(first.id);
    }
  });

  it('getCategories returns a deduped list of cuisines', () => {
    const categories = getCategories();
    const unique = new Set(categories);
    expect(categories.length).toBe(unique.size);
    expect(categories.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npx jest src/features/home/data.test.ts`
Expected: FAIL — `Cannot find module './data'`.

- [ ] **Step 5: Write `data.ts`**

`src/features/home/data.ts`:

```ts
import { mockMenuItems, mockRestaurants } from './mockData';
import type { MenuItem, Restaurant } from './types';

export function getRestaurants(): Restaurant[] {
  return mockRestaurants;
}

export function getRestaurantById(id: string): Restaurant | undefined {
  return mockRestaurants.find((restaurant) => restaurant.id === id);
}

export function getMenuItems(restaurantId: string): MenuItem[] {
  return mockMenuItems.filter((item) => item.restaurantId === restaurantId);
}

export function getCategories(): string[] {
  return Array.from(new Set(mockRestaurants.map((restaurant) => restaurant.cuisine)));
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx jest src/features/home/data.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 7: Verify types**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 8: Commit**

```bash
git add src/features/home/types.ts src/features/home/mockData.ts src/features/home/data.ts src/features/home/data.test.ts
git commit -m "feat(home): add restaurant/menu types, mock data, and data access layer"
```

---

### Task 2: SearchBar molecule

**Files:**
- Create: `src/components/design-system/molecules/SearchBar/SearchBar.tsx`
- Create: `src/components/design-system/molecules/SearchBar/SearchBar.styles.ts`
- Create: `src/components/design-system/molecules/SearchBar/SearchBar.test.tsx`
- Create: `src/components/design-system/molecules/SearchBar/index.ts`

**Interfaces:**
- Consumes: `Icon` from `@/components/design-system/atoms` (Phase 2).
- Produces: `SearchBar` component and `SearchBarProps` type. Used by Task 7 (Home screen).

- [ ] **Step 1: Write the test**

`src/components/design-system/molecules/SearchBar/SearchBar.test.tsx`:

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { SearchBar } from './SearchBar';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('SearchBar', () => {
  it('fires onChangeText with the typed value', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = renderWithTheme(
      <SearchBar value="" onChangeText={onChangeText} placeholder="Buscar restaurantes" />
    );
    fireEvent.changeText(getByPlaceholderText('Buscar restaurantes'), 'pizza');
    expect(onChangeText).toHaveBeenCalledWith('pizza');
  });

  it('renders the current value', () => {
    const { getByDisplayValue } = renderWithTheme(
      <SearchBar value="sushi" onChangeText={() => {}} placeholder="Buscar restaurantes" />
    );
    expect(getByDisplayValue('sushi')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/components/design-system/molecules/SearchBar/SearchBar.test.tsx`
Expected: FAIL — `Cannot find module './SearchBar'`.

- [ ] **Step 3: Write `SearchBar.styles.ts`**

`src/components/design-system/molecules/SearchBar/SearchBar.styles.ts`:

```ts
import styled from 'styled-components/native';
import { TextInput } from 'react-native';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

export const Field = styled(TextInput)`
  flex: 1;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
`;
```

- [ ] **Step 4: Write `SearchBar.tsx`**

`src/components/design-system/molecules/SearchBar/SearchBar.tsx`:

```tsx
import { useTheme } from 'styled-components/native';
import { Icon } from '@/components/design-system/atoms';
import { Container, Field } from './SearchBar.styles';

export type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function SearchBar({ value, onChangeText, placeholder = 'Buscar restaurantes' }: SearchBarProps) {
  const theme = useTheme();

  return (
    <Container>
      <Icon name="search" sf="magnifyingglass" size={18} color="textSecondary" />
      <Field
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        accessibilityLabel={placeholder}
      />
    </Container>
  );
}
```

- [ ] **Step 5: Write `index.ts`**

`src/components/design-system/molecules/SearchBar/index.ts`:

```ts
export { SearchBar, type SearchBarProps } from './SearchBar';
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx jest src/components/design-system/molecules/SearchBar/SearchBar.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 7: Verify types**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 8: Commit**

```bash
git add src/components/design-system/molecules/SearchBar
git commit -m "feat(design-system): add SearchBar molecule"
```

---

### Task 3: Card molecule and molecules barrel export

**Files:**
- Create: `src/components/design-system/molecules/Card/Card.tsx`
- Create: `src/components/design-system/molecules/Card/Card.styles.ts`
- Create: `src/components/design-system/molecules/Card/Card.test.tsx`
- Create: `src/components/design-system/molecules/Card/index.ts`
- Create: `src/components/design-system/molecules/index.ts`

**Interfaces:**
- Consumes: nothing from other atoms/molecules.
- Produces: `Card` component and `CardProps` type; a `molecules` barrel exporting both `SearchBar` and `Card`. Used by Task 5 (`RestaurantCard`) and available for the Home screen (Task 7) to import `SearchBar` from.

- [ ] **Step 1: Write the test**

`src/components/design-system/molecules/Card/Card.test.tsx`:

```tsx
import { Text as RNText } from 'react-native';
import { render } from '@testing-library/react-native';
import { Card } from './Card';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Card', () => {
  it('renders its children', () => {
    const { getByText } = renderWithTheme(
      <Card>
        <RNText>Inside the card</RNText>
      </Card>
    );
    expect(getByText('Inside the card')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/components/design-system/molecules/Card/Card.test.tsx`
Expected: FAIL — `Cannot find module './Card'`.

- [ ] **Step 3: Write `Card.styles.ts`**

`src/components/design-system/molecules/Card/Card.styles.ts`:

```ts
import styled from 'styled-components/native';

export const Container = styled.View`
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.md}px;
  shadow-color: #000000;
  shadow-offset: 0px ${({ theme }) => theme.elevation.level1.ios.shadowOffset.height}px;
  shadow-opacity: ${({ theme }) => theme.elevation.level1.ios.shadowOpacity};
  shadow-radius: ${({ theme }) => theme.elevation.level1.ios.shadowRadius}px;
  elevation: ${({ theme }) => theme.elevation.level1.android.elevation};
`;
```

- [ ] **Step 4: Write `Card.tsx`**

`src/components/design-system/molecules/Card/Card.tsx`:

```tsx
import type { ReactNode } from 'react';
import { Container } from './Card.styles';

export type CardProps = {
  children?: ReactNode;
};

export function Card({ children }: CardProps) {
  return <Container>{children}</Container>;
}
```

- [ ] **Step 5: Write `index.ts` for Card**

`src/components/design-system/molecules/Card/index.ts`:

```ts
export { Card, type CardProps } from './Card';
```

- [ ] **Step 6: Write the molecules barrel**

`src/components/design-system/molecules/index.ts`:

```ts
export { SearchBar, type SearchBarProps } from './SearchBar';
export { Card, type CardProps } from './Card';
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npx jest src/components/design-system/molecules/Card/Card.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 8: Verify types**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 9: Commit**

```bash
git add src/components/design-system/molecules/Card src/components/design-system/molecules/index.ts
git commit -m "feat(design-system): add Card molecule and molecules barrel export"
```

---

### Task 4: CategoryChipList feature component

**Files:**
- Create: `src/features/home/components/CategoryChipList/CategoryChipList.tsx`
- Create: `src/features/home/components/CategoryChipList/CategoryChipList.test.tsx`
- Create: `src/features/home/components/CategoryChipList/index.ts`

**Interfaces:**
- Consumes: `Chip` from `@/components/design-system/atoms` (Phase 2).
- Produces: `CategoryChipList` component and `CategoryChipListProps` type. Used by Task 7 (Home screen).

- [ ] **Step 1: Write the test**

`src/features/home/components/CategoryChipList/CategoryChipList.test.tsx`:

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { CategoryChipList } from './CategoryChipList';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('CategoryChipList', () => {
  it('renders a "Todos" chip plus one chip per category', () => {
    const { getByText } = renderWithTheme(
      <CategoryChipList categories={['Angolana', 'Italiana']} selected={null} onSelect={() => {}} />
    );
    expect(getByText('Todos')).toBeTruthy();
    expect(getByText('Angolana')).toBeTruthy();
    expect(getByText('Italiana')).toBeTruthy();
  });

  it('calls onSelect with the category name when a chip is pressed', () => {
    const onSelect = jest.fn();
    const { getByText } = renderWithTheme(
      <CategoryChipList categories={['Angolana', 'Italiana']} selected={null} onSelect={onSelect} />
    );
    fireEvent.press(getByText('Italiana'));
    expect(onSelect).toHaveBeenCalledWith('Italiana');
  });

  it('calls onSelect with null when "Todos" is pressed', () => {
    const onSelect = jest.fn();
    const { getByText } = renderWithTheme(
      <CategoryChipList categories={['Angolana']} selected="Angolana" onSelect={onSelect} />
    );
    fireEvent.press(getByText('Todos'));
    expect(onSelect).toHaveBeenCalledWith(null);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/features/home/components/CategoryChipList/CategoryChipList.test.tsx`
Expected: FAIL — `Cannot find module './CategoryChipList'`.

- [ ] **Step 3: Write `CategoryChipList.tsx`**

`src/features/home/components/CategoryChipList/CategoryChipList.tsx`:

```tsx
import { ScrollView } from 'react-native';
import { Chip } from '@/components/design-system/atoms';

export type CategoryChipListProps = {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
};

export function CategoryChipList({ categories, selected, onSelect }: CategoryChipListProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
    >
      <Chip label="Todos" selected={selected === null} onPress={() => onSelect(null)} />
      {categories.map((category) => (
        <Chip
          key={category}
          label={category}
          selected={selected === category}
          onPress={() => onSelect(category)}
        />
      ))}
    </ScrollView>
  );
}
```

- [ ] **Step 4: Write `index.ts`**

`src/features/home/components/CategoryChipList/index.ts`:

```ts
export { CategoryChipList, type CategoryChipListProps } from './CategoryChipList';
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx jest src/features/home/components/CategoryChipList/CategoryChipList.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 6: Verify types**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 7: Commit**

```bash
git add src/features/home/components/CategoryChipList
git commit -m "feat(home): add CategoryChipList component"
```

---

### Task 5: RestaurantCard feature component

**Files:**
- Create: `src/features/home/components/RestaurantCard/RestaurantCard.tsx`
- Create: `src/features/home/components/RestaurantCard/RestaurantCard.styles.ts`
- Create: `src/features/home/components/RestaurantCard/RestaurantCard.test.tsx`
- Create: `src/features/home/components/RestaurantCard/index.ts`

**Interfaces:**
- Consumes: `Text`, `Icon` from `@/components/design-system/atoms`; `Card` from `@/components/design-system/molecules` (Task 3); `Restaurant` type from `@/features/home/types` (Task 1).
- Produces: `RestaurantCard` component and `RestaurantCardProps` type. Used by Task 7 (Home screen).

- [ ] **Step 1: Write the test**

`src/features/home/components/RestaurantCard/RestaurantCard.test.tsx`:

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { RestaurantCard } from './RestaurantCard';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';
import type { Restaurant } from '../../types';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const restaurant: Restaurant = {
  id: 'r1',
  name: 'Sabores de Cabinda',
  imageUrl: 'https://picsum.photos/seed/r1/400/300',
  rating: 4.7,
  cuisine: 'Angolana',
  deliveryTimeMinutes: 25,
  deliveryFee: 500,
};

describe('RestaurantCard', () => {
  it('renders the restaurant name, cuisine, and rating', () => {
    const { getByText } = renderWithTheme(<RestaurantCard restaurant={restaurant} onPress={() => {}} />);
    expect(getByText('Sabores de Cabinda')).toBeTruthy();
    expect(getByText('Angolana')).toBeTruthy();
    expect(getByText('4.7')).toBeTruthy();
  });

  it('fires onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = renderWithTheme(<RestaurantCard restaurant={restaurant} onPress={onPress} />);
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/features/home/components/RestaurantCard/RestaurantCard.test.tsx`
Expected: FAIL — `Cannot find module './RestaurantCard'`.

- [ ] **Step 3: Write `RestaurantCard.styles.ts`**

`src/features/home/components/RestaurantCard/RestaurantCard.styles.ts`:

```ts
import styled from 'styled-components/native';

export const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

export const MetaRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;
```

- [ ] **Step 4: Write `RestaurantCard.tsx`**

`src/features/home/components/RestaurantCard/RestaurantCard.tsx`:

```tsx
import { Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Text, Icon } from '@/components/design-system/atoms';
import { Card } from '@/components/design-system/molecules';
import type { Restaurant } from '../../types';
import { InfoRow, MetaRow } from './RestaurantCard.styles';

export type RestaurantCardProps = {
  restaurant: Restaurant;
  onPress: () => void;
};

export function RestaurantCard({ restaurant, onPress }: RestaurantCardProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <Card>
        <Image
          source={{ uri: restaurant.imageUrl }}
          style={{ width: '100%', height: 140, borderRadius: 12 }}
          contentFit="cover"
        />
        <InfoRow>
          <Text variant="bodyEmphasized">{restaurant.name}</Text>
          <MetaRow>
            <Icon name="star" sf="star.fill" size={14} color="warning" />
            <Text variant="footnote" color="textSecondary">
              {restaurant.rating.toFixed(1)}
            </Text>
          </MetaRow>
        </InfoRow>
        <Text variant="footnote" color="textSecondary">
          {restaurant.cuisine}
        </Text>
        <Text variant="footnote" color="textSecondary">
          {restaurant.deliveryTimeMinutes} min · {restaurant.deliveryFee} Kz
        </Text>
      </Card>
    </Pressable>
  );
}
```

- [ ] **Step 5: Write `index.ts`**

`src/features/home/components/RestaurantCard/index.ts`:

```ts
export { RestaurantCard, type RestaurantCardProps } from './RestaurantCard';
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx jest src/features/home/components/RestaurantCard/RestaurantCard.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 7: Verify types**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 8: Commit**

```bash
git add src/features/home/components/RestaurantCard
git commit -m "feat(home): add RestaurantCard component"
```

---

### Task 6: MenuItemRow feature component

**Files:**
- Create: `src/features/home/components/MenuItemRow/MenuItemRow.tsx`
- Create: `src/features/home/components/MenuItemRow/MenuItemRow.styles.ts`
- Create: `src/features/home/components/MenuItemRow/MenuItemRow.test.tsx`
- Create: `src/features/home/components/MenuItemRow/index.ts`

**Interfaces:**
- Consumes: `Text` from `@/components/design-system/atoms`; `MenuItem` type from `@/features/home/types` (Task 1).
- Produces: `MenuItemRow` component and `MenuItemRowProps` type. Used by Task 8 (Restaurant Detail screen).

- [ ] **Step 1: Write the test**

`src/features/home/components/MenuItemRow/MenuItemRow.test.tsx`:

```tsx
import { render } from '@testing-library/react-native';
import { MenuItemRow } from './MenuItemRow';
import { ThemeProvider } from '@/components/design-system/ThemeProvider';
import type { MenuItem } from '../../types';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const item: MenuItem = {
  id: 'r1-1',
  restaurantId: 'r1',
  name: 'Calulu de Peixe',
  description: 'Peixe seco cozinhado com quiabo, jinguba e óleo de palma.',
  price: 4500,
  imageUrl: 'https://picsum.photos/seed/r1-1/200/200',
  category: 'Pratos Principais',
};

describe('MenuItemRow', () => {
  it('renders the item name, description, and price', () => {
    const { getByText } = renderWithTheme(<MenuItemRow item={item} />);
    expect(getByText('Calulu de Peixe')).toBeTruthy();
    expect(getByText(item.description)).toBeTruthy();
    expect(getByText('4500 Kz')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/features/home/components/MenuItemRow/MenuItemRow.test.tsx`
Expected: FAIL — `Cannot find module './MenuItemRow'`.

- [ ] **Step 3: Write `MenuItemRow.styles.ts`**

`src/features/home/components/MenuItemRow/MenuItemRow.styles.ts`:

```ts
import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
`;

export const Info = styled.View`
  flex: 1;
  gap: 2px;
`;
```

- [ ] **Step 4: Write `MenuItemRow.tsx`**

`src/features/home/components/MenuItemRow/MenuItemRow.tsx`:

```tsx
import { Image } from 'expo-image';
import { Text } from '@/components/design-system/atoms';
import type { MenuItem } from '../../types';
import { Container, Info } from './MenuItemRow.styles';

export type MenuItemRowProps = {
  item: MenuItem;
};

export function MenuItemRow({ item }: MenuItemRowProps) {
  return (
    <Container>
      <Image
        source={{ uri: item.imageUrl }}
        style={{ width: 64, height: 64, borderRadius: 8 }}
        contentFit="cover"
      />
      <Info>
        <Text variant="bodyEmphasized">{item.name}</Text>
        <Text variant="footnote" color="textSecondary" numberOfLines={2}>
          {item.description}
        </Text>
        <Text variant="footnote" color="primary">
          {item.price} Kz
        </Text>
      </Info>
    </Container>
  );
}
```

- [ ] **Step 5: Write `index.ts`**

`src/features/home/components/MenuItemRow/index.ts`:

```ts
export { MenuItemRow, type MenuItemRowProps } from './MenuItemRow';
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx jest src/features/home/components/MenuItemRow/MenuItemRow.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 7: Verify types**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 8: Commit**

```bash
git add src/features/home/components/MenuItemRow
git commit -m "feat(home): add MenuItemRow component"
```

---

### Task 7: Home feed screen

**Files:**
- Modify: `src/app/(tabs)/(home)/index.tsx`

**Interfaces:**
- Consumes: `getRestaurants`, `getCategories` from `@/features/home/data` (Task 1); `SearchBar` from `@/components/design-system/molecules` (Task 2); `CategoryChipList` from `@/features/home/components/CategoryChipList` (Task 4); `RestaurantCard` from `@/features/home/components/RestaurantCard` (Task 5); `Text` from `@/components/design-system/atoms`.
- Produces: the real `/` (Home tab) route content. No later task in this plan depends on it.

- [ ] **Step 1: Rewrite `(tabs)/(home)/index.tsx`**

`src/app/(tabs)/(home)/index.tsx`:

```tsx
import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { Text } from '@/components/design-system/atoms';
import { SearchBar } from '@/components/design-system/molecules';
import { CategoryChipList } from '@/features/home/components/CategoryChipList';
import { RestaurantCard } from '@/features/home/components/RestaurantCard';
import { getCategories, getRestaurants } from '@/features/home/data';
import type { Restaurant } from '@/features/home/types';

const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-top: ${({ theme }) => theme.spacing.md}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
`;

const EmptyState = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const restaurants = useMemo(() => getRestaurants(), []);
  const categories = useMemo(() => getCategories(), []);

  const filteredRestaurants = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return restaurants.filter((restaurant) => {
      const matchesCategory = !selectedCategory || restaurant.cuisine === selectedCategory;
      const matchesQuery =
        !query ||
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.cuisine.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [restaurants, searchQuery, selectedCategory]);

  return (
    <Screen>
      <Header>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Buscar restaurantes" />
        <CategoryChipList categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
      </Header>
      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item: Restaurant) => item.id}
        contentContainerStyle={{ padding: 16, gap: 16 }}
        renderItem={({ item }) => (
          <RestaurantCard restaurant={item} onPress={() => router.push(`/restaurant/${item.id}`)} />
        )}
        ListEmptyComponent={
          <EmptyState>
            <Text color="textSecondary">Nenhum restaurante encontrado</Text>
          </EmptyState>
        }
      />
    </Screen>
  );
}
```

- [ ] **Step 2: Regenerate typed routes and verify the bundle**

Run: `npx expo export --platform ios --output-dir /tmp/cometa-export-check && rm -rf /tmp/cometa-export-check`
Expected: exports successfully.

- [ ] **Step 3: Verify types**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 4: Verify the full test suite still passes**

Run: `npx jest`
Expected: all suites pass (this task adds no new test file, but confirms the rewrite didn't break anything).

- [ ] **Step 5: Commit**

```bash
git add "src/app/(tabs)/(home)/index.tsx"
git commit -m "feat(home): wire up the real Home feed (search, categories, restaurant list)"
```

---

### Task 8: Restaurant Detail screen

**Files:**
- Create: `src/app/(tabs)/(home)/restaurant/[id].tsx`
- Modify: `src/app/(tabs)/(home)/_layout.tsx`

**Interfaces:**
- Consumes: `getRestaurantById`, `getMenuItems` from `@/features/home/data` (Task 1); `MenuItemRow` from `@/features/home/components/MenuItemRow` (Task 6); `Text`, `Icon` from `@/components/design-system/atoms`; `MenuItem` type from `@/features/home/types`.
- Produces: the `/restaurant/[id]` route, presented as a full-screen modal from the Home tab's stack. No later task in this plan depends on it.

- [ ] **Step 1: Write `restaurant/[id].tsx`**

`src/app/(tabs)/(home)/restaurant/[id].tsx`:

```tsx
import { useMemo } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { SectionList } from 'react-native';
import { Image } from 'expo-image';
import styled from 'styled-components/native';
import { Text, Icon } from '@/components/design-system/atoms';
import { MenuItemRow } from '@/features/home/components/MenuItemRow';
import { getMenuItems, getRestaurantById } from '@/features/home/data';
import type { MenuItem } from '@/features/home/types';

const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const HeaderInfo = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => theme.spacing.md}px;
`;

const MetaRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const RatingRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const SectionHeader = styled.View`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const NotFoundScreen = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

type MenuSection = {
  title: string;
  data: MenuItem[];
};

export default function RestaurantDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const restaurant = useMemo(() => getRestaurantById(id), [id]);
  const menuItems = useMemo(() => getMenuItems(id), [id]);

  const sections = useMemo<MenuSection[]>(() => {
    const byCategory = new Map<string, MenuItem[]>();
    for (const item of menuItems) {
      const existing = byCategory.get(item.category) ?? [];
      existing.push(item);
      byCategory.set(item.category, existing);
    }
    return Array.from(byCategory.entries()).map(([title, data]) => ({ title, data }));
  }, [menuItems]);

  if (!restaurant) {
    return (
      <NotFoundScreen>
        <Text color="textSecondary">Restaurante não encontrado</Text>
      </NotFoundScreen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: restaurant.name }} />
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <Image
              source={{ uri: restaurant.imageUrl }}
              style={{ width: '100%', height: 180 }}
              contentFit="cover"
            />
            <HeaderInfo>
              <Text variant="title1">{restaurant.name}</Text>
              <MetaRow>
                <RatingRow>
                  <Icon name="star" sf="star.fill" size={14} color="warning" />
                  <Text variant="footnote" color="textSecondary">
                    {restaurant.rating.toFixed(1)}
                  </Text>
                </RatingRow>
                <Text variant="footnote" color="textSecondary">
                  {restaurant.cuisine}
                </Text>
                <Text variant="footnote" color="textSecondary">
                  {restaurant.deliveryTimeMinutes} min · {restaurant.deliveryFee} Kz
                </Text>
              </MetaRow>
            </HeaderInfo>
          </>
        }
        renderItem={({ item }) => <MenuItemRow item={item} />}
        renderSectionHeader={({ section }) => (
          <SectionHeader>
            <Text variant="title2">{section.title}</Text>
          </SectionHeader>
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
      />
    </Screen>
  );
}
```

- [ ] **Step 2: Modify `(tabs)/(home)/_layout.tsx` to register the new modal route**

`src/app/(tabs)/(home)/_layout.tsx`:

```tsx
import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="restaurant/[id]"
        options={{
          headerShown: true,
          presentation: 'modal',
          title: 'Restaurante',
        }}
      />
    </Stack>
  );
}
```

- [ ] **Step 3: Regenerate typed routes and verify the bundle**

Run: `npx expo export --platform ios --output-dir /tmp/cometa-export-check && rm -rf /tmp/cometa-export-check`
Expected: exports successfully.

- [ ] **Step 4: Verify types**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 5: Verify the full test suite still passes**

Run: `npx jest`
Expected: all suites pass.

- [ ] **Step 6: Manually verify the browse-to-menu flow**

Run `npx expo start`, open in the iOS simulator, sign in past onboarding/auth (or reset app state to reach the tabs), and confirm:
1. Home tab shows the search bar, category chips, and a scrollable list of restaurant cards.
2. Typing in the search bar filters the list by name/cuisine.
3. Tapping a category chip filters the list to that cuisine; tapping "Todos" clears the filter.
4. Tapping a restaurant card opens Restaurant Detail as a full-screen modal (tab bar hidden), showing the header info and menu grouped by category.
5. The modal's header title matches the restaurant's name; dismissing the modal returns to the Home feed with search/filter state intact.

- [ ] **Step 7: Commit**

```bash
git add "src/app/(tabs)/(home)/restaurant" "src/app/(tabs)/(home)/_layout.tsx"
git commit -m "feat(home): add Restaurant Detail screen as a full-screen modal"
```
