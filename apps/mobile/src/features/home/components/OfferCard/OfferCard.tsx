import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'styled-components/native';
import { Text } from '@/components/design-system/atoms';
import type { Offer } from '../../types';
import { Container, Badge, Content, TopContent } from './OfferCard.styles';

export type OfferCardProps = {
  offer: Offer;
  fullWidth?: boolean;
};

export function OfferCard({ offer, fullWidth }: OfferCardProps) {
  const theme = useTheme();

  return (
    <Container fullWidth={fullWidth}>
      <Image source={{ uri: offer.imageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient
        colors={[theme.colors.overlay.scrimFrom, theme.colors.overlay.scrimTo]}
        style={StyleSheet.absoluteFill}
      />
      <TopContent>
        <Badge>
          <Text variant="labelSmall" color="onBrand">
            {offer.badgeLabel}
          </Text>
        </Badge>
      </TopContent>
      <Content>
        <Text variant="title" color="onMedia">
          {offer.title}
        </Text>
        <Text variant="caption" color="onMedia">
          {offer.subtitle}
        </Text>
      </Content>
    </Container>
  );
}
