import { render, fireEvent } from "@testing-library/react-native";
import { TextField } from "./TextField";
import { ThemeProvider } from "@/components/design-system/ThemeProvider";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("TextField", () => {
  it("fires onChangeText with the typed value", () => {
    const onChangeText = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <TextField
        label="Email"
        onChangeText={onChangeText}
        accessibilityLabel="Email"
      />,
    );
    fireEvent.changeText(getByLabelText("Email"), "hi@cometa.co");
    expect(onChangeText).toHaveBeenCalledWith("hi@cometa.co");
  });

  it("renders the error message when error is set", () => {
    const { getByText } = renderWithTheme(
      <TextField label="Email" error="Invalid email" />,
    );
    expect(getByText("Invalid email")).toBeTruthy();
  });
});
