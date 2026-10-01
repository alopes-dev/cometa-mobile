import { PACKAGE_NAME as CONFIG } from '@cometa/config';
import { PACKAGE_NAME as TYPES } from '@cometa/types';
import { PACKAGE_NAME as UTILS } from '@cometa/utils';
import { PACKAGE_NAME as VALIDATION } from '@cometa/validation';

// Guards the monorepo wiring itself: pnpm must link these workspace packages,
// and the Metro/Jest resolver must load their TypeScript source directly.
describe('workspace package resolution', () => {
  it('resolves every shared package from the mobile app', () => {
    expect(TYPES).toBe('@cometa/types');
    expect(VALIDATION).toBe('@cometa/validation');
    expect(CONFIG).toBe('@cometa/config');
    expect(UTILS).toBe('@cometa/utils');
  });
});
