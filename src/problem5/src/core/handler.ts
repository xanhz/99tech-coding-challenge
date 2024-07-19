import { Handler, Request, Response } from 'express';
import { Writable } from 'stream';
import { RequestContext } from './context';
import { HttpStatus } from './constants';
import { BadRequestError, HttpError, IntervalServerError } from './http-errors';
import { ValidationError } from 'joi';

export function RequestHandler(fn: (req: Request, res: Response) => any): Handler {
  return async (req, res) => {
    const ctx = RequestContext.current()!;
    try {
      const result = await fn(req, res);
      if (result instanceof Writable) {
        res.pipe(result);
      } else {
        res.status(req.method === 'DELETE' ? HttpStatus.NoContent : HttpStatus.OK).send({ result });
      }
    } catch (e) {
      let error: HttpError;
      if (e instanceof HttpError) {
        error = e;
      } else if (e instanceof ValidationError) {
        error = new BadRequestError({
          detail: e.details.map(error => ({
            message: error.message,
            property: error.path.join('.'),
          })),
        });
      } else {
        error = new IntervalServerError({
          origin: e,
        });
      }
      ctx.logger.error(error.origin ? error.origin : error);
      const body = error.toJSON();
      res.status(body.code).send(body);
    }
  };
}
