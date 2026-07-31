import { renderHook, waitFor, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useOnboarding } from './useOnboarding';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('useOnboarding', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('starts loading and resolves hasSeenOnboarding to false when nothing is stored', async () => {
    const { result } = renderHook(() => useOnboarding());
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasSeenOnboarding).toBe(false);
  });

  it('resolves hasSeenOnboarding to true when already stored', async () => {
    await AsyncStorage.setItem('cometa:hasSeenOnboarding', 'true');
    const { result } = renderHook(() => useOnboarding());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasSeenOnboarding).toBe(true);
  });

  it('completeOnboarding persists the flag and updates state', async () => {
    const { result } = renderHook(() => useOnboarding());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.completeOnboarding();
    });

    expect(result.current.hasSeenOnboarding).toBe(true);
    expect(await AsyncStorage.getItem('cometa:hasSeenOnboarding')).toBe('true');
  });

  it('handles AsyncStorage.getItem failure gracefully', async () => {
    // Mock getItem to reject
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
      new Error('Storage unavailable')
    );

    const { result } = renderHook(() => useOnboarding());
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Should fall back to false instead of hanging
    expect(result.current.hasSeenOnboarding).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });
});
