export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export type InjectionToken<T = any> = string | Type<T>;

export interface ValueProvider<T = any> {
  provide: InjectionToken<T>;
  useValue: T;
}

export interface FactoryProvider<T = any> {
  provide: InjectionToken<T>;
  useFactory: (...args: any[]) => T | Promise<T>;
  inject?: InjectionToken[];
}

export type Provider<T = any> = ValueProvider<T> | FactoryProvider<T>;

export interface OnApplicationBootstrap {
  onBootstrap(): Promise<any>;
}

export interface OnApplicationDestroy {
  onDestroy(): Promise<any>;
}
