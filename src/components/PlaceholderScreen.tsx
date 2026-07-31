import type { ReactNode } from 'react';
import styled from 'styled-components/native';
import { Text } from '@/design-system/atoms';

export type PlaceholderScreenProps = {
  label: string;
  children?: ReactNode;
};

const Screen = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 24px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export function PlaceholderScreen({ label, children }: PlaceholderScreenProps) {
  return (
    <Screen>
      <Text variant="headlineMobile">{label}</Text>
      {children}
    </Screen>
  );
}
