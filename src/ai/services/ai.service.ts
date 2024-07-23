import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

import { AppLogger } from '../../shared/logger/logger.service';

@Injectable()
export class AiService {
  private aiModel: OpenAI;
  
  constructor(
    private configService: ConfigService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AiService.name);

    this.aiModel = new OpenAI({
      apiKey: this.configService.get('openai.apiKey'),
      organization: this.configService.get('openai.organizationId'),
      project: this.configService.get('openai.projectId'),
  });
  }

  async createChat() {
    const response = await this.aiModel.chat.completions.create({
      model:'gpt-4o-mini',
      messages: [
        {role: 'system', content: 'You are a helpful assistant.'},
        {role: 'user', content: 'What is the purpose of life?'},
      ],
    });
    
    return response;
  }
}
