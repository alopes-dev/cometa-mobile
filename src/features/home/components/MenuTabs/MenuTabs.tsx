import { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useTheme } from 'styled-components/native';
import { Chip } from '@/components/design-system/atoms';

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
      {tabs.map((tab) => (
        <Chip
          key={tab.key}
          label={tab.icon ? `${tab.icon} ${tab.title}` : tab.title}
          selected={selectedKey === tab.key}
          onPress={() => onSelect(tab.key)}
        />
      ))}
    </ScrollView>
  );
}
