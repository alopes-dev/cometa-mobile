import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[16]}px;
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
