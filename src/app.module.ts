import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BackpacksModule } from './backpacks/backpacks.module';
import { AuthModule } from './auth/auth.module';

const uploadsPath = join(__dirname, '..', 'uploads');

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: uploadsPath,
      serveRoot: '/uploads',
    }),
    BackpacksModule,
    AuthModule,
  ],
})
export class AppModule {}
