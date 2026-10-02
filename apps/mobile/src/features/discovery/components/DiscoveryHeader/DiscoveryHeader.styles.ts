import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[12]}px;
`;

export const TitleColumn = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing[2]}px;
`;
