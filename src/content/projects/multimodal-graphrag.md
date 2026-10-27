---
title: Multimodal GraphRAG Dashboard
description: Ask questions about indexed documents, read generated answers, and inspect the graph retrieved for each question.
date: 2026-09-19
tags: [GraphRAG, LLMs, Python, Streamlit]
featured: true
order: 2
repo: https://github.com/Muntaha15/multimodal_LightRag_application
kind: Applied AI
draft: false
---

## From a document to an inspectable answer

I built this Streamlit dashboard to connect document processing, graph-based retrieval, and locally served models in one LLM application. Users can index material, ask questions, read generated answers, and inspect the retrieved entities and relationships. This independent project is separate from the learning platform in my professional work.

## How it works

[LightRAG](https://github.com/HKUDS/LightRAG) handles graph-based retrieval, and [RAG-Anything](https://github.com/HKUDS/RAG-Anything) provides multimodal document processing. A local Neo4j database stores the graph, with models served through Ollama.

Language, vision, and embedding models are configured separately. Docker Compose starts the database, and environment variables connect the application to its services. An indexing step prepares documents before the dashboard runs.

## My contribution

My work here is the application integration: connecting ingestion, retrieval, model responses, and graph visualization in one interface. One practical challenge was Streamlit's rerun behavior: repeatedly creating and closing asynchronous event loops could break the retrieval libraries' connections. I used a cached background loop and scheduled retrieval work on it, keeping those connections on a consistent loop across interactions.

## Running it locally

The dashboard requires a Python environment, the retrieval libraries, Neo4j, and Ollama models. The setup guide covers installation, model configuration, and document indexing.

## Explore the implementation

- [Source code and setup](https://github.com/Muntaha15/multimodal_LightRag_application)
- [Component and architecture guide](https://github.com/Muntaha15/multimodal_LightRag_application/blob/main/COMPONENTS.md)
