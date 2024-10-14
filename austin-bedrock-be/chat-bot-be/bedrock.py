import boto3
import json
import sys
import os
from dotenv import load_dotenv

client = boto3.client('bedrock-runtime', region_name='ap-northeast-2')
#인코딩 문제 해결
sys.stdout.reconfigure(encoding='utf-8') 

# 입력으로 받은 요청 데이터
request_body = sys.argv[1]
# .env 파일에서 환경 변수를 로드
load_dotenv()

client = boto3.client(
    'bedrock-runtime',
    region_name=os.getenv('AWS_REGION'),
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
)

try:
    # 모델 호출
    response = client.invoke_model(
        body=bytes(request_body, 'utf-8'),
        contentType='application/json',
        modelId='anthropic.claude-3-haiku-20240307-v1:0',
    )

    # 응답에서 body 추출
    response_body = response['body'].read()

    # JSON 형식으로 변환
    response_data = json.loads(response_body)
    # print(response_data) #잘 답변 됨
    
    # 최종적으로 JSON만 출력 (디버깅 메시지 없이)
    print(json.dumps(response_data, ensure_ascii=False, indent=4))

except Exception as e:
    # 예외가 발생하면 에러 메시지만 JSON 형식으로 반환
    print(json.dumps({"error": str(e)}, ensure_ascii=False))
