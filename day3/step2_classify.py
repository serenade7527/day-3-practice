import pandas as pd
from openai import OpenAI
import json
import os

df = pd.read_csv("day3/Day3_feedback_cleaned.csv", encoding="utf-8-sig")

client = OpenAI(
    base_url="https://models.inference.ai.azure.com",
    api_key=os.environ["GITHUB_TOKEN"],
)

def classify_feedback(content, star_rating):
    prompt = f"""카페 고객 피드백을 분류해주세요.

피드백: "{content}"
별점: {star_rating if pd.notna(star_rating) else "없음"}

다음 JSON 형식으로만 답하세요. 다른 텍스트는 쓰지 마세요:
{{"유형": "불만 또는 요청 또는 칭찬 또는 문의", "감정": "긍정 또는 부정 또는 중립"}}

분류 기준:
- 유형: 불만(부정적 경험/문제 제기), 요청(개선/추가 요청), 칭찬(긍정적 평가), 문의(질문/확인 요청)
- 감정: 긍정(만족/기쁨), 부정(불만/실망), 중립(사실 전달/질문)"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=100,
        temperature=0,
    )

    result = json.loads(response.choices[0].message.content.strip())
    return result["유형"], result["감정"]

유형_list = []
감정_list = []

for _, row in df.iterrows():
    print(f"분류 중... id={row['id']}: {str(row['내용'])[:30]}...")
    유형, 감정 = classify_feedback(row["내용"], row["별점"])
    유형_list.append(유형)
    감정_list.append(감정)
    print(f"  → 유형: {유형}, 감정: {감정}")

df["유형"] = 유형_list
df["감정"] = 감정_list

output_path = "day3/Day3_feedback_classified.csv"
df.to_csv(output_path, index=False, encoding="utf-8-sig")

print("\n분류 완료!")
print(df[["id", "별점", "유형", "감정", "내용"]].to_string(index=False))
