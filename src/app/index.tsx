import styled from "styled-components/native";
import { colors, typography } from "@/constants/theme";

const Screen = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${colors.background};
`;

const Title = styled.Text`
  font-family: ${typography.headlineMobile.fontFamily};
  font-size: ${typography.headlineMobile.fontSize}px;
  line-height: ${typography.headlineMobile.lineHeight}px;
  color: ${colors.textPrimary};
`;

export default function Index() {
  return (
    <Screen>
      <Title>Cometa</Title>
    </Screen>
  );
}
