import { ChefHat, Coffee, Donut, Flame, HelpCircle, Leaf, RotateCw } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { colors } from '@/constants/theme';

export type CategoryId = 'vegan' | 'coffee' | 'donuts' | 'spicy';

export type Category = {
  id: CategoryId;
  label: string;
  Icon: LucideIcon;
  color: string;
};

export type Product = {
  id: string;
  title: string;
  price: number;
  category: CategoryId;
  image: string;
};

export type QuickAction = {
  id: 'repeat' | 'help' | 'surprise';
  label: string;
  Icon: LucideIcon;
};

export type OnboardingStep = {
  id: 'build' | 'discover' | 'enjoy';
  title: [string, string];
  subtitle: string;
  image: string;
  ctaLabel: string;
};

export const CATEGORIES: Category[] = [
  { id: 'vegan',  label: 'Vegan',  Icon: Leaf,   color: colors.iconVegan },
  { id: 'coffee', label: 'Coffee', Icon: Coffee, color: colors.iconCoffee },
  { id: 'donuts', label: 'Donuts', Icon: Donut,  color: colors.iconDonut },
  { id: 'spicy',  label: 'Spicy',  Icon: Flame,  color: colors.iconSpicy },
];

export const PRODUCTS: Product[] = [
  { id: 'quinoa',    title: 'Cometa Quinoa',    price: 20, category: 'vegan',  image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80' },
  { id: 'asparagus', title: 'Cometa Asparagus', price: 18, category: 'vegan',  image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80' },
  { id: 'pancakes',  title: 'Cometa Pancakes',  price: 12, category: 'coffee', image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80' },
  { id: 'poke',      title: 'Cometa Poke Bowl', price: 22, category: 'spicy',  image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' },
];

export const QUICK_ACTIONS: QuickAction[] = [
  { id: 'repeat',   label: 'Repeat last order', Icon: RotateCw },
  { id: 'help',     label: 'Help me choose',    Icon: HelpCircle },
  { id: 'surprise', label: 'Surprise me',       Icon: ChefHat },
];

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'build',
    title: ['Build your', 'Flavor, Step by Step'],
    subtitle: 'Stack fresh ingredients for meals made your way',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80',
    ctaLabel: 'Next',
  },
  {
    id: 'discover',
    title: ['Discover', 'Flavors Near You'],
    subtitle: 'Handpicked kitchens delivering the freshest dishes tonight',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    ctaLabel: 'Next',
  },
  {
    id: 'enjoy',
    title: ['Enjoy', 'Every Bite, Every Time'],
    subtitle: 'Track your order and savor food that arrives exactly as promised',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
    ctaLabel: 'Get Started',
  },
];
