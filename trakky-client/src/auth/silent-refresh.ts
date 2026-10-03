import { getUserManager } from './userManager';

getUserManager()
  .signinSilentCallback()
  .catch(() => undefined);
