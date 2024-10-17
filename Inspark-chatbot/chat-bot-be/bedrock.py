import boto3
import json
import sys
import os
# import chromadb
# from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
# from chromadb.config import Settings

client = boto3.client('bedrock-runtime', region_name='ap-northeast-2')
#인코딩 문제 해결
sys.stdout.reconfigure(encoding='utf-8')

# embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
# chroma_client = chromadb.Client()
# collection = client.get_collection(name="my_collection")
# persist_directory = "./chroma"  # 디렉토리 설정
# settings = Settings(persist_directory=persist_directory)  # Settings 객체 생성
# chroma_client = chromadb.PersistentClient(settings=settings)
# collection = chroma_client.get_collection(name = "aws_all_merge")

# 입력으로 받은 요청 데이터
request_body = sys.argv[1]
# .env 파일에서 환경 변수를 로드
# print(request_body)
load_dotenv()

######################## 삽입코드 시작
parsed_json = json.loads(request_body)
user_question = parsed_json['messages'][0]['content']

# 크로마db 서칭
# question_embedding = embedding_model.encode(user_question).tolist()
n_results = 10
# results = collection.query(
#     query_embeddings=[question_embedding],
#     n_results=n_results,
#     include=['metadatas']
# )
#
# retrieved_texts = "\n".join([metadata['text'] for metadata in results['metadatas'][0]])

prompt_content = (
        "당신은 사용자의 요구에 맞는 AWS 서비스 아키텍처를 단계별로 구성하는 안내자 역할을 합니다. "
        "대화를 주도하며 필요한 경우 추가 질문을 통해 사용자의 요구사항을 명확히 하세요. "
        "질문에 대해 필요한 서비스를 목록화 해서 짧게 대답해줘. 문장을 완성하지말고 키워드만 언급하면서"
        "예시) [짧은 설명 텍스트] \n 1. EC2 - t2.micro : [선정한 이유] \n 2. RDB - Aurora : [선정한 이유]"
        "예시 텍스트에서 [짧은 설명 텍스트]에는 짧게 전체적인 설명을 해주고 [선정한 이유]에는 해당 인스턴스에 대한 짧은 설명 부탁해. 중괄호는 출력하지 않아도 돼"
        
        f"Question: {user_question}\n\n"
    )

request_body = {
        "max_tokens": 1000,
        "anthropic_version": "bedrock-2023-05-31",
        "messages": [
            {
                "role": "user",
                "content": prompt_content
            }
        ]
    }

############################# 삽입코드 끝

client = boto3.client(
    'bedrock-runtime',
    region_name=os.getenv('AWS_REGION'),
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
)

try:
    # 모델 호출
    response = client.invoke_model(
        body=bytes(json.dumps(request_body), 'utf-8'),
        contentType='application/json',
        modelId='anthropic.claude-3-haiku-20240307-v1:0',
    )

    # 응답에서 body 추출
    response_body = response['body'].read()

    # JSON 형식으로 변환
    response_data = json.loads(response_body)
    # print(response_data) #잘 답변 됨
    
    # 최종적으로 JSON만 출력 (디버깅 메시지 없이)
    # assistant_reply = response_data['content'][0]['text']

    print(json.dumps(response_data, ensure_ascii=False, indent=4))

except Exception as e:
    # 예외가 발생하면 에러 메시지만 JSON 형식으로 반환
    print(json.dumps({"error": str(e)}, ensure_ascii=False))
