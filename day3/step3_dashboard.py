import streamlit as st
import pandas as pd
import plotly.express as px

st.set_page_config(page_title="카페 VoC 대시보드", layout="wide")
st.title("☕ 카페 고객 피드백 대시보드")

df = pd.read_csv("day3/Day3_feedback_classified.csv", encoding="utf-8-sig")

# 상단 요약 지표
col1, col2, col3, col4 = st.columns(4)
col1.metric("전체 피드백", f"{len(df)}건")
col2.metric("불만", f"{(df['유형'] == '불만').sum()}건")
col3.metric("칭찬", f"{(df['유형'] == '칭찬').sum()}건")
col4.metric("평균 별점", f"{df['별점'].mean():.1f}점")

st.divider()

left, right = st.columns([1, 1])

with left:
    st.subheader("유형별 피드백 현황")
    counts = df["유형"].value_counts().reset_index()
    counts.columns = ["유형", "건수"]
    color_map = {"불만": "#EF553B", "칭찬": "#00CC96", "요청": "#636EFA", "문의": "#FFA15A"}
    fig = px.bar(
        counts,
        x="유형",
        y="건수",
        color="유형",
        color_discrete_map=color_map,
        text="건수",
    )
    fig.update_layout(showlegend=False, xaxis_title="", yaxis_title="건수")
    fig.update_traces(textposition="outside")
    st.plotly_chart(fig, use_container_width=True)

with right:
    st.subheader("🚨 긴급 불만 Top 3")

    complaints = df[df["유형"] == "불만"].copy()

    # 별점 낮을수록 긴급 (없으면 부정 감정이므로 2점으로 처리)
    complaints["긴급점수"] = complaints["별점"].fillna(2.0).apply(lambda x: 6 - x)
    top3 = complaints.sort_values("긴급점수", ascending=False).head(3)

    for i, (_, row) in enumerate(top3.iterrows(), 1):
        star = f"⭐ {row['별점']:.0f}점" if pd.notna(row["별점"]) else "별점 없음"
        with st.container(border=True):
            st.markdown(f"**#{i} [{row['경로']}] {star}**")
            st.write(row["내용"])
            st.caption(f"접수일: {row['받은날짜']} | 감정: {row['감정']}")

st.divider()

st.subheader("전체 피드백 목록")
st.dataframe(
    df[["id", "받은날짜", "경로", "별점", "유형", "감정", "내용"]],
    use_container_width=True,
    hide_index=True,
)
