import styled from 'styled-components/native';
import { productTextStyle } from '@/theme';

/** `Quantidade e ação` — node 48:20723. */
export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.product.metrics.actionRowGap}px;
`;

/** `Adicionar` — node 48:20728: the stepper is intrinsic, this takes the rest. */
export const AddSlot = styled.View`
  flex: 1;
`;

/** `Ação principal` — node 48:20729. */
export const AddSurface = styled.View<{ disabled: boolean }>`
  height: ${({ theme }) => theme.product.metrics.controlHeight}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[8]}px;
  border-radius: ${({ theme }) => theme.product.metrics.controlRadius}px;
  border-curve: continuous;
  background-color: ${({ theme }) => theme.colors.brand.base};
  opacity: ${({ theme, disabled }) => (disabled ? theme.opacity[40] : theme.opacity[100])};
`;

/** `Etiqueta` — nodes 48:20730 and, in the added state, 48:20770. */
export const AddLabel = styled.Text`
  ${productTextStyle('actionLabel')}
  color: ${({ theme }) => theme.colors.text.onBrand};
`;
