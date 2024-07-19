import { PrismaClient } from '@prisma/client';
import { Logger, OnApplicationBootstrap, OnApplicationDestroy } from '../core';

export class DatabaseConnection extends PrismaClient implements OnApplicationBootstrap, OnApplicationDestroy {
  private readonly logger = new Logger(DatabaseConnection.name);

  constructor(private readonly url: string) {
    super({
      datasources: {
        db: {
          url,
        },
      },
    });
  }

  public async onBootstrap() {
    this.logger.info('Connecting to %s', this.url);
    await this.$connect();
    this.logger.info('Connected to %s', this.url);
  }

  public async onDestroy() {
    this.logger.info('Disconnecting...');
    await this.$disconnect();
    this.logger.info('Disconnected');
  }
}
