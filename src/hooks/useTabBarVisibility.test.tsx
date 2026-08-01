import type { ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { TabBarVisibilityProvider } from './TabBarVisibilityProvider';
import { useTabBarVisibility } from './useTabBarVisibility';

function wrapper({ children }: { children: ReactNode }) {
  return <TabBarVisibilityProvider>{children}</TabBarVisibilityProvider>;
}

describe('useTabBarVisibility', () => {
  it('starts with the tab bar visible', () => {
    const { result } = renderHook(() => useTabBarVisibility(), { wrapper });
    expect(result.current.isTabBarHidden).toBe(false);
  });

  it('updates isTabBarHidden when setIsTabBarHidden is called', () => {
    const { result } = renderHook(() => useTabBarVisibility(), { wrapper });

    act(() => {
      result.current.setIsTabBarHidden(true);
    });
    expect(result.current.isTabBarHidden).toBe(true);

    act(() => {
      result.current.setIsTabBarHidden(false);
    });
    expect(result.current.isTabBarHidden).toBe(false);
  });

  it('throws when used outside a TabBarVisibilityProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useTabBarVisibility())).toThrow(
      'useTabBarVisibility must be used within a TabBarVisibilityProvider'
    );
    consoleError.mockRestore();
  });
});
