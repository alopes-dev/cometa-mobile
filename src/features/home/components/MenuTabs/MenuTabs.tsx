import { useMemo } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { useTheme } from 'styled-components/native';
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

export function MenuTabs({ tabs, selectedKey, onSelect }: MenuTabsProps) {
  const theme = useTheme();
  const contentContainerStyle = useMemo(
    () => ({ gap: theme.spacing.sm, paddingHorizontal: theme.spacing.md }),
    [theme]
  );

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={contentContainerStyle}>
      {tabs.map((tab) => {
        const selected = selectedKey === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onSelect(tab.key)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            hitSlop={6}
          >
            <TabPill selected={selected}>
              <TabLabel selected={selected}>{tab.icon ? `${tab.icon} ${tab.title}` : tab.title}</TabLabel>
            </TabPill>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
