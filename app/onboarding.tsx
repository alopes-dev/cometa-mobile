import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ONBOARDING_STEPS, type OnboardingStep } from '@/data/catalog';
import { colors, font, motion, radius } from '@/constants/theme';
import { Touchable } from '@/components/Touchable';

const STORAGE_KEY = 'cometa:hasOnboarded';

export default function Onboarding() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const listRef = useRef<FlatList<OnboardingStep>>(null);

  const finish = useCallback(async () => {
    await AsyncStorage.setItem(STORAGE_KEY, 'true');
    router.replace('/(tabs)');
  }, []);

  const goNext = useCallback(() => {
    if (step < ONBOARDING_STEPS.length - 1) {
      const next = step + 1;
      listRef.current?.scrollToIndex({ index: next, animated: true });
      setStep(next);
    } else {
      finish();
    }
  }, [step, finish]);

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    if (newIndex !== step) setStep(newIndex);
  };

  const imageHeight = height * 0.72;

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={ONBOARDING_STEPS}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={({ item }) => (
          <View style={{ width }}>
            <View style={{ height: imageHeight, width }}>
              <Image
                source={item.image}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
              <LinearGradient
                pointerEvents="none"
                colors={['transparent', colors.surfaceLight]}
                style={[styles.gradient, { height: imageHeight * 0.25 }]}
              />
            </View>

            <View style={styles.textBlock}>
              <TextBlock step={item} active={ONBOARDING_STEPS.indexOf(item) === step} />
            </View>
          </View>
        )}
      />

      <View style={[styles.topBar, { top: insets.top + 64 }]} pointerEvents="box-none">
        <View style={styles.progress}>
          {ONBOARDING_STEPS.map((_, i) => (
            <ProgressBar key={i} isActive={i === step} />
          ))}
        </View>
        <Touchable
          onPress={finish}
          accessibilityLabel="Skip onboarding"
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
        >
          <Text style={styles.skip}>Skip</Text>
        </Touchable>
      </View>

      <View style={[styles.ctaWrap, { paddingBottom: 32 + insets.bottom }]}>
        <Touchable
          onPress={goNext}
          accessibilityLabel={ONBOARDING_STEPS[step].ctaLabel}
          style={styles.cta}
        >
          <Text style={styles.ctaLabel}>{ONBOARDING_STEPS[step].ctaLabel}</Text>
        </Touchable>
      </View>
    </View>
  );
}

function ProgressBar({ isActive }: { isActive: boolean }) {
  const opacity = useRef(new Animated.Value(isActive ? 1 : 0.4)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: isActive ? 1 : 0.4,
      duration: motion.duration.base,
      easing: motion.easing.emphasized,
      useNativeDriver: true,
    }).start();
  }, [isActive, opacity]);

  return <Animated.View style={[styles.bar, { opacity }]} />;
}

function TextBlock({ step, active }: { step: OnboardingStep; active: boolean }) {
  const opacity = useRef(new Animated.Value(active ? 1 : 0)).current;
  const translateY = useRef(new Animated.Value(active ? 0 : 8)).current;

  useEffect(() => {
    if (active) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: motion.duration.base,
          easing: motion.easing.emphasized,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: motion.duration.base,
          easing: motion.easing.emphasized,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: motion.duration.instant,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 8,
          duration: motion.duration.instant,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [active, opacity, translateY]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Text style={styles.title}>{step.title[0]}</Text>
      <Text style={styles.title}>{step.title[1]}</Text>
      <Text style={styles.subtitle}>{step.subtitle}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceLight },
  gradient: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  textBlock: { paddingHorizontal: 24, marginTop: 8, alignItems: 'center' },
  title: {
    fontFamily: font.bold,
    fontSize: 34,
    lineHeight: 39,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: font.regular,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },
  topBar: {
    position: 'absolute',
    left: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  progress: { flex: 1, flexDirection: 'row', gap: 8 },
  bar: { flex: 1, height: 3, borderRadius: radius.pill, backgroundColor: colors.textOnDark },
  skip: { fontFamily: font.medium, fontSize: 16, color: colors.textPrimary, minWidth: 44, textAlign: 'right' },
  ctaWrap: { position: 'absolute', left: 24, right: 24, bottom: 0 },
  cta: {
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLabel: { fontFamily: font.semibold, fontSize: 17, color: colors.textOnDark },
});
