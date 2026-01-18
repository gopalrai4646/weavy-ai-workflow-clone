
# Weavy AI Workflow Clone

A high-performance **visual workflow builder for LLM automation**, featuring a pixel-perfect React Flow canvas, **Google Gemini API integration**, and **asynchronous task execution with detailed history tracking**.

Build complex AI workflows by visually connecting nodes and executing them with **dependency resolution and parallel processing**.

🔗 **Live Deployment**: https://weavy-ai-workflow-clone.vercel.app/

---

## 🚀 Features

- **Visual Workflow Builder**  
  Drag-and-drop workflow creation using React Flow.

- **Node-Based Architecture**  
  Build workflows using the following node types:
  - **Text Node** – Input text for system and user prompts  
  - **Upload Image** – Upload and process images (JPG, PNG, WebP)  
  - **Upload Video** – Upload and process videos (MP4, MOV)  
  - **Run LLM** – Execute Gemini AI models (Gemini 3 Flash / Pro) with vision support  
  - **Crop Image** – Crop images using percentage-based coordinates  
  - **Extract Frame** – Extract frames from videos at specific timestamps  

- **DAG Validation**  
  Automatic cycle detection and dependency validation.

- **Asynchronous Execution Engine**  
  Parallel execution of independent nodes using topological sorting.

- **Execution History**  
  Complete workflow run tracking with node-level execution logs.

- **Real-time Status Updates**  
  Visual indicators for each node:
  - Idle  
  - Running  
  - Success  
  - Failed  

- **Modern UI**  
  Dark theme, smooth animations, and responsive design.

- **Undo / Redo Support**  
  History-based workflow modification management.

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript  
- **State Management**: Zustand  
- **Workflow Canvas**: React Flow 11  
- **AI Integration**: Google Gemini AI (`@google/genai`)  
- **Icons**: Lucide React  
- **Build Tool**: Vite 6  
- **Styling**: Tailwind CSS (CDN)

---
