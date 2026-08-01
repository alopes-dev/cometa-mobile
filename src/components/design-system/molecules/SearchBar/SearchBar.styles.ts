import styled from 'styled-components/native';
import { TextInput } from 'react-native';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

export const Field = styled(TextInput)`
  flex: 1;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
`;
