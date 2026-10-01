import 'styled-components/native';
import type { Theme } from './ThemeProvider';

declare module 'styled-components/native' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}
