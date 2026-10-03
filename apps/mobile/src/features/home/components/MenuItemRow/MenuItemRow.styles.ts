import styled from 'styled-components/native';
import { boardTextStyle, continuousCorners } from '@/theme';

/**
 * `Produto` — node 48:20641.
 *
 * No vertical padding: the board spaces products with the gap on the section
 * that holds them, so a row is exactly as tall as its 96px thumbnail.
 */
export const Container = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ theme }) => theme.business.metrics.productGap}px;
`;

/** `Detalhes` — node 48:20642. */
export const Info = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.business.metrics.detailsGap}px;
`;

/** `Nome e oferta` — node 48:20643. */
export const NameRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.business.metrics.nameGap}px;
`;

export const Name = styled.Text`
  ${boardTextStyle('productName')}
  color: ${({ theme }) => theme.colors.text.primary};
`;

/** `Oferta` — node 48:20656. */
export const Discount = styled.Text`
  ${boardTextStyle('discount')}
  color: ${({ theme }) => theme.colors.text.brand};
`;

export const Description = styled.Text`
  ${boardTextStyle('productDescription')}
  color: ${({ theme }) => theme.colors.text.secondary};
`;

/** `Preço` — node 48:20646. */
export const PriceRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.business.metrics.priceGap}px;
`;

export const PriceText = styled.Text`
  ${boardTextStyle('price')}
  color: ${({ theme }) => theme.colors.text.brand};
`;

/** `Anterior` — node 48:20660. Struck through, never coloured as a price. */
export const PreviousPriceText = styled.Text`
  ${boardTextStyle('previousPrice')}
  color: ${({ theme }) => theme.colors.text.muted};
  text-decoration-line: line-through;
`;

/**
 * `Imagem e ação` — node 48:20648. The add button sits inside the thumbnail,
 * so this clips both to one radius and positions the button against its
 * bottom-right corner.
 */
export const Media = styled.View`
  width: ${({ theme }) => theme.business.metrics.mediaSize}px;
  height: ${({ theme }) => theme.business.metrics.mediaSize}px;
  border-radius: ${({ theme }) => theme.business.metrics.mediaRadius}px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.media.placeholder};
  ${continuousCorners}
`;

export const AddButtonSlot = styled.View`
  position: absolute;
  right: ${({ theme }) => theme.business.metrics.addInset}px;
  bottom: ${({ theme }) => theme.business.metrics.addInset}px;
`;

/** `Adicionar` — node 48:20650. */
export const AddButton = styled.View`
  width: ${({ theme }) => theme.business.metrics.addSize}px;
  height: ${({ theme }) => theme.business.metrics.addSize}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.brand.base};
`;
