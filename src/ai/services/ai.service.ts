import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { AI_MODEL } from '../constants/ai-model.constant';

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

  async createChat(ctx: RequestContext) {
    this.logger.log(ctx, `${this.createChat.name} was called`);

    const response = await this.aiModel.chat.completions.create({
      model: AI_MODEL.GPT_4O_MINI,
      messages: [
        {role: 'system', content: 'You are a helpful assistant.'},
        {role: 'user', content: 'What is the purpose of life?'},
      ],
    });
    
    return response;
  }

  async createImage(ctx: RequestContext, prompt: string) {
    this.logger.log(ctx, `${this.createImage.name} was called`);

    const imagesResponse = await this.aiModel.images.generate({
      model: AI_MODEL.DALL_E,
      prompt,
      n: 1,
      size: "1024x1024"
    });

    return imagesResponse;
  }
}
