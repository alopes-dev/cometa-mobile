import { Text } from 'react-native';
import styled from 'styled-components/native';
import type { Theme } from '@/components/design-system/ThemeProvider';

/**
 * The three button treatments the onboarding draws, named for what they do
 * rather than for their fill — `tertiary` is a borderless green label, which
 * is a "skip", not a third kind of filled button.
 *
 * Figma gives every one of them a 1px border, including the two that set it to
 * the same colour as their own background (nodes 44:22410, 44:22562). That is
 * transcribed rather than optimised away so all three share one box model and
 * sit on an identical 54px baseline.
 */
export type ActionTone = 'primary' | 'secondary' | 'tertiary';

/**
 * Which family the label is set in. The two boards differ: "01 · Onboarding"
 * uses Urbanist Bold at 22px horizontal padding, "10 — Onboarding" uses Inter
 * SemiBold at 18px.
 */
export type ActionFamily = 'display' | 'text';

type Tokens = Theme['onboarding'];

const TONE: Record<
  ActionTone,
  { background: (t: Tokens) => string; border: (t: Tokens) => string; label: (t: Tokens) => string }
> = {
  primary: {
    background: (t) => t.color.offerGreen,
    border: (t) => t.color.offerGreen,
    label: (t) => t.color.surfaceBackground,
  },
  secondary: {
    background: (t) => t.color.surfaceBackground,
    border: (t) => t.color.borderSubtle,
    label: (t) => t.color.textPrimary,
  },
  tertiary: {
    background: (t) => t.color.surfaceBackground,
    border: (t) => t.color.surfaceBackground,
    label: (t) => t.color.offerGreen,
  },
};

const PADDING: Record<ActionFamily, number> = { display: 22, text: 18 };

export const Container = styled.View<{ tone: ActionTone; family: ActionFamily }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.onboarding.metrics.actionIconGap}px;
  height: ${({ theme }) => theme.onboarding.metrics.actionHeight}px;
  padding-horizontal: ${({ family }) => PADDING[family]}px;
  border-radius: ${({ theme }) => theme.onboarding.metrics.actionRadius}px;
  border-curve: continuous;
  border-width: 1px;
  background-color: ${({ theme, tone }) => TONE[tone].background(theme.onboarding)};
  border-color: ${({ theme, tone }) => TONE[tone].border(theme.onboarding)};
  opacity: ${({ theme }) => theme.opacity[100]};
`;

export const Label = styled(Text)<{ tone: ActionTone; family: ActionFamily }>`
  font-family: ${({ theme, family }) =>
    family === 'display'
      ? theme.onboarding.type.slideAction.fontFamily
      : theme.onboarding.type.action.fontFamily};
  font-size: ${({ theme, family }) =>
    family === 'display'
      ? theme.onboarding.type.slideAction.fontSize
      : theme.onboarding.type.action.fontSize}px;
  color: ${({ theme, tone }) => TONE[tone].label(theme.onboarding)};
`;
