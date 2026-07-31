import type { ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { AuthProvider } from './AuthProvider';
import { useAuth } from './useAuth';

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('useAuth', () => {
  it('starts signed out and not loading', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('signIn sets isAuthenticated to true', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    act(() => result.current.signIn());
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('signOut sets isAuthenticated back to false', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    act(() => result.current.signIn());
    act(() => result.current.signOut());
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('throws when used outside an AuthProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within an AuthProvider'
    );
    consoleError.mockRestore();
  });
});
