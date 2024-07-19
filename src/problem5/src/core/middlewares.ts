import { Handler } from 'express';
import { ExpressApplication } from './app';
import { RequestContext } from './context';
import * as _ from '../utils/lodash';

export namespace middleware {
  export const context = (app: ExpressApplication): Handler => {
    return (req, res, next) => {
      const ctx = new RequestContext(app);
      res.setHeader('x-request-id', ctx.reqId);
      RequestContext.run(ctx, () => next());
    };
  };

  export const logging = (): Handler => {
    return (req, res, next) => {
      const ctx = RequestContext.current()!;
      const { method, url, body } = req;

      const start = Date.now();

      let msgFormat = '%s %s';
      let meta = [method, url];

      if (!_.isEmpty(body)) {
        msgFormat += ' - %o';
        meta = [...meta, body];
      }

      ctx.logger.info(msgFormat, ...meta);

      res.on('finish', () => {
        const { statusCode } = res;

        const end = Date.now();
        const duration = end - start;

        const msg = `${method} ${url} - ${statusCode} - ${duration} ms`;

        if (statusCode < 400) {
          ctx.logger.info(msg);
        } else {
          ctx.logger.error(msg);
        }
      });

      next();
    };
  };
}
