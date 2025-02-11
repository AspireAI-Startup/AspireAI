# Aspire AI

Aspire AI is an intelligent career consultation platform that leverages AI/ML and LLM models to provide personalized career guidance. The platform collects user data, analyzes their responses, and suggests the best career paths based on AI-generated recommendations.

## Features

- **AI-Powered Career Advice** – Uses DeepSeek and LangChain to generate career recommendations.
- **Real-Time Chatbot** – Built with AWS, DynamoDB, and Socket.IO for real-time interaction.
- **Data Storage & Analysis** – Stores user responses in MongoDB for insights and career predictions.
- **Secure & Scalable** – Deployed using Docker and AWS serverless architecture.
- **Automated AI Conversations** – Maintains chat history with DynamoDB and ConversationBufferMemory.
- **Google Vertex AI Integration** – (Planned) Enhancing recommendations with advanced AI capabilities.
- **Monetization Model** – Acts as a broker, selling student data to private colleges and earning commissions.
- **Certification System** – Future scope includes partnering with international universities for certification programs.

## Tech Stack

### **Frontend:**(In progress)
- React.js (Planned)
- Tailwind CSS

### **Backend:**(In progress)
- Node.js with Express.js
- LangChain (For AI chatbot functionality)
- Gemini LLM (Using Llama API key)
- AWS Lambda for serverless execution
- Redis & Kafka for real-time processing

### **Database:**
- MongoDB (For storing user responses and analytics)
- AWS DynamoDB (For chat history and AI memory management)

### **Deployment & DevOps:**
- Docker & Docker Compose
- AWS (Lambda, IAM, Cloud, S3)

## Installation & Setup

### Prerequisites:
- **Node.js** (Latest LTS version)
- **Docker** (For containerization)
- **AWS Account** (For cloud-based services)

### Steps:
1. Clone the repository:
   ```sh
   git clone https://github.com/AspireAI-Startup/AspireAI.git
   cd aspire-ai
   ```
2. Install dependencies:
   ```sh
   yarn install  # Using Yarn as package manager
   or 
    npm install
   ```
3. Set up environment variables:
   Create a `.env` file and add required API keys and configurations:
   ```env
   PORT
   MONGO_URI
   ACCESS_TOKEN_SECRET
  ACCESS_TOKEN_EXPIRY
  REFRESH_TOKEN_SECRET
   REFRESH_TOKEN_EXPIRY 
   ```
4. Run the application locally:
   ```sh
   yarn dev
   ```

## Docker Setup for AI model
To build and run the project using Docker:
```sh
docker pull alphadevops1/my-ai-agent
```

## Contribution Guidelines
1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`
3. Commit changes and push to your branch.
4. Open a pull request for review.

## Future Enhancements
- AI-driven resume analysis and enhancement.
- Partnership with universities for certification programs.
- Multi-language support for a global audience.
- Advanced ML-based career predictions using user trends.

## Contact & Support
For any issues or feature requests, contact:
- **Backend:** Krishnakant yadav ,Harshita Gupta,Aryan Kumar
- **AI Model** Mohd Haseeb Ali, Shubham Maurya
- **Email:** [developerhaseeb1234@gmail.com](mailto:developerhaseeb1234@gmail.com)
🚀 **Aspire AI – Your AI-powered career mentor!**

