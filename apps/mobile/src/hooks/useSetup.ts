import { useContext } from 'react';
import { SetupContext, type SetupContextValue } from './SetupProvider';

export function useSetup(): SetupContextValue {
  const context = useContext(SetupContext);
  if (!context) {
    throw new Error('useSetup must be used within a SetupProvider');
  }
  return context;
}
