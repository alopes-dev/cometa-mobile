import { createContext, useMemo, useState, type ReactNode } from 'react';

export type TabBarVisibilityContextValue = {
  isTabBarHidden: boolean;
  setIsTabBarHidden: (hidden: boolean) => void;
};

export const TabBarVisibilityContext = createContext<TabBarVisibilityContextValue | null>(null);

export function TabBarVisibilityProvider({ children }: { children: ReactNode }) {
  const [isTabBarHidden, setIsTabBarHidden] = useState(false);

  const value = useMemo<TabBarVisibilityContextValue>(
    () => ({ isTabBarHidden, setIsTabBarHidden }),
    [isTabBarHidden]
  );

  return <TabBarVisibilityContext.Provider value={value}>{children}</TabBarVisibilityContext.Provider>;
}
