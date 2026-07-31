import styled from "styled-components/native";

const Screen = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Title = styled.Text`
  font-family: ${({ theme }) => theme.typography.headlineMobile.fontFamily};
  font-size: ${({ theme }) => theme.typography.headlineMobile.fontSize}px;
  line-height: ${({ theme }) => theme.typography.headlineMobile.lineHeight}px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export default function Index() {
  return (
    <Screen>
      <Title>Cometa</Title>
    </Screen>
  );
}
