import { useContext } from 'react';
import { TabBarVisibilityContext, type TabBarVisibilityContextValue } from './TabBarVisibilityProvider';

export function useTabBarVisibility(): TabBarVisibilityContextValue {
  const context = useContext(TabBarVisibilityContext);
  if (!context) {
    throw new Error('useTabBarVisibility must be used within a TabBarVisibilityProvider');
  }
  return context;
}
