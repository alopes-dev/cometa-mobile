import styled from 'styled-components/native';
import { continuousCorners, elevate } from '@/theme';

export const Card = styled.View`
  padding: ${({ theme }) => theme.spacing[16]}px;
  gap: ${({ theme }) => theme.spacing[12]}px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background-color: ${({ theme }) => theme.colors.surface.elevated};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.subtle};
  ${continuousCorners}
  ${elevate('sm')}
`;

export const SummaryRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[12]}px;
`;

export const Info = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing[2]}px;
`;

export const ProgressTrack = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]}px;
`;

/**
 * One segment of the stepped progress bar (node 48:19792).
 *
 * Segments rather than a single filled bar because the board counts
 * *stages*, not a percentage — four discrete handoffs the courier passes
 * through. `done` is never the only cue: the status label above it always
 * names the stage in words.
 */
export const ProgressStep = styled.View<{ done: boolean }>`
  flex: 1;
  height: 4px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme, done }) =>
    done ? theme.colors.brand.base : theme.colors.border.subtle};
`;
