import { render, fireEvent } from "@testing-library/react-native";
import { Chip } from "./Chip";
import { ThemeProvider } from "@/components/design-system/ThemeProvider";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("Chip", () => {
  it("fires onPress when pressed", () => {
    const onPress = jest.fn();
    const { getByRole } = renderWithTheme(
      <Chip label="Fast delivery" onPress={onPress} />,
    );
    fireEvent.press(getByRole("button"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("reflects the selected prop via accessibilityState", () => {
    const { getByRole } = renderWithTheme(
      <Chip label="Fast delivery" selected onPress={() => {}} />,
    );
    expect(getByRole("button").props.accessibilityState.selected).toBe(true);
  });
});
