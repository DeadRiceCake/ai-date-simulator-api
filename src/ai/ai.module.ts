import { Module } from '@nestjs/common';

import { SharedModule } from '../shared/shared.module';
import { AiService } from './services/ai.service';

@Module({
  imports: [SharedModule],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
