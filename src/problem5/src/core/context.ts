import { AsyncLocalStorage } from 'async_hooks';
import crypto from 'crypto';
import { ExpressApplication } from './app';
import { Logger } from './logger';

export class RequestContext {
  private static readonly store = new AsyncLocalStorage<RequestContext>();

  public readonly reqId: string;
  public readonly logger: Logger;
  public readonly app: ExpressApplication;
  private readonly data: Record<string, any>;

  constructor(app: ExpressApplication) {
    this.app = app;
    this.reqId = crypto.randomUUID();
    this.logger = new Logger({ reqId: this.reqId });
    this.data = {};
  }

  public get<T = any>(key: string, $default?: T): T {
    return this.data[key] ?? $default;
  }

  public set<T = any>(key: string, value: T) {
    this.data[key] = value;
    return this;
  }

  public static current() {
    return RequestContext.store.getStore();
  }

  public static run(ctx: RequestContext, cb: () => unknown) {
    return RequestContext.store.run(ctx, cb);
  }
}
