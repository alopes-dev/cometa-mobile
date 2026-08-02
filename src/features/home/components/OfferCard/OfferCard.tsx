import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/design-system/atoms';
import type { Offer } from '../../types';
import { Container, Badge, Content, TopContent } from './OfferCard.styles';

export type OfferCardProps = {
  offer: Offer;
};

export function OfferCard({ offer }: OfferCardProps) {
  return (
    <Container>
      <Image source={{ uri: offer.imageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.75)']} style={StyleSheet.absoluteFill} />
      <TopContent>
        <Badge>
          <Text variant="caption" color="onSecondary">
            {offer.badgeLabel}
          </Text>
        </Badge>
      </TopContent>
      <Content>
        <Text variant="bodyEmphasized" color="onSecondary">
          {offer.title}
        </Text>
        <Text variant="footnote" color="onSecondary">
          {offer.subtitle}
        </Text>
      </Content>
    </Container>
  );
}
