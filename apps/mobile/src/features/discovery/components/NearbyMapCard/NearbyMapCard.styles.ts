import styled from 'styled-components/native';
import { continuousCorners } from '@/theme';

/** Node 48:20361. */
export const MAP_HEIGHT = 180;

/** Node 48:20363 — the merchant pin. */
export const PIN_SIZE = 34;

export const PIN_ICON_SIZE = 16;

export const Container = styled.View`
  height: ${MAP_HEIGHT}px;
  border-radius: ${({ theme }) => theme.radius.xxl}px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.media.placeholder};
  ${continuousCorners}
`;

export const Pin = styled.View<{ x: number; y: number }>`
  position: absolute;
  left: ${({ x }) => x * 100}%;
  top: ${({ y }) => y * 100}%;
  width: ${PIN_SIZE}px;
  height: ${PIN_SIZE}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.brand.base};
`;

/**
 * The capsule in the bottom-right corner (node 48:20369) — the one control on
 * the card, and the reason the card is a still rather than a live map.
 */
export const OpenMapPill = styled.View`
  position: absolute;
  right: ${({ theme }) => theme.spacing[12]}px;
  bottom: ${({ theme }) => theme.spacing[12]}px;
  padding-horizontal: ${({ theme }) => theme.spacing[12]}px;
  padding-vertical: ${({ theme }) => theme.spacing[8]}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.surface.elevated};
`;
