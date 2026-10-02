import { PACKAGE_NAME as CONFIG } from '@kometa/config';
import { PACKAGE_NAME as TYPES } from '@kometa/types';
import { PACKAGE_NAME as UTILS } from '@kometa/utils';
import { PACKAGE_NAME as VALIDATION } from '@kometa/validation';

// Guards the monorepo wiring itself: pnpm must link these workspace packages,
// and the Metro/Jest resolver must load their TypeScript source directly.
describe('workspace package resolution', () => {
  it('resolves every shared package from the mobile app', () => {
    expect(TYPES).toBe('@kometa/types');
    expect(VALIDATION).toBe('@kometa/validation');
    expect(CONFIG).toBe('@kometa/config');
    expect(UTILS).toBe('@kometa/utils');
  });
});
