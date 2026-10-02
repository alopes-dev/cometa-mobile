import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[8]}px;
`;

export const AddressSection = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[8]}px;
  flex: 1;
`;

export const AddressColumn = styled.View`
  gap: ${({ theme }) => theme.spacing[2]}px;
  flex-shrink: 1;
`;

export const AddressRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]}px;
`;

export const BellButton = styled.View`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.default};
`;
