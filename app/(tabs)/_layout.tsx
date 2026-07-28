import { Tabs } from 'expo-router';
import BottomNav from '@/components/BottomNav';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}
      tabBar={(props) => <BottomNav {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="offers" />
      <Tabs.Screen name="orders" />
      <Tabs.Screen name="cart" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
