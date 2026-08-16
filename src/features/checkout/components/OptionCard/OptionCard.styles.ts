import styled from 'styled-components/native';

export const Container = styled.View<{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-width: 1.5px;
  border-color: ${({ theme, selected }) => (selected ? theme.colors.primary : 'transparent')};
`;

export const IconCircle = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Info = styled.View`
  flex: 1;
  gap: 2px;
`;

export const RadioCircle = styled.View<{ selected: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, selected }) => (selected ? theme.colors.primary : 'transparent')};
  border-width: ${({ selected }) => (selected ? 0 : 1.5)}px;
  border-color: ${({ theme }) => theme.colors.border};
`;
