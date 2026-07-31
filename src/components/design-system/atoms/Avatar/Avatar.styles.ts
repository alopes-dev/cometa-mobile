import { Image } from 'react-native';
import styled from 'styled-components/native';

export const Circle = styled.View<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: ${({ size }) => size / 2}px;
  background-color: ${({ theme }) => theme.colors.surface};
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const AvatarImage = styled(Image)<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
`;
