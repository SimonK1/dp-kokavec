# Usage Guide

This project is divided into three main components that together form a fully functional ecosystem:

1. **Chat Application**
2. **Vector Database**
- Controller - Used to controll operations with Weaviate Database
- Database-OpenAI - Docker compose to run Database with OpenAI transformer
- Database-Transformer - Docker compose to run Database with local transformer
3. **Scrapers (Data Collectors)**

Each component can be run **locally**. Detailed instructions for launching each part are provided in the `README.md` file located in the respective folder.

The project is also deployed online at the following link:

> [Deployment Link](https://realia-dp.vercel.app)

Application deployed to this link connects to a university PowerPC server that hosts the vector database. Deployment of chat application is served by Vercel.

---

## Github repository link
There are all components available within one github repository:

- A Next.js web application that provides a user interface for communication and real estate search via chat.
- A Weaviate-based vector database that serves as a storage and search engine for vectorized data.
- Tools for collecting data from external sources and transforming it into a format suitable for the database.
- Note: Sample data is already available in the database folder.


> - **GitHub Repository:** [GitHub Link](https://github.com/SimonK1/dp-kokavec)
