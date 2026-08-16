import styled from 'styled-components/native';

export const Container = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const OptionRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
`;

export const IndicatorCircle = styled.View<{ selected: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, selected }) => (selected ? theme.colors.primary : 'transparent')};
  border-width: ${({ selected }) => (selected ? 0 : 1.5)}px;
  border-color: ${({ theme }) => theme.colors.border};
`;

export const IndicatorSquare = styled.View<{ selected: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, selected }) => (selected ? theme.colors.primary : 'transparent')};
  border-width: ${({ selected }) => (selected ? 0 : 1.5)}px;
  border-color: ${({ theme }) => theme.colors.border};
`;
