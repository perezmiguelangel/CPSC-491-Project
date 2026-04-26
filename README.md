# Warden: A full stack solution to monitoring nodes
## CPSC 491 Project (WIP) - Miguel Perez

Warden is a solution to easily interpreting the overall status of your home servers via a friendly web GUI. This is a very WIP project and is not intended for live deployment as of yet.
The project includes everything from the backend to the frontend, allowing a fully self-hosted environment.

## Main Features
- Real-time Telemetry: With the use of WebSockets, real-time system metrics are fed to the web GUI
- Historical Data: A local SQLite database logs telemetry to allow historical view
- Process/Network Inspection: Allows for precise tracking of resource/network hogging processes
- Docker Support
- Lightweight

## Architecture
Warden is split into 3 components to ensure a lightweight monitoring agent
1. Node Monitoring Agent (node.py):
   - Python 3.x
   - psutil
2. Backend Server
   - FastAPI
   - Uvicorn
   - SQLAlchemy/SQLite
   - Pydantic
3. Frontend Client
   - React (Vite)
   - Tailwind CSS & Shadcn/ui
  
## How to Run
1. Start backend API
   ```
   pip install fastapi uvicorn sqlalchemy psutil
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
2. Start frontend dashboard
   ```
   npm install
   npm run dev
   ```
3. Start the node agent on servers
   > [!NOTE]
   > Some network sockets will not be available without root priveleges (Docker daemon, system, etc.)
   ```
   python node.py
   ```

To reiterate, this project is still a work in progress and should not be used in a public production environment.
