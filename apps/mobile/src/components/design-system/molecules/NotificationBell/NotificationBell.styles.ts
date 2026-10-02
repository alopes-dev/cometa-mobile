import styled from 'styled-components/native';

/** The board draws the bell as a 40px disc (nodes 48:20256, 48:20168). */
export const BELL_SIZE = 40;

/**
 * The unread dot (node 48:20258). The board sizes it 7 and insets it 7; both
 * round to the 8 step, which is a difference nobody can see and one fewer
 * literal in the file.
 */
const INDICATOR_SIZE = 8;

export const Slot = styled.View`
  position: relative;
`;

export const Disc = styled.View`
  width: ${BELL_SIZE}px;
  height: ${BELL_SIZE}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.subtle};
`;

/**
 * Ringed in the page background so the dot stays legible wherever it lands —
 * the same trick the system uses for a badge sitting on an icon's edge.
 */
export const UnreadIndicator = styled.View`
  position: absolute;
  top: ${({ theme }) => theme.spacing[8]}px;
  right: ${({ theme }) => theme.spacing[8]}px;
  width: ${INDICATOR_SIZE}px;
  height: ${INDICATOR_SIZE}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.brand.base};
  border-width: 1.5px;
  border-color: ${({ theme }) => theme.colors.background.primary};
`;
