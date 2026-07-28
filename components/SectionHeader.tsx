import { StyleSheet, Text, View } from 'react-native';
import { colors, font } from '@/constants/theme';
import { Touchable } from './Touchable';

type Props = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function SectionHeader({ title, actionLabel, onActionPress }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel ? (
        <Touchable
          onPress={onActionPress}
          accessibilityLabel={actionLabel}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.action}>{actionLabel}</Text>
        </Touchable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: { fontFamily: font.bold, fontSize: 20, color: colors.textPrimary },
  action: { fontFamily: font.medium, fontSize: 15, color: colors.textPrimary },
});
