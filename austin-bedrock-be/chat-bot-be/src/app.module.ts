import { Module } from '@nestjs/common';
import { ChatbotController } from './app.controller'; // ChatbotController로 불러오기
import { ChatbotService } from './chatbot.service';

@Module({
  imports: [],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class AppModule {}
