import db from './index.js';
import { seed } from './seeds/1_test_account.js';

(async () => {
  await seed(db);
  process.exit(0);
})();
