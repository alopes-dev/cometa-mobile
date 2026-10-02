import styled from 'styled-components/native';

export const Container = styled.View`
  gap: ${({ theme }) => theme.spacing[8]}px;
  padding: ${({ theme }) => theme.spacing[16]}px;
  background-color: ${({ theme }) => theme.colors.surface.primary};
  border-radius: ${({ theme }) => theme.radius.lg}px;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border.default};
  margin-vertical: 4px;
`;
