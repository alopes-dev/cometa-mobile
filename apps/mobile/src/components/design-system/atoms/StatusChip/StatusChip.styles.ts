import styled from 'styled-components/native';
import type { Theme } from '@/components/design-system/ThemeProvider';

export type DeliveryStatus = keyof Theme['colors']['delivery'];

export const Container = styled.View<{ status: DeliveryStatus }>`
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  gap: ${({ theme }) => theme.spacing[6]}px;
  height: 28px;
  padding-horizontal: ${({ theme }) => theme.spacing[8]}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme, status }) => theme.colors.delivery[status].bg};
`;

export const Label = styled.Text<{ status: DeliveryStatus }>`
  font-family: ${({ theme }) => theme.typography.label.fontFamily};
  font-size: ${({ theme }) => theme.typography.label.fontSize}px;
  line-height: ${({ theme }) => theme.typography.label.lineHeight}px;
  letter-spacing: ${({ theme }) => theme.typography.label.letterSpacing}px;
  color: ${({ theme, status }) => theme.colors.delivery[status].fg};
`;
