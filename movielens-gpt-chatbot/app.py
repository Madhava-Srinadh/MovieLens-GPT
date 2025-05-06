import streamlit as st
import os
from langchain_core.documents import Document
from langchain_community.vectorstores import FAISS
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnablePassthrough
from langchain_core.messages import HumanMessage, AIMessage
from langchain.text_splitter import RecursiveCharacterTextSplitter
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")
hf_token = os.getenv("HF_TOKEN")

# Initialize session state at the top
st.session_state.setdefault("conversation_history", [])

# Load project documentation
def load_documentation(file_path="project_documentation.md"):
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            content = file.read()
        return content
    except FileNotFoundError:
        return """
        Project Overview: MovieLens GPT is a full-stack MERN application for movie discovery with AI-powered recommendations. Users can browse movies, search using natural language, filter by genre/language/country, manage personal movie lists, and view detailed movie information.
        Features: Firebase Authentication, TMDB API for movie data, GroqCloud for AI search, MongoDB for user lists, and a Streamlit chatbot for support.
        Tech Stack: React.js, TailwindCSS, Redux, Node.js, Express.js, MongoDB, Streamlit, LangChain, FAISS, Groq.
        Application Flow: Users log in, browse movies, search/filter, manage lists, and view details with trailers.
        """

# Split documentation into chunks
documentation_content = load_documentation()
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len
)
chunks = text_splitter.split_text(documentation_content)
documents = [Document(page_content=chunk, metadata={"source": "project_documentation"}) for chunk in chunks]

# Initialize language model and embeddings
try:
    llm = ChatGroq(groq_api_key=groq_api_key, model="Llama3-8b-8192")
except Exception as e:
    st.error(f"Failed to initialize LLM: {str(e)}. Please verify GROQ_API_KEY in .env.")
    st.stop()

try:
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2", model_kwargs={"device": "cpu"})
except Exception as e:
    st.error(f"Failed to initialize embeddings: {str(e)}. Please check HF_TOKEN or model availability.")
    st.stop()

# Initialize vector store
try:
    vectorstore = FAISS.from_documents(documents, embedding=embeddings)
    retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 4})
except Exception as e:
    st.error(f"Failed to initialize vector store: {str(e)}. Please check documentation or embeddings.")
    st.stop()

# Define RAG chain with conversation history
message = """
You are an expert assistant for the MovieLens GPT project, a full-stack MERN application. Use the provided context and conversation history to answer any question about the project, including its purpose, features, application flow, technologies used, specific functionalities, setup, or troubleshooting. Provide detailed, accurate, and concise answers. Focus on explaining concepts clearly without referencing code directly unless asked. If information is missing, infer a reasonable response based on standard practices or admit the limitation.

Conversation History:
{history}

Question: {question}

Context: {context}
"""
prompt = ChatPromptTemplate.from_messages([
    ("system", message),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{question}")
])

# Removed format_history function

rag_chain = {
    "context": retriever,
    "question": RunnablePassthrough(),
    "history": lambda x: st.session_state.get("conversation_history", [])
} | prompt | llm

# Streamlit UI
st.title("MovieLens GPT Support Chatbot")
st.markdown("Ask any question about the MovieLens GPT project: its purpose, flow, technologies, functionalities, setup, or troubleshooting!")

# Welcome message
if not st.session_state["conversation_history"]:
    with st.chat_message("assistant"):
        st.markdown("Welcome to the MovieLens GPT support chatbot! I'm here to help with any questions about the project. What's on your mind?")

# Display conversation history
for msg in st.session_state["conversation_history"]:
    if isinstance(msg, HumanMessage):
        with st.chat_message("user"):
            st.markdown(msg.content)
    elif isinstance(msg, AIMessage):
        with st.chat_message("assistant"):
            st.markdown(msg.content)

# Input field for user questions
question = st.chat_input("Type your question here...")

if question:
    with st.chat_message("user"):
        st.markdown(question)

    # Invoke RAG chain and update history
    with st.chat_message("assistant"):
        response = None
        try:
            response = rag_chain.invoke(question)
            st.markdown(response.content)
        except Exception as e:
            st.error(f"Sorry, I encountered an error: {str(e)}. Please check your API keys or try again later.")

    # Update conversation history
    if response:
        st.session_state["conversation_history"].append(HumanMessage(content=question))
        st.session_state["conversation_history"].append(AIMessage(content=response.content))

    # Limit history to last 10 messages
    if len(st.session_state["conversation_history"]) > 10:
        st.session_state["conversation_history"] = st.session_state["conversation_history"][-10:]