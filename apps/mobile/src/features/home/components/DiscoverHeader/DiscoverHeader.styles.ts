import styled from 'styled-components/native';
import { continuousCorners } from '@/theme';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[12]}px;
`;

export const AddressColumn = styled.View`
  gap: ${({ theme }) => theme.spacing[2]}px;
  flex-shrink: 1;
`;

export const LabelRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]}px;
`;

export const AddressRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]}px;
`;

export const Actions = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[8]}px;
`;

/**
 * The board draws both actions as 42px discs (nodes 54:32, 54:33) — below the
 * 44pt minimum target, so every call site pairs one with `hitSlop`.
 */
export const ActionButton = styled.View`
  width: 42px;
  height: 42px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.subtle};
  ${continuousCorners}
`;

/** Wraps the cart so its count badge can overhang the disc (node 54:95). */
export const CartSlot = styled.View`
  position: relative;
`;

export const BadgeSlot = styled.View`
  position: absolute;
  top: -4px;
  right: -4px;
`;
