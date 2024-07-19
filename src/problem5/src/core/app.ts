import { Express } from 'express';
import { Provider, Type } from './interfaces';
import * as _ from '../utils/lodash';
import { Logger } from './logger';
import { isOnApplicationBootstrap, isOnApplicationDestroy, toStringToken } from './utils';

import express = require('express');

export class ExpressApplication {
  protected readonly providers: Provider[];
  protected readonly containers: Map<string, any>;
  protected readonly express: Express;
  protected readonly logger: Logger;

  constructor(providers: Provider[] = []) {
    this.providers = providers;
    this.containers = new Map();
    this.express = express();
    this.logger = new Logger(ExpressApplication.name);
  }

  public async bootstrap(): Promise<void> {
    for (const provider of this.providers) {
      // @ts-ignore
      const { provide, inject = [], useFactory, useValue } = provider;
      const token = toStringToken(provide);
      let instance = null;

      this.logger.info('Bootstrapping %s', token);

      if (!_.isNil(useValue)) {
        instance = useValue;
      }

      if (!_.isNil(useFactory)) {
        const args = inject.map((arg: any) => {
          const token = toStringToken(arg);
          const value = this.containers.get(token);
          if (_.isNil(value)) {
            throw new Error(`Missing ${token}`);
          }
          return value;
        });
        instance = await useFactory(...args);
      }

      if (_.isNil(instance)) {
        throw new Error(`Missing value or factory to create ${token}`);
      }

      this.containers.set(token, instance);

      if (isOnApplicationBootstrap(instance)) {
        await instance.onBootstrap();
      }
    }
  }

  public async close(): Promise<void> {
    this.logger.info('Closing app...');
    for (const [token, instance] of this.containers.entries()) {
      this.logger.info('Destroying %s', token);
      if (isOnApplicationDestroy(instance)) {
        await instance.onDestroy();
      }
    }
  }

  public disable(setting: string): ExpressApplication {
    this.express.disable(setting);
    return this;
  }

  public enable(setting: string): ExpressApplication {
    this.express.enable(setting);
    return this;
  }

  public get<TInput = any, TResult = TInput>(token: string | Type<TInput>): TResult {
    const $token = toStringToken(token);
    if ($token === Logger.name) {
      return this.logger as TResult;
    }
    return this.containers.get($token);
  }

  public use(...args: any[]): ExpressApplication {
    this.express.use(...args);
    return this;
  }

  public listen(port: number, cb = () => {}): void {
    this.express.listen(port, cb);
  }
}
