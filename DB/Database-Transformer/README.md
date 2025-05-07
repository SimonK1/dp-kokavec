# Weaviate Vector Database 
This directory contains a Docker Compose configuration for running a local instance of the **Weaviate** vector database with integration to local transformer.

The `docker-compose.yml` sets up the following services:

### 1. **Weaviate**
- A vector database 
- Exposes ports `8080` (HTTP API) and `50051` (gRPC)
- Stores data persistently in a local volume (`./data/Volumes`)
- Enables local transformers for vectorization

### 2. **t2v-transformers**
- A sentence-transformer inference service (MiniLM model) used by Weaviate for generating vector embeddings from text

---

## How to Start the Database

### 1. **Prerequisites**
- Docker and Docker Compose installed.
- A valid **OpenAI API Key** is not required

### 2. Start Docker
- Start your docker instance

### 3. Run docker compose
```docker-compose up -d```

### 4. Verify
Open your browser at http://localhost:8080
