import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
`;

export const Info = styled.View`
  flex: 1;
  gap: 2px;
`;
