import { StyleSheet, Text, View } from 'react-native';
import { colors, font } from '@/constants/theme';
import type { QuickAction } from '@/data/catalog';
import { Touchable } from './Touchable';

type Props = { items: QuickAction[]; onPress?: (id: QuickAction['id']) => void };

export function QuickActionList({ items, onPress }: Props) {
  return (
    <View>
      {items.map((item, idx) => {
        const { Icon } = item;
        return (
          <View key={item.id}>
            <Touchable
              onPress={() => onPress?.(item.id)}
              accessibilityLabel={item.label}
              style={styles.row}
            >
              <Icon size={22} color={colors.textPrimary} strokeWidth={2} />
              <Text style={styles.label}>{item.label}</Text>
            </Touchable>
            {idx < items.length - 1 ? <View style={styles.divider} /> : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  label: { fontFamily: font.medium, fontSize: 17, color: colors.textPrimary },
  divider: { height: 1, backgroundColor: colors.divider },
});
