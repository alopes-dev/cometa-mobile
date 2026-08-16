import type { IconProps } from '@/components/design-system/atoms';

export type Driver = {
  name: string;
  photoUrl: string;
  rating: number;
  vehicle: string;
  plate: string;
  phone: string;
  etaMinutes: number;
};

export type TrackingStage = {
  key: string;
  label: string;
  icon: { name: IconProps['name']; sf?: IconProps['sf'] };
};
