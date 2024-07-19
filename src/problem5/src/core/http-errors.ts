import { HttpStatus } from './constants';
import * as _ from '../utils/lodash';

interface HttpErrorOptions {
  code: number;
  message?: string;
  detail?: any;
  origin?: any;
}

interface ErrorOptions extends Omit<HttpErrorOptions, 'code'> {}

export class HttpError extends Error {
  public readonly code: number;
  public readonly origin?: any;
  public readonly detail?: any;

  constructor(opts: HttpErrorOptions) {
    const { message, code, origin, detail } = opts;
    super(message);
    this.code = code;
    this.origin = origin;
    this.detail = detail;
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      detail: this.detail,
    };
  }
}

export class IntervalServerError extends HttpError {
  constructor(opts: ErrorOptions) {
    super({
      code: HttpStatus.IntervalServerError,
      message: IntervalServerError.name,
      ...opts, 
  });
  }
}

export class BadRequestError extends HttpError {
  constructor(opts: ErrorOptions) {
    super({
      code: HttpStatus.BadRequest,
      message: BadRequestError.name,
      ...opts,
    });
  }
}

export class NotFoundError extends HttpError {
  constructor(opts: ErrorOptions) {
    super({
      code: HttpStatus.NotFound,
      message: NotFoundError.name,
      ...opts,
    });
  }
}
