"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotService = void 0;
const common_1 = require("@nestjs/common");
const python_shell_1 = require("python-shell");
let ChatbotService = class ChatbotService {
    async askBedrockModel(message) {
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
        console.log(requestBody);
        const options = {
            args: [requestBody],
        };
        return python_shell_1.PythonShell.run('bedrock.py', options).then(messages => {
            console.log('Python script finished');
            console.log('Python response:', messages);
            const responseString = messages.join('\n');
            try {
                const parsedMessage = JSON.parse(responseString);
                return parsedMessage;
            }
            catch (error) {
                console.error('Error parsing Python response:', error);
                return { error: 'Invalid JSON response', raw: responseString };
            }
        }).catch(err => {
            console.error('Error executing Python script:', err);
            throw err;
        });
    }
};
exports.ChatbotService = ChatbotService;
exports.ChatbotService = ChatbotService = __decorate([
    (0, common_1.Injectable)()
], ChatbotService);
//# sourceMappingURL=chatbot.service.js.map