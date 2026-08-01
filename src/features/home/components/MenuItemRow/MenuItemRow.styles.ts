import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
`;

export const Info = styled.View`
  flex: 1;
  gap: 2px;
`;

export const ImageWrapper = styled.View`
  position: relative;
`;

export const AddButton = styled.View`
  position: absolute;
  right: -6px;
  bottom: -6px;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primary};
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.background};
`;
