import { useMemo } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { useTheme } from 'styled-components/native';
import { TabHit, TabLabel, Underline } from './MenuTabs.styles';

export type MenuTab = {
  key: string;
  title: string;
};

export type MenuTabsProps = {
  tabs: MenuTab[];
  selectedKey: string;
  onSelect: (key: string) => void;
};

export function MenuTabs({ tabs, selectedKey, onSelect }: MenuTabsProps) {
  const theme = useTheme();
  const contentContainerStyle = useMemo(
    () => ({
      gap: theme.business.metrics.categoryGap,
      paddingHorizontal: theme.business.metrics.categoriesPadding,
    }),
    [theme]
  );

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={contentContainerStyle}
      >
        {tabs.map((tab) => {
          const selected = selectedKey === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onSelect(tab.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              hitSlop={6}
            >
              <TabHit>
                <TabLabel selected={selected}>{tab.title}</TabLabel>
              </TabHit>
            </Pressable>
          );
        })}
      </ScrollView>
      <Underline />
    </>
  );
}
