import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[16]}px;
  padding-vertical: ${({ theme }) => theme.spacing[8]}px;
`;

export const IconCircle = styled.View<{ read: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, read }) => (read ? theme.colors.surface.secondary : theme.colors.surface.primary)};
  border-width: ${({ read }) => (read ? 0 : 1.5)}px;
  border-color: ${({ theme }) => theme.colors.border.selected};
`;

export const Info = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing[2]}px;
`;

export const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[6]}px;
`;

export const UnreadDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.brand.base};
`;
