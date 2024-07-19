import * as dotenv from 'dotenv';

export class EnvService {
  private readonly store: Record<string, any>;

  constructor(opts: dotenv.DotenvConfigOptions = {}) {
    const { parsed = {} } = dotenv.config(opts);
    this.store = { ...process.env, ...parsed };
  }

  public get<T = any>(key: string, $default?: T): T {
    return this.store[key] ?? $default;
  }
}
