import { type ImageSourcePropType } from 'react-native';
import { Text } from '../Text';
import { Circle, AvatarImage } from './Avatar.styles';

export type AvatarProps = {
  source?: ImageSourcePropType;
  initials?: string;
  size?: number;
};

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
