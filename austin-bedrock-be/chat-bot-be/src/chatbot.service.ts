import { Injectable } from '@nestjs/common';
import { PythonShell } from 'python-shell';

@Injectable()
export class ChatbotService {
  async askBedrockModel(message: string): Promise<any> {

    const requestBody = JSON.stringify({
      "max_tokens": 1000,
      "anthropic_version": "bedrock-2023-05-31",
      "messages": [
        {
          "role": "user",
          "content": message,
        },
      ],
    });

    console.log(requestBody); // {"max_tokens":1000,"anthropic_version":"bedrock-2023-05-31","messages":[{"role":"user","content":"안녕 챗봇"}]}

    const options = {
      args: [requestBody],
    };

    return PythonShell.run('bedrock.py', options).then(messages => {
      console.log('Python script finished');
      console.log('Python response:', messages); // Python 스크립트의 전체 출력을 배열로 출력

      // messages 배열을 하나의 문자열로 결합 (줄 단위로 된 메시지들을 합침)
      const responseString = messages.join('\n');

      // 결합한 문자열을 JSON으로 파싱
      try {
        const parsedMessage = JSON.parse(responseString); // JSON 파싱
        return parsedMessage;
      } catch (error) {
        console.error('Error parsing Python response:', error);
        return { error: 'Invalid JSON response', raw: responseString }; // 파싱 실패 시 원본 반환
      }
    }).catch(err => {
      console.error('Error executing Python script:', err);
      throw err;
    });
  }
}
