import styled from 'styled-components/native';

export const TabPill = styled.View<{ selected: boolean }>`
  height: 40px;
  padding-horizontal: 18px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, selected }) =>
    selected ? theme.colors.brandAccent : theme.colors.brandChipBackground};
`;

export const TabLabel = styled.Text<{ selected: boolean }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme, selected }) => (selected ? theme.colors.brandOnAccent : theme.colors.brandChipText)};
`;
