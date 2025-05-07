# WeAviate Controller Documentation

This notebook serves as a lightweight controller for managing and interacting with a **Weaviate Vector Database**. It supports creating, deleting, and populating collections from JSON files.

## Overview

The notebook provides:

- Connection setup for a custom, prepared Weaviate instance running on a PowerPC machine
- Schema configuration and collection creation
- Object ingestion from a structured JSON file (`listings.json`)
- Text splitting for embedding operations
- Safe deletion of collections

It uitlizes transformer provided by OpenAI, therefore API key is required.

Listings.json consists of 1000 randomly selected properties from nehnutelnosti.sk

It also contains commented code that will be linked to the local instance. Compatible with the rest of the local project deployment.

## Requirements

Make sure to install the following Python packages:

```bash
pip install weaviate-client langchain
```

## Connection Setup

The connection is established using:

- **HTTP and gRPC endpoints** to a self-hosted Weaviate instance
- **OpenAI API key** for embedding services

These are securely injected through headers:

```python
client = weaviate.connect_to_custom(
    http_host="YOUR_HOST",
    http_port=8080,
    http_secure=False,
    grpc_host="YOUR_HOST",
    grpc_port=50051,
    grpc_secure=False,
    headers={"X-OpenAI-Api-Key": "your-api-key"}
)
```

Add OpenAI api key.

## Notes

- Weaviate instance needs to have **text2vec-openai module** enabled
- Chunk sizes are set to 500 with 50 character overlap

---
