import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // usado quando modulo iniciar
    await this.$connect();
  }

  async enableShutdownHooks(app: any) {
    app.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
