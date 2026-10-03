import { useRouter } from 'expo-router';
import { HomeScreen } from '@/features/home/components/HomeScreen';

/**
 * Home is the entry to the purchase path: a card opens the restaurant, the
 * restaurant opens a product, and the product fills the cart. Every
 * destination is resolved here rather than inside `HomeScreen` so the screen
 * stays renderable in a test without a navigator.
 */
export default function Home() {
  const router = useRouter();

  return (
    <HomeScreen
      onPressSearch={() => router.push('/(tabs)/(home)/search')}
      onPressRestaurant={(id) => router.push({ pathname: '/restaurant/[id]', params: { id } })}
      onPressActiveOrder={() => router.push('/order-tracking')}
      onPressCart={() => router.push('/cart')}
      onPressNotifications={() => router.push('/notifications')}
      onPressAllRestaurants={() => router.push('/restaurants')}
      onPressOffers={() => router.push('/offers')}
    />
  );
}
