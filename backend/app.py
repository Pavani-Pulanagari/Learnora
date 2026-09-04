import streamlit as st

st.set_page_config(
    page_title="Learnora",
    page_icon="📚"
)

st.title("📚 Learnora")
st.subheader("AI-Powered Research Assistant")

st.write("Welcome to Learnora!")

question = st.text_input(
    "Ask a question:",
    placeholder="What would you like to know?"
)

if st.button("Ask Learnora"):
    if question:
        st.info("Your question was received!")
    else:
        st.warning("Please enter a question.")