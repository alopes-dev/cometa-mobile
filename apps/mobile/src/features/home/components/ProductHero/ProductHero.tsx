import { Pressable } from 'react-native';
import { FavoriteButton, Icon } from '@/components/design-system/atoms';
import { product } from '@/theme';
import type { ImageRef } from '../../types';
import { ActionButton, ActionShadow, Actions, HeroImage, Wrapper } from './ProductHero.styles';

export type ProductHeroProps = {
  source: ImageRef;
  topInset: number;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

/** `Imagem do produto` — node 48:20700. */
export function ProductHero({
  source,
  topInset,
  onBack,
  isFavorite,
  onToggleFavorite,
}: ProductHeroProps) {
  return (
    <Wrapper topInset={topInset}>
      <HeroImage source={source} contentFit="cover" />
      <Actions topInset={topInset}>
        <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Voltar" hitSlop={8}>
          <ActionShadow>
            <ActionButton>
              <Icon
                name="chevron-back"
                sf="chevron.left"
                size={product.metrics.actionIconSize}
                color="primary"
              />
            </ActionButton>
          </ActionShadow>
        </Pressable>
        <ActionShadow>
          <FavoriteButton
            size={product.metrics.actionSize}
            isFavorite={isFavorite}
            onToggle={onToggleFavorite}
          />
        </ActionShadow>
      </Actions>
    </Wrapper>
  );
}
