import express = require('express');
import app from './app';
import { EnvService, Logger, middleware } from './core';
import BookRouter from './routers/book.router';

async function main() {
  await app.bootstrap();

  const env = app.get(EnvService);
  const logger = app.get(Logger);

  const middlewares = [
    middleware.context(app),
    express.json({
      limit: '5mb',
    }),
    express.urlencoded({
      limit: '5mb',
      extended: true,
    }),
    middleware.logging(),
  ];

  app.use(...middlewares);
  app.use('/api', BookRouter);

  const port = env.get<number>('PORT', 3000);

  app.listen(port, () => logger.info('Listening on port %d', port));
}

main();
