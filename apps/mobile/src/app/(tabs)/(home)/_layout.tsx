import { Stack } from "expo-router";
import { HeroTransitionProvider } from "@/features/home/components/HeroTransition";

export default function HomeLayout() {
  return (
    <HeroTransitionProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        {/*
          Home pushes its own copy of the search screens rather than sending
          the customer to Discovery's: a tab that switches tabs under you loses
          the stack you were in, and the back gesture then leaves the app
          somewhere you never were. Both copies are the same two components.
        */}
        <Stack.Screen name="search/index" />
        <Stack.Screen name="search/results" />

        {/*
          The purchase path. Fade instead of slide-from-right on the detail
          screen — the ghost image morphing from the tapped card into the hero
          (see HeroTransitionProvider) reads as one continuous shape, which a
          directional slide would fight against.
        */}
        <Stack.Screen name="restaurant/[id]" options={{ animation: "fade" }} />
        <Stack.Screen name="product/[itemId]" />
        <Stack.Screen name="cart" />

        {/*
          Checkout is a sequence of decisions, each its own screen, so the back
          gesture undoes exactly one choice. They push in order:
          delivery-type → schedule → address → payment-method → checkout.
        */}
        <Stack.Screen name="delivery-type" />
        <Stack.Screen name="schedule" />
        <Stack.Screen name="address" />
        <Stack.Screen name="payment-method/index" />
        <Stack.Screen name="payment-method/details" />
        <Stack.Screen name="checkout" />

        {/*
          Post-purchase. These are destinations, not steps: once the order is
          placed there is nothing behind them to go back to, so they replace
          rather than stack (see the `router.replace` calls at each hand-off).
        */}
        <Stack.Screen name="order-tracking" />
        <Stack.Screen name="live-tracking" />
        <Stack.Screen name="delivered" />
        <Stack.Screen name="rating" />

        <Stack.Screen name="restaurants" />
        <Stack.Screen name="offers" />
        <Stack.Screen name="notifications" />
      </Stack>
    </HeroTransitionProvider>
  );
}
