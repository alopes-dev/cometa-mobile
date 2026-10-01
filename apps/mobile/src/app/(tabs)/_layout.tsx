import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useTheme } from 'styled-components/native';
import { useTabBarVisibility } from '@/hooks/useTabBarVisibility';

export default function TabsLayout() {
  const theme = useTheme();
  const { isTabBarHidden } = useTabBarVisibility();

  return (
    <NativeTabs tintColor={theme.colors.primary} hidden={isTabBarHidden}>
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(orders)">
        <NativeTabs.Trigger.Icon sf="bag.fill" md="shopping_bag" />
        <NativeTabs.Trigger.Label>Orders</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(wallet)">
        <NativeTabs.Trigger.Icon sf="creditcard.fill" md="credit_card" />
        <NativeTabs.Trigger.Label>Wallet</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(profile)">
        <NativeTabs.Trigger.Icon sf="person.fill" md="person" />
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
