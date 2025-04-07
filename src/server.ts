import 'dotenv/config';
import { createExpressApp } from './app';

(async () => {
  const app = await createExpressApp();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
