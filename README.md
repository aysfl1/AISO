# AI's Second Opinion (AISO)

AI's Second Opinion (AISO) is an AI-powered medical second opinion platform designed to provide users with comprehensive, evidence-based medical consultations. The backend leverages advanced AI models (OpenAI, Perplexity) to deliver structured, stepwise consultations, document analysis, and research-backed responses.

---

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Development](#development)
- [License](#license)

---

## Features
- **AI-Powered Consultations:** 26-step structured medical consultations with context-aware responses.
- **Document Upload & Analysis:** Upload and analyze medical documents (imaging, lab results, notes, etc.).
- **Patient Information Management:** Store and retrieve patient demographics, history, and more.
- **Medical Research Integration:** Real-time, citation-backed research using Perplexity AI.
- **User Management:** Unique patient IDs, consultation history, and activity tracking.
- **RESTful API:** Modular, extensible Express.js backend.

---

## Architecture
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **AI Integration:** OpenAI (doctor responses), Perplexity (medical research)
- **File Uploads:** Multer for secure document handling
- **API Structure:** RESTful endpoints for users, consultations, documents, and patient info

---

## Installation

### Prerequisites
- Node.js (v18+ recommended)
- npm
- MongoDB instance (local or cloud)

### 1. Clone the Repository
```bash
git clone <repo-url>
cd AISO
```

### 2. Install Dependencies
```bash
npm run install-all
```

### 3. Environment Variables
Create a `.env` file in `/server` with the following:
```
MONGODB_URI=<your-mongodb-uri>
OPENAI_API_KEY=<your-openai-api-key>
PERPLEXITY_API_KEY=<your-perplexity-api-key>
```

### 4. Start the Application
```bash
npm run dev
```
This will concurrently start both the backend server and the (optional) client.

---

## API Endpoints

### Users
- `POST   /api/users/` — Create a new user
- `GET    /api/users/:id` — Get user by MongoDB ID
- `GET    /api/users/patient/:patientId` — Get user by patient ID

### Patient Info
- `POST   /api/patient-info/` — Create patient info
- `GET    /api/patient-info/:id` — Get patient info by ID
- `GET    /api/patient-info/user/:userId` — Get patient info by user ID

### Consultations
- `POST   /api/consultations/` — Create a new consultation
- `GET    /api/consultations/:id` — Get consultation by ID
- `GET    /api/consultations/user/:userId` — Get all consultations for a user
- `POST   /api/consultations/:id/messages` — Send a message in a consultation

### Documents
- `POST   /api/documents/` — Upload documents (multipart/form-data, up to 5 files)
- `GET    /api/documents/:id` — Get document by ID
- `GET    /api/documents/user/:userId` — Get all documents for a user
- `GET    /api/documents/consultation/:consultationId` — Get all documents for a consultation
- `GET    /api/documents/:id/download` — Download a document

### Health Check
- `GET    /api/health` — API status

---

## Project Structure
```
AISO/
├── client/                # (Optional) Frontend client (not included)
├── server/
│   ├── config/            # Database config
│   ├── controllers/       # Route controllers (business logic)
│   ├── middlewares/       # Multer upload middleware
│   ├── models/            # Mongoose models (User, PatientInfo, Consultation, Document)
│   ├── routes/            # Express route definitions
│   ├── uploads/           # Uploaded documents
│   └── utils/             # AI and research service integrations
├── package.json           # Project scripts and dependencies
└── README.md              # Project documentation
```

---

## Development
- **Start in Dev Mode:** `npm run dev` (concurrent server/client)
- **Backend Only:** `cd server && npm run dev`
- **Install All Dependencies:** `npm run install-all`
- **Build Client:** `cd client && npm run build` (if client exists)

---

## License
This project is licensed under the ISC License.

---

## Acknowledgements
- [OpenAI](https://openai.com/)
- [Perplexity AI](https://www.perplexity.ai/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)

---

## Contact
For questions or support, please open an issue or contact the project maintainer.
