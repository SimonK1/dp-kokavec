# Weaviate Vector Database 
This directory contains a Docker Compose configuration for running a local instance of the **Weaviate** vector database with integration to OpenAI transformer.

The `docker-compose.yml` sets up the following services:

### 1. **Weaviate**
- A vector database 
- Exposes ports `8080` (HTTP API) and `50051` (gRPC)
- Stores data persistently in a local volume (`./data/Volumes`)
- Enables OpenAI vectorization module "text2vec-openai"

---

## How to Start the Database

### 1. **Prerequisites**
- Docker and Docker Compose installed.
- A valid **OpenAI API Key** is required

### 2. **Set the OpenAI API Key**
Create a `.env` file in the root of your project  and add your key:

```OPENAI_APIKEY=your_openai_api_key_here```

### 2. Start Docker
- Start your docker instance

### 3. Run docker compose
```docker-compose up -d```

### 4. Verify
Open your browser at http://localhost:8080
