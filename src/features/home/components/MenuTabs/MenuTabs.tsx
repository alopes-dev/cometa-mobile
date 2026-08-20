import { useMemo, useRef } from 'react';
import { Pressable, ScrollView, type LayoutChangeEvent } from 'react-native';
import { useTheme } from 'styled-components/native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { TabLabel, TabPill } from './MenuTabs.styles';

export type MenuTab = {
  key: string;
  title: string;
  icon?: string;
};

export type MenuTabsProps = {
  tabs: MenuTab[];
  selectedKey: string;
  onSelect: (key: string) => void;
};

const INDICATOR_DURATION = 240;

type TabLayout = { x: number; width: number };

export function MenuTabs({ tabs, selectedKey, onSelect }: MenuTabsProps) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const contentContainerStyle = useMemo(
    () => ({ gap: theme.spacing.sm, paddingHorizontal: theme.spacing.md }),
    [theme]
  );

  const layouts = useRef<Record<string, TabLayout>>({});
  const hasPositioned = useRef(false);
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  const moveIndicatorTo = (layout: TabLayout) => {
    if (!hasPositioned.current || reducedMotion) {
      hasPositioned.current = true;
      indicatorX.value = layout.x;
      indicatorWidth.value = layout.width;
      return;
    }
    indicatorX.value = withTiming(layout.x, { duration: INDICATOR_DURATION });
    indicatorWidth.value = withTiming(layout.width, { duration: INDICATOR_DURATION });
  };

  const handleTabLayout = (key: string) => (event: LayoutChangeEvent) => {
    const layout = { x: event.nativeEvent.layout.x, width: event.nativeEvent.layout.width };
    layouts.current[key] = layout;
    // Only auto-place from a layout event when it's the already-selected tab
    // settling in (e.g. on first mount) — a tap moves the indicator itself,
    // it shouldn't wait on the (still-stale) selectedKey prop to catch up.
    if (key === selectedKey) {
      moveIndicatorTo(layout);
    }
  };

  const handlePress = (key: string) => {
    onSelect(key);
    const layout = layouts.current[key];
    if (layout) {
      moveIndicatorTo(layout);
    }
  };

  const indicatorStyle = useAnimatedStyle(() => ({
    left: indicatorX.value,
    width: indicatorWidth.value,
  }));

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={contentContainerStyle}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            height: 40,
            borderRadius: theme.radius.pill,
            backgroundColor: theme.colors.categorySelected,
          },
          indicatorStyle,
        ]}
      />
      {tabs.map((tab) => {
        const selected = selectedKey === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => handlePress(tab.key)}
            onLayout={handleTabLayout(tab.key)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            hitSlop={6}
          >
            <TabPill>
              <TabLabel selected={selected}>{tab.icon ? `${tab.icon} ${tab.title}` : tab.title}</TabLabel>
            </TabPill>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
