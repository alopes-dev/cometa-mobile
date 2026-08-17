import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
`;

export const IconCircle = styled.View<{ read: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, read }) => (read ? theme.colors.surface : theme.colors.background)};
  border-width: ${({ read }) => (read ? 0 : 1.5)}px;
  border-color: ${({ theme }) => theme.colors.primary};
`;

export const Info = styled.View`
  flex: 1;
  gap: 2px;
`;

export const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

export const UnreadDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.primary};
`;
