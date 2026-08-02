import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
`;

export const Info = styled.View`
  flex: 1;
  gap: 4px;
`;

export const AddButton = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.brandAccent};
`;

export const PriceText = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.brandAccent};
`;

// Split in two: shadows and overflow:hidden can't coexist on one RN view —
// the outer view casts the shadow, the inner one clips the image to the radius.
export const Thumbnail = styled.View`
  width: 96px;
  height: 96px;
  border-radius: 12px;
  border-width: 1px;
  border-color: rgba(219, 194, 173, 0.1);
  shadow-color: #000000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
  elevation: 1;
`;

export const ThumbnailClip = styled.View`
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
`;
