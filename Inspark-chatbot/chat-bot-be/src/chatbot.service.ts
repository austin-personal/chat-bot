import { Injectable } from '@nestjs/common';
import { PythonShell } from 'python-shell';

@Injectable()
export class ChatbotService {
  private conversationHistory: { role: string; content: string }[] = [];

  async askBedrockModel(message: string): Promise<any> {
    // 사용자 메시지를 대화 내역에 추가합니다.
    this.conversationHistory.push({
      role: 'user',
      content: message,
    });

    const requestBody = JSON.stringify({
      max_tokens: 1000,
      anthropic_version: 'bedrock-2023-05-31',
      messages: this.conversationHistory,
    });

    console.log(requestBody)

    const options = {
      args: [requestBody],
    };

    return PythonShell.run('bedrock.py', options)
      .then((messages) => {
        console.log('Python script finished');
        console.log('Python response:', messages);

        const responseString = messages.join('');

        try {
          const parsedMessage = JSON.parse(responseString);

          // 챗봇의 응답을 대화 내역에 추가합니다.
          this.conversationHistory.push({
            role: 'assistant',
            content: parsedMessage.content,
          });

          return parsedMessage;
        } catch (error) {
          console.error('Error parsing Python response:', error);
          return { error: 'Invalid JSON response', raw: responseString };
        }
      })
      .catch((err) => {
        console.error('Error executing Python script:', err);
        throw err;
      });
  }
}
