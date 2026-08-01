import styled from 'styled-components/native';
import { restaurantDetailPalette as palette } from '../../restaurantDetailPalette';

export const TabPill = styled.View<{ selected: boolean }>`
  height: 36px;
  padding-horizontal: 16px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ selected }) => (selected ? palette.accent : palette.chipBackground)};
`;

export const TabLabel = styled.Text<{ selected: boolean }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ selected }) => (selected ? palette.onAccent : palette.chipText)};
`;
