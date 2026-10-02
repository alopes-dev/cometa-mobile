import styled from 'styled-components/native';
import { textStyle } from '@/theme';

export const TabPill = styled.View`
  height: 40px;
  padding-horizontal: ${({ theme }) => theme.spacing[16]}px;
  align-items: center;
  justify-content: center;
`;

export const TabLabel = styled.Text<{ selected: boolean }>`
  ${textStyle('label')}
  color: ${({ theme, selected }) =>
    selected ? theme.colors.text.onBrand : theme.colors.text.secondary};
`;
