import styled from 'styled-components/native';

export const Container = styled.View`
  width: 48%;
  gap: 6px;
`;

export const ImageWrapper = styled.View`
  position: relative;
`;

export const AddButton = styled.View`
  position: absolute;
  right: 6px;
  bottom: 6px;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.brandAccent};
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.brandBeige};
`;

export const PriceText = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.brandAccent};
`;
