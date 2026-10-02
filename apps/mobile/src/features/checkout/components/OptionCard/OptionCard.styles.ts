import styled from 'styled-components/native';

export const Container = styled.View<{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[16]}px;
  padding: ${({ theme }) => theme.spacing[16]}px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background-color: ${({ theme }) => theme.colors.surface.primary};
  border-width: 1.5px;
  border-color: ${({ theme, selected }) => (selected ? theme.colors.border.selected : 'transparent')};
`;

export const IconCircle = styled.View`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.xl}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

export const Info = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing[2]}px;
`;

export const RadioCircle = styled.View<{ selected: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, selected }) => (selected ? theme.colors.brand.base : 'transparent')};
  border-width: ${({ selected }) => (selected ? 0 : 1.5)}px;
  border-color: ${({ theme }) => theme.colors.border.default};
`;
