import { EnvService, ExpressApplication } from './core';
import { DatabaseConnection } from './connections';

const app = new ExpressApplication([
  {
    provide: EnvService,
    useValue: new EnvService({
      path: process.env.NODE_ENV === 'production' ? '.env' : 'dev.env',
    }),
  },
  {
    provide: DatabaseConnection,
    inject: [EnvService],
    useFactory: (env: EnvService) => {
      const url = env.get<string>('DATABASE_URL');
      return new DatabaseConnection(url);
    },
  },
]);

export default app;
