import type { ReactNode } from 'react';
import styled from 'styled-components/native';
import { Text } from '@/components/design-system/atoms';

export type PlaceholderScreenProps = {
  label: string;
  children?: ReactNode;
};

const Screen = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[24]}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

export function PlaceholderScreen({ label, children }: PlaceholderScreenProps) {
  return (
    <Screen>
      <Text variant="h2">{label}</Text>
      {children}
    </Screen>
  );
}
