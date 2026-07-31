import { Image, type ImageSourcePropType } from 'react-native';
import styled from 'styled-components/native';
import { Text } from './Text';

export type AvatarProps = {
  source?: ImageSourcePropType;
  initials?: string;
  size?: number;
};

const Circle = styled.View<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: ${({ size }) => size / 2}px;
  background-color: ${({ theme }) => theme.colors.surface};
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const AvatarImage = styled(Image)<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
`;

export function Avatar({ source, initials, size = 40 }: AvatarProps) {
  return (
    <Circle size={size}>
      {source ? (
        <AvatarImage source={source} size={size} />
      ) : (
        <Text variant="subheadline" color="textSecondary">
          {initials}
        </Text>
      )}
    </Circle>
  );
}
