import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const GRPC_URL = process.env.GRPC_URL || 'localhost:50051';

  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: GRPC_URL,
      package: ['proto.users'],
      protoPath: [join(__dirname, '../users/infra/proto/user.proto')],
    },
  });

  await app.listen(3000);
  await app.startAllMicroservices();
}
bootstrap();
