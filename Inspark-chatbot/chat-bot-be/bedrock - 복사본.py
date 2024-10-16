import boto3
import json
import sys
import os
import chromadb
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
from chromadb.config import Settings

client = boto3.client('bedrock-runtime', region_name='ap-northeast-2')
#인코딩 문제 해결
sys.stdout.reconfigure(encoding='utf-8')

embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
chroma_client = chromadb.Client()
# collection = client.get_collection(name="my_collection")
persist_directory = "./chroma"  # 디렉토리 설정
settings = Settings(persist_directory=persist_directory)  # Settings 객체 생성
chroma_client = chromadb.PersistentClient(settings=settings)
collection = chroma_client.get_collection(name = "aws_all_merge")

# 입력으로 받은 요청 데이터
request_body = sys.argv[1]
# .env 파일에서 환경 변수를 로드
# print(request_body)
load_dotenv()

######################## 삽입코드 시작
parsed_json = json.loads(request_body)
user_question = parsed_json['messages'][0]['content']

# 크로마db 서칭
question_embedding = embedding_model.encode(user_question).tolist()
n_results = 10
results = collection.query(
    query_embeddings=[question_embedding],
    n_results=n_results,
    include=['metadatas']
)
retrieved_texts = "\n".join([metadata['text'] for metadata in results['metadatas'][0]])



prompt_content = (
        f"Here is some reference text:\n\n{retrieved_texts}\n\n"
        "Please provide a detailed and thorough answer to the following question using the reference text provided. "
        "If the reference text is irrelevant to the question, feel free to answer based solely on your own knowledge. "
        "Do not mention the reference text explicitly in your answer.\n\n"
        "Additionally, make sure your answer is well-structured and organized in a logical flow. "
        "Ensure that technical details are explained clearly and concisely, so that someone unfamiliar with the topic can understand. "
        "If any complex concepts or diagrams (such as 'state diagrams' or 'clock signals') are referenced, please explain them in detail for clarity.\n\n"
        f"Question: {user_question}\n\n"
        "If your response includes any specific AWS instance feature, "
        "please ask the user if they would like to use that feature by adding the following message: "
        "'[핵심 기능]을 사용하시겠습니까?'"
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
    print(json.dumps(response_data, ensure_ascii=False, indent=4))

except Exception as e:
    # 예외가 발생하면 에러 메시지만 JSON 형식으로 반환
    print(json.dumps({"error": str(e)}, ensure_ascii=False))
