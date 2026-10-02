import { render } from "@testing-library/react-native";
import { Text } from "./Text";
import { ThemeProvider } from "@/components/design-system/ThemeProvider";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("Text", () => {
  it("renders its children", () => {
    const { getByText } = renderWithTheme(<Text>Kometa</Text>);
    expect(getByText("Kometa")).toBeTruthy();
  });

  it("applies the requested typography variant", () => {
    const { getByText } = renderWithTheme(
      <Text variant="h1">Kometa</Text>,
    );
    const style = getByText("Kometa").props.style;
    expect(JSON.stringify(style)).toContain("28");
  });
});
