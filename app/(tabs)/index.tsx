import { useMemo, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderDark } from '@/components/HeaderDark';
import { QuickActionList } from '@/components/QuickActionList';
import { SectionHeader } from '@/components/SectionHeader';
import { CategoryChip } from '@/components/CategoryChip';
import { ProductCard } from '@/components/ProductCard';
import { FloatingCartCTA } from '@/components/FloatingCartCTA';
import { HomeIndicator } from '@/components/HomeIndicator';
import { Touchable } from '@/components/Touchable';
import { CATEGORIES, PRODUCTS, QUICK_ACTIONS, type CategoryId } from '@/data/catalog';
import { colors, font, layout } from '@/constants/theme';
import { useCart } from '@/store/cart';
import { useStagger } from '@/hooks/useStagger';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Home() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { count } = useCart();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);

  const [s1, s2, s3] = useStagger(3);
  const scrollY = useRef(new Animated.Value(0)).current;

  const cardWidth = (width - 2 * layout.screenPadding - layout.gridGap) / 2;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const matchesCategory = activeCategory ? p.category === activeCategory : true;
      const matchesQuery = q.length === 0 ? true : p.title.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  const setFilter = (id: CategoryId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveCategory((cur) => (cur === id ? null : id));
  };

  return (
    <KeyboardAvoidingView style={styles.wrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <HeaderDark query={query} onChangeQuery={setQuery} scrollY={scrollY} />

      <Animated.ScrollView
        style={styles.sheet}
        contentContainerStyle={[styles.sheetContent, { paddingBottom: layout.scrollBottomPadding }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <Animated.View style={{ opacity: s1.opacity, transform: [{ translateY: s1.translateY }] }}>
          <View style={styles.section}>
            <QuickActionList items={QUICK_ACTIONS} />
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: s2.opacity, transform: [{ translateY: s2.translateY }] }}>
          <View style={styles.section}>
            <SectionHeader title="Top Categories" actionLabel="View all →" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsContent}
              style={styles.chips}
            >
              {CATEGORIES.map((c) => (
                <CategoryChip
                  key={c.id}
                  category={c}
                  isActive={activeCategory === c.id}
                  onPress={() => setFilter(c.id)}
                />
              ))}
            </ScrollView>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: s3.opacity, transform: [{ translateY: s3.translateY }] }}>
          <View style={styles.section}>
            <SectionHeader title="Recommended for you" actionLabel="View all →" />
            {filtered.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>No dishes match that search</Text>
                <Touchable
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setQuery('');
                  }}
                  accessibilityLabel="Clear search"
                >
                  <Text style={styles.emptyAction}>Clear search</Text>
                </Touchable>
              </View>
            ) : (
              <View style={styles.grid}>
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} width={cardWidth} />
                ))}
              </View>
            )}
          </View>
        </Animated.View>
      </Animated.ScrollView>

      <FloatingCartCTA
        visible={count > 0}
        count={count}
        bottom={insets.bottom + layout.navBottomOffset + layout.navHeight + layout.ctaGap}
      />

      <HomeIndicator />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.surfaceDark },
  sheet: {
    flex: 1,
    marginTop: -20,
    backgroundColor: colors.surfaceLight,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  sheetContent: { paddingHorizontal: layout.screenPadding, paddingTop: 12 },
  section: { marginBottom: layout.sectionGap },
  chips: { marginHorizontal: -layout.screenPadding },
  chipsContent: { paddingHorizontal: layout.screenPadding, gap: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: layout.gridGap },
  empty: { alignItems: 'center', paddingVertical: 32 },
  emptyText: { fontFamily: font.regular, fontSize: 15, color: colors.textSecondary },
  emptyAction: { fontFamily: font.medium, fontSize: 15, color: colors.textPrimary, marginTop: 12 },
});
