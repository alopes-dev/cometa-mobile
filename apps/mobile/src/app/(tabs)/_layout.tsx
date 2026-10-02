import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useTheme } from 'styled-components/native';
import { useTabBarVisibility } from '@/hooks/useTabBarVisibility';

/**
 * The five tabs the board draws (node 48:20371), in its order and with its
 * wording. "Home" stays English because the board writes it that way; every
 * other label is the Portuguese the rest of the app speaks.
 *
 * The board's icons are Lucide outlines. They resolve here to the closest SF
 * Symbol on iOS and Material Symbol on Android rather than to bundled SVGs,
 * so the bar renders in the platform's own icon language — which is the whole
 * point of a native tab bar. `safari.fill` is the compass and
 * `list.bullet.rectangle.fill` the receipt; both have shipped since iOS 15,
 * unlike the literal `receipt` symbol, which comes back empty before iOS 18.
 */
export default function TabsLayout() {
  const theme = useTheme();
  const { isTabBarHidden } = useTabBarVisibility();

  return (
    <NativeTabs tintColor={theme.colors.brand.base} hidden={isTabBarHidden}>
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(discovery)">
        <NativeTabs.Trigger.Icon sf="safari.fill" md="explore" />
        <NativeTabs.Trigger.Label>Explorar</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(orders)">
        <NativeTabs.Trigger.Icon sf="list.bullet.rectangle.fill" md="receipt_long" />
        <NativeTabs.Trigger.Label>Pedidos</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(assistant)">
        <NativeTabs.Trigger.Icon sf="sparkles" md="auto_awesome" />
        <NativeTabs.Trigger.Label>Hi Kometa</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(profile)">
        <NativeTabs.Trigger.Icon sf="person.fill" md="person" />
        <NativeTabs.Trigger.Label>Perfil</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      {/*
        The board has no wallet tab. Its route still exists on disk, so it
        needs a trigger — a route under `(tabs)` without one is a navigator
        error — and this one is hidden from the first render onwards, never
        toggled, because flipping `hidden` remounts the whole navigator.
        Delete `app/(tabs)/(wallet)/` and this trigger together.
      */}
      <NativeTabs.Trigger name="(wallet)" hidden>
        <NativeTabs.Trigger.Icon sf="creditcard.fill" md="credit_card" />
        <NativeTabs.Trigger.Label>Carteira</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
