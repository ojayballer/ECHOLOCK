# ECHOLOCK

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/ojayballer/ECHOLOCK)
[![Status](https://img.shields.io/badge/status-deployed-green)](https://echolockai.up.railway.app/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https/github.com/ojayballer/ECHOLOCK/blob/main/LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-informational)](https://github.com/ojayballer/ECHOLOCK)

A hybrid, federated AI defense system for real-time, collective phishing detection.

### [View the Live Demo Here](https://echolockai.up.railway.app/)

## About The Project

ECHOLOCK is a cybersecurity application I designed to combat the growing sophistication of phishing attacks. Unlike traditional, isolated scanners, ECHOLOCK operates as a collective defense network. It solves the problem of reactive threat intelligence by implementing a federated architecture.

When one node in the ECHOLOCK network detects a new, high-confidence threat, that threat's fingerprint (IOC) is instantly published to a central federation server. All other nodes subscribed to the network receive this update in milliseconds, granting them immediate immunity to a threat they have never even seen.

This is achieved through a **hybrid validation system** that combines multiple layers of defense for maximum speed and accuracy.

This project was built for the Cyber AI Hackathon 2025.

---

## Gallery

*This is a demonstration of the live application. The video link shows the full federated demo.*

| ECHOLOCK Main Interface | Phishing Result |
| :---: | :---: |
| <img width="800" alt="ECHOLOCK Main UI" src="./examples/normal_verdict.png"> | <img width="800" alt="ECHOLOCK Phishing Result" src="./examples/phishing_verdict.png"> |

**Demo Video:** `[PASTE YOUR YOUTUBE/LOOM VIDEO LINK HERE]`

---

## Table of Contents

* [Key Features](#key-features)
* [Architecture](#architecture)
* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)
* [Usage](#usage)
    * [Running the Application](#running-the-application)
    * [API Endpoints](#api-endpoints)
* [Model](#model)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)

---

## Key Features

* **Multi-Layer Hybrid Validation:** Uses a "fast-to-slow" check system for high efficiency.
    1.  **Static Allowlist:** Instantly approves known-safe domains (e.g., `google.com`).
    2.  **Static Blocklist:** Instantly blocks thousands of known phishing URLs from external databases.
    3.  **Federated Blocklist:** Checks against the real-time list of threats reported by other ECHOLOCK nodes.
    4.  **AI Analysis:** If a URL is unknown, it is passed to the AI model for a final verdict.
* **Federation Layer:** Employs a Redis Pub/Sub system for real-time, collective threat intelligence sharing. An attack on one node protects all nodes.
* **Instant Immunity:** New, high-confidence threats are propagated to all connected workers in milliseconds.
* **Decoupled Architecture:** A standalone frontend (TypeScript), backend API (Flask), and message worker (Python) make the system scalable and maintainable.

## Architecture

ECHOLOCK consists of three main services and one central message broker.

1.  **Frontend (Client):** A web application (built in TypeScript) that provides the user interface for submitting URLs. It communicates with the Backend API.
2.  **Backend API (The "Publisher"):** A Python/Flask server that serves as the main entry point. It receives URLs from the frontend and runs them through the hybrid validation logic.
    * It first checks against the **static allow/block lists** and the **federated blocklist** (in Redis).
    * If the URL is still unknown, it is then sent to the **AI model** for analysis.
    * If a new, high-confidence threat is found, this service **publishes** the threat's hash to the Redis federation channel.
3.  **Federation Worker (The "Subscriber"):** A standalone Python script that maintains a persistent connection to the Redis Pub/Sub channel. When it **receives** a new threat hash, it adds this hash to the federated blocklist in the database, making it available to all nodes.
4.  **Redis Cloud (The Broker):** The central nervous system. It acts as both the Pub/Sub channel for instant messaging and the persistent database (federated blocklist).

## Tech Stack

This project was built with the following core technologies:

| Category | Technology |
| :---: | :---: |
| **Backend** | Python, Flask |
| **Frontend** | TypeScript, React (or other) |
| **ML Model** | Scikit-learn |
| **Database & Federation** | Redis Cloud |
| **Deployment** | Railway |

## Project Structure

The repository is organized into the following main directories:

/ECHOLOCK ├── BACKEND_ECHOLOCK/ │ ├── app.py # Main Flask API, "Publisher" │ ├── federation.py # Publishes new threats │ ├── federation_worker.py # "Subscriber" worker │ ├── utils.py # Model loading & prediction logic │ ├── ECHOLOCK.pkl # The pre-trained LinearSVC model │ ├── requirements.txt │ ├── Procfile │ └── ... │ ├── FRONTEND/ │ ├── src/ │ ├── public/ │ ├── package.json │ └── ... │ ├── MODEL/NOTEBOOK/ │ ├── ECHOLOCK.ipynb # Notebook for model experimentation (RF, etc.) │ └── ... │ ├── examples/ │ ├── normal_verdict.png │ └── phishing_verdict.png │ ├── .gitignore └── README.md


## Getting Started

Follow these instructions to get a local copy of ECHOLOCK up and running for development and testing.

### Prerequisites

You must have the following software installed on your local machine:
* Python 3.8+ and `pip`
* Node.js and `npm`
* A Redis Cloud account (or a local Redis server instance)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/ojayballer/ECHOLOCK.git](https://github.com/ojayballer/ECHOLOCK.git)
    cd ECHOLOCK
    ```

2.  **Set up the Backend:**
    * Navigate to the backend directory:
        ```sh
        cd BACKEND_ECHOLOCK
        ```
    * Install Python dependencies:
        ```sh
        pip install -r requirements.txt
        ```
    * Create a `.env` file and add your Redis credentials:
        ```
        REDIS_HOST=your-redis-host.com
        REDIS_PORT=12345
        REDIS_PASS=your-password
        REDIS_CHANNEL=echolock_federation
        ```

3.  **Set up the Frontend:**
    * From the root, navigate to the frontend directory:
        ```sh
        cd ../FRONTEND
        ```
    * Install Node.js dependencies:
        ```sh
        npm install
        ```
    * Configure the frontend to point to your local backend (e.g., in a `.env` file):
        ```
        VITE_API_URL=[http://127.0.0.1:5000](http://127.0.0.1:5000)
        ```

## Usage

To run the application, you must start all three services.

### Running the Application

1.  **Start the Backend API (Terminal 1):**
    * Navigate to the backend directory and run:
        ```sh
        python app.py
        ```
    * The API will be running on `http://127.0.0.1:5000`.

2.  **Start the Federation Worker (Terminal 2):**
    * In a *new* terminal, navigate to the backend directory and run:
        ```sh
        python federation_worker.py
        ```
    * You will see a message: `"Subscribed to 'echolock_federation'. Waiting for new threats..."`

3.  **Start the Frontend (Terminal 3):**
    * In a *new* terminal, navigate to the frontend directory and run:
        ```sh
        npm run dev
        ```
    * Open your browser and navigate to the local address provided (e.g., `http://localhost:5173`).

### API Endpoints

The core of the application is its API.

#### `POST /api/check`

This endpoint analyzes a URL and returns a verdict.

**Request Body:**
```json
{
  "url": "[https://example.com](https://example.com)"
}
Response Body (Success):

JSON

{
  "url": "[https://example.com](https://example.com)",
  "verdict": "normal",
  "confidence": 98.5
}
verdict: "normal" or "phishing"

confidence: A floating-point number (0-100) indicating the model's certainty. A 100 confidence often means it was caught by a static list.

Model
The MODEL/NOTEBOOK/ECHOLOCK.ipynb notebook documents my experimentation and model selection process. In this notebook, I trained and evaluated several classifiers, including a RandomForest model which achieved 92% accuracy.

However, for the final production application, I chose LinearSVC (Support Vector Classifier), which is the ECHOLOCK.pkl file. LinearSVC was ultimately selected because it provides a superior balance of high inference speed and strong predictive accuracy, which is critical for a low-latency, real-time API.

Roadmap
This project is a functional prototype. Future plans to expand ECHOLOCK's capabilities include:

[ ] Global Threat Feed: Create a public-facing dashboard to visualize new threats being added to the federation in real-time.

[ ] Browser Extension: Develop a lightweight browser extension for seamless, real-time protection.

[ ] Enterprise Routers: Adapt the worker to run on enterprise or home routers as a network-level defense.

[ ] Advanced AI: Re-train the model with a larger, more dynamic dataset.

[ ] Decentralized Federation: Explore a true peer-to-peer federation model to remove the single point of failure (the central Redis server).

Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

License
Distributed under the MIT License. See the LICENSE file for more information.
