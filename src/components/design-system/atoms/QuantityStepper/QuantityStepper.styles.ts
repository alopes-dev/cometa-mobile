import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.pill}px;
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  height: 32px;
`;

export const StepButton = styled.View`
  width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
`;
