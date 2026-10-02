import styled from 'styled-components/native';
import { textStyle, elevate } from '@/theme';

export const Container = styled.View`
  flex-direction: row;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing[16]}px;
  padding-vertical: ${({ theme }) => theme.spacing[16]}px;
`;

export const Info = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing[4]}px;
`;

export const AddButton = styled.View`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.brand.base};
`;

export const PriceText = styled.Text`
  ${textStyle('label')}
  color: ${({ theme }) => theme.colors.text.brand};
`;

// Split in two: shadows and overflow:hidden can't coexist on one RN view —
// the outer view casts the shadow, the inner one clips the image to the radius.
export const Thumbnail = styled.View`
  width: 96px;
  height: 96px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.subtle};
  ${elevate('sm')}
`;

export const ThumbnailClip = styled.View`
  width: 100%;
  height: 100%;
  border-radius: ${({ theme }) => theme.radius.md}px;
  overflow: hidden;
`;
