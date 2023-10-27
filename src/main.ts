import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { AppModule } from './app.module';

// import { RmqService } from '@shared/modules/rmq/rmq.service';

import { GlobalExceptionRestFilter } from '@shared/infra/filter/GlobalException.filter';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const GRPC_URL = process.env.GRPC_URL || 'localhost:50051';

  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionRestFilter());

  // const userRmqService = app.get<RmqService>(RmqService);

  // app.connectMicroservice<MicroserviceOptions>(
  //   userRmqService.getOptions('USER'),
  // );
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: GRPC_URL,
      package: ['proto.users'],
      protoPath: [join(__dirname, '../users/infra/proto/user.proto')],
    },
  });

  await app.listen(PORT);
  await app.startAllMicroservices();
}
bootstrap();
