import styled from 'styled-components/native';

export const TabPill = styled.View`
  height: 40px;
  padding-horizontal: 18px;
  align-items: center;
  justify-content: center;
`;

export const TabLabel = styled.Text<{ selected: boolean }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme, selected }) => (selected ? theme.colors.onCategorySelected : theme.colors.textPrimary)};
`;
