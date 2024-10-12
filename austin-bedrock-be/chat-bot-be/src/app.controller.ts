import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  // 챗봇에 질문 요청
  @Post('ask')
  async askModel(@Body('message') message: string) {
    const response = await this.chatbotService.askBedrockModel(message);
    return { response };
  }
}