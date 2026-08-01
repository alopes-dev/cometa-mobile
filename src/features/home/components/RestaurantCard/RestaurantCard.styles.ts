import styled from 'styled-components/native';

export const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

export const MetaRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;
