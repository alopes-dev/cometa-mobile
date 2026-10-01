import { Platform } from "react-native";
import { act, render } from "@testing-library/react-native";
import { Icon } from "./Icon";
import { ThemeProvider } from "@/components/design-system/ThemeProvider";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("Icon", () => {
  it("renders without crashing using the Ionicons fallback name", async () => {
    Platform.OS = "android";
    const result = renderWithTheme(<Icon name="cart" />);
    await act(async () => {});
    expect(result.toJSON()).toBeTruthy();
  });
});
