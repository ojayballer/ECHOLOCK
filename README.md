# ECHOLOCK

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Status](https://img.shields.io/badge/status-deployed-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-1.0.0-orange)

> A hybrid, federated AI defense system for real-time, collective phishing detection.

## [View the Live Demo Here](https://echolockai.up.railway.app/)

---

## About The Project

ECHOLOCK is a cybersecurity application I designed to combat the growing sophistication of phishing attacks. Unlike traditional, isolated scanners, ECHOLOCK operates as a **collective defense network**. It solves the problem of reactive threat intelligence by implementing a federated architecture.

When one node in the ECHOLOCK network detects a new, high-confidence threat, that threat's fingerprint (IOC) is instantly published to a central federation server powered by Redis. All other nodes subscribed to the network receive this update in milliseconds, granting them **immediate immunity** to a threat they have never even seen.

This is achieved through a **hybrid validation system** that combines multiple layers of defense for maximum speed and accuracy. The system employs a *fast-to-slow* check methodology, prioritizing efficiency without sacrificing detection capability.

> **Built for the Cyber AI Hackathon 2025**

---

## Gallery

| ECHOLOCK Main Interface | Phishing Result |
| :---: | :---: |
| <img width="800" alt="ECHOLOCK Main UI" src="./examples/normal_verdict.png"> | <img width="800" alt="ECHOLOCK Phishing Result" src="./examples/phishing_verdict.png"> |

**Demo Video:** []

---

## Table of Contents

- [About The Project](#about-the-project)
- [Gallery](#gallery)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Running the Application](#running-the-application)
  - [API Endpoints](#api-endpoints)
- [Model](#model)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Key Features

### Multi-Layer Hybrid Validation

ECHOLOCK employs a sophisticated **fast-to-slow** check system for high efficiency, processing URLs through four sequential validation layers:

1. **Static Allowlist** — Instantly approves known-safe domains (e.g., `google.com`) without further analysis.
2. **Static Blocklist** — Instantly blocks thousands of known phishing URLs from external databases.
3. **Federated Blocklist** — Checks against the real-time list of threats reported by other ECHOLOCK nodes across the federation.
4. **AI Analysis** — If a URL is still unknown after passing all list-based checks, it is submitted to the machine learning model for final verdict.

### Federation Layer

The federation architecture employs a **Redis Pub/Sub** system for real-time, collective threat intelligence sharing. When the AI model identifies a new, high-confidence phishing threat, the backend API publishes the threat's cryptographic hash to a dedicated Redis channel. 

> **An attack on one node protects all nodes in the federation.**

### Instant Immunity

New, high-confidence threats are propagated to all connected workers in **milliseconds**. The moment one organization identifies a phishing campaign, all federated nodes receive the threat fingerprint and update their local blocklists automatically, creating a collective immune system that adapts in real-time.

### Decoupled Architecture

ECHOLOCK is built with a clean separation of concerns across three independent services:

- **Frontend** — A TypeScript-based web application providing the user interface for URL submission.
- **Backend API** — A Flask server orchestrating validation logic and threat publication.
- **Federation Worker** — A standalone Python subscriber maintaining persistent connections to the Redis Pub/Sub channel.

This decoupled design ensures each component can scale independently and be deployed across distributed infrastructure.

---

## Architecture

ECHOLOCK consists of three main services and one central message broker working in concert:

### 1. Frontend (Client)

A web application built in **TypeScript** that provides the user interface for submitting URLs. It communicates with the Backend API and displays real-time analysis results with verdicts and confidence scores.

### 2. Backend API (The Publisher)

A **Python/Flask** server that serves as the main entry point and orchestrator of ECHOLOCK's validation logic. When a URL is submitted:

- The API first checks against the **static allow/block lists** and the **federated blocklist** stored in Redis.
- If the URL is still unknown, it is sent to the **AI model** for analysis.
- If a new, high-confidence threat is found, this service **publishes** the threat's SHA-256 hash to the Redis federation channel, alerting all subscribed nodes.

### 3. Federation Worker (The Subscriber)

A standalone **Python script** that maintains a persistent connection to the Redis Pub/Sub channel. When it **receives** a new threat hash from the channel, it adds this hash to the federated blocklist in the database, making it immediately available to all nodes. 

Upon startup, you will see the message: 
```
Subscribed to 'echolock_federation'. Waiting for new threats...
```

### 4. Redis Cloud (The Broker)

The central nervous system of ECHOLOCK. **Redis** serves dual critical roles:

- **Pub/Sub Broker** — Facilitates real-time communication between the publisher (Backend API) and subscribers (Federation Workers).
- **Persistent Database** — Stores the federated blocklist, enabling fast lookups and consistent state across all nodes.

---

## Tech Stack

This project was built with the following core technologies:

| Category | Technology |
| :--- | :--- |
| **Backend** | Python, Flask |
| **Frontend** | TypeScript, React |
| **ML Model** | Scikit-learn |
| **Database & Federation** | Redis Cloud |
| **Deployment** | Railway |

---

## Project Structure

The repository is organized into the following main directories:
```
/ECHOLOCK
├── BACKEND_ECHOLOCK/
│   ├── app.py              # Main Flask API, Publisher
│   ├── federation.py       # Publishes new threats
│   ├── federation_worker.py # Subscriber worker
│   ├── utils.py            # Model loading & prediction logic
│   ├── ECHOLOCK.pkl        # The saved LinearSVC model
│   ├── requirements.txt
│   ├── Procfile
│   └── ...
│
├── FRONTEND/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── MODEL/NOTEBOOK/
│   ├── ECHOLOCK.ipynb      # Notebook for model experimentation (RF)
│   └── ...
│
├── examples/
│   ├── normal_verdict.png
│   └── phishing_verdict.png
│
├── .gitignore
└── README.md
```

---

## Getting Started

Follow these instructions to get a local copy of ECHOLOCK up and running for development and testing.

### Prerequisites

You must have the following software installed on your local machine:

- **Python 3.8+** and `pip`
- **Node.js** and `npm`
- **Redis Cloud account** (or a local Redis server instance)

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/ojayballer/ECHOLOCK.git
cd ECHOLOCK
```

**2. Set up the Backend:**

Navigate to the backend directory:
```bash
cd BACKEND_ECHOLOCK
```

Install Python dependencies:
```bash
pip install -r requirements.txt
```

Create a `.env` file and add your Redis credentials:
```env
REDIS_HOST=your-redis-host.com
REDIS_PORT=12345
REDIS_PASS=your-password
REDIS_CHANNEL=echolock_federation
```

**3. Set up the Frontend:**

From the root, navigate to the frontend directory:
```bash
cd ../FRONTEND
```

Install Node.js dependencies:
```bash
npm install
```

Configure the frontend to point to your local backend (e.g., in a `.env` file):
```env
VITE_API_URL=http://127.0.0.1:5000
```

---

## Usage

To run the application, you must start all three services in separate terminal windows.

### Running the Application

**Terminal 1 — Start the Backend API:**

Navigate to the backend directory and run:
```bash
python app.py
```

The API will be running on `http://127.0.0.1:5000`.

**Terminal 2 — Start the Federation Worker:**

In a new terminal, navigate to the backend directory and run:
```bash
python federation_worker.py
```

You will see a message: `Subscribed to 'echolock_federation'. Waiting for new threats...`

**Terminal 3 — Start the Frontend:**

In a new terminal, navigate to the frontend directory and run:
```bash
npm run dev
```

Open your browser and navigate to the local address provided (e.g., `http://localhost:5173`).

---

### API Endpoints

The core of the application is its API.

#### `POST /api/check`

This endpoint analyzes a URL and returns a verdict.

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response Body:**
```json
{
  "url": "https://example.com",
  "verdict": "normal",
  "confidence": 98.5
}
```

**Response Fields:**

- `verdict` — Either `normal` or `phishing`
- `confidence` — A floating-point number (0-100) indicating the model's certainty. A confidence of 100 often means the URL was caught by a static list.

---

## Model

The `MODEL/NOTEBOOK/ECHOLOCK.ipynb` notebook documents part of my experimentation process, specifically my work with a **RandomForest** classifier that achieved **92% accuracy** on the validation set.

However, my model selection process extended beyond what is shown in the notebook. I experimented with multiple algorithms including **LSTMS**,**LinearSVC**, **Logistic Regression**, and **Gradient Boosting** through separate training scripts. After extensive benchmarking and performance analysis, I chose **LinearSVC** (Linear Support Vector Classifier) for the final production deployment, saved as `ECHOLOCK.pkl`.

### Why LinearSVC?

LinearSVC was ultimately selected because it provides the optimal balance of **high inference speed** and **strong predictive accuracy**, which is critical for a low-latency, real-time API. While the RandomForest model demonstrated strong accuracy, LinearSVC's efficient linear decision boundary computation allows ECHOLOCK to handle high request volumes without sacrificing detection performance.

### Note on Repository Contents

The included notebook (`ECHOLOCK.ipynb`) demonstrates my initial exploratory data analysis and RandomForest experimentation. I chose to include only this notebook in the repository to keep the project structure clean and focused, as it effectively illustrates my approach to feature engineering and baseline model development. The additional experimentation notebooks and hyperparameter tuning scripts used for model selection were development artifacts that I opted not to include in the final repository.

---

## Roadmap

This project is a functional prototype. Future plans to expand ECHOLOCK's capabilities include:

- [ ] **Global Threat Feed** — Create a public-facing dashboard to visualize new threats being added to the federation in real-time.
- [ ] **Browser Extension** — Develop a lightweight browser extension for seamless, real-time protection during web browsing.
- [ ] **Enterprise Routers** — Adapt the worker to run on enterprise or home routers as a network-level defense.
- [ ] **Advanced AI** — Re-train the model with a larger, more dynamic dataset and experiment with deep learning architectures (LSTMs, Transformers).
- [ ] **Decentralized Federation** — Explore a true peer-to-peer federation model to remove the single point of failure (the central Redis server).

---

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag *enhancement*.

**Steps to contribute:**

1. **Fork the Project**
2. **Create your Feature Branch:** `git checkout -b feature/AmazingFeature`
3. **Commit your Changes:** `git commit -m 'Add some AmazingFeature'`
4. **Push to the Branch:** `git push origin feature/AmazingFeature`
5. **Open a Pull Request**

---

## License

Distributed under the MIT License. See the `LICENSE` file for more information.

---

<div align="center">

**Author:** [ojayballer](https://github.com/ojayballer)  
**Project Link:** [https://github.com/ojayballer/ECHOLOCK](https://github.com/ojayballer/ECHOLOCK)

*Built with passion for the Cyber AI Hackathon 2025*

</div>
