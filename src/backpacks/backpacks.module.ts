import { Module } from '@nestjs/common';
import { BackpacksController } from './backpacks.controller';
import { BackpacksService } from './backpacks.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [BackpacksController],
  providers: [BackpacksService],
})
export class BackpacksModule {}
