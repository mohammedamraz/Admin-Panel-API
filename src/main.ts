import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { APP_VERSION, debugLevel, HOST, PORT } from './constants';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: debugLevel,
  });
  app.use(compression());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT, HOST, () => {
    Logger.debug(
      `Server v${APP_VERSION} listening at http://${HOST}:${PORT}/`,
      'FEDO-HEALTH-SALES-API',
    );
  });
}
bootstrap();
