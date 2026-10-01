import { render } from "@testing-library/react-native";
import { Badge } from "./Badge";
import { ThemeProvider } from "@/components/design-system/ThemeProvider";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("Badge", () => {
  it("renders the count", () => {
    const { getByText } = renderWithTheme(<Badge count={3} />);
    expect(getByText("3")).toBeTruthy();
  });

  it("caps the displayed count at 99+", () => {
    const { getByText } = renderWithTheme(<Badge count={150} />);
    expect(getByText("99+")).toBeTruthy();
  });

  it("renders nothing when count is 0", () => {
    const { toJSON } = renderWithTheme(<Badge count={0} />);
    expect(toJSON()).toBeNull();
  });
});
