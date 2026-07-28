import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { colors, font, radius } from '@/constants/theme';
import type { Product } from '@/data/catalog';
import { Touchable } from './Touchable';

type Props = { product: Product; width: number; onPress?: () => void };

export function ProductCard({ product, width, onPress }: Props) {
  return (
    <Touchable
      onPress={onPress}
      accessibilityLabel={`${product.title}, $${product.price}`}
      style={[styles.card, { width }]}
    >
      <Image
        source={product.image}
        style={styles.image}
        contentFit="cover"
        cachePolicy="memory-disk"
        accessibilityIgnoresInvertColors
      />
      <Text numberOfLines={2} style={styles.title}>
        {product.title}
      </Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>${product.price}</Text>
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    gap: 10,
  },
  image: { width: '100%', aspectRatio: 1, borderRadius: radius.image },
  title: { fontFamily: font.semibold, fontSize: 15, color: colors.textPrimary, minHeight: 40 },
  priceRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  price: { fontFamily: font.bold, fontSize: 15, color: colors.textPrimary },
});
