import pandas as pd
import re

df = pd.read_csv("day3/Day3_과제_feedback.csv")

def normalize_date(date_str):
    date_str = str(date_str).strip()

    # 이미 YYYY-MM-DD 형식
    if re.match(r'^\d{4}-\d{2}-\d{2}$', date_str):
        return date_str

    # YYYY/MM/DD 형식
    if re.match(r'^\d{4}/\d{2}/\d{2}$', date_str):
        return date_str.replace('/', '-')

    # YY.M.D 또는 YY.M.DD 형식 (예: 26.5.6, 26.5.11)
    m = re.match(r'^(\d{2})\.(\d{1,2})\.(\d{1,2})$', date_str)
    if m:
        year = '20' + m.group(1)
        month = m.group(2).zfill(2)
        day = m.group(3).zfill(2)
        return f"{year}-{month}-{day}"

    # 5월 4일 형식 (한국어)
    m = re.match(r'^(\d{1,2})월\s*(\d{1,2})일$', date_str)
    if m:
        month = m.group(1).zfill(2)
        day = m.group(2).zfill(2)
        return f"2026-{month}-{day}"

    return date_str  # 변환 못하면 원본 유지

df['받은날짜'] = df['받은날짜'].apply(normalize_date)

output_path = "day3/Day3_feedback_cleaned.csv"
df.to_csv(output_path, index=False, encoding='utf-8-sig')

print("날짜 통일 완료!")
print(df[['id', '받은날짜', '경로', '별점']].to_string(index=False))
