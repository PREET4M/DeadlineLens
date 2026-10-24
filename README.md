# 🛡️ ScamShield Local

**An evidence-first, privacy-focused AI assistant for analyzing suspicious messages using local AI inference.**

ScamShield Local analyzes suspicious messages, identifies potential warning signs, extracts supporting evidence quotes, assesses risk, and recommends safe verification steps. It uses an open-weight Gemma model through Ollama, with the goal of keeping message analysis on the user's own machine without relying on third-party AI APIs.

> **Important:** ScamShield Local is a decision-support tool, not a guarantee of scam detection. Always verify suspicious messages independently through trusted channels.

---

## 📌 Problem Statement

### The Problem

People receive suspicious SMS messages, emails, and online offers every day. Examples include fake job offers requiring upfront fees, urgent account suspension alerts, and fraudulent delivery notifications.

When people are uncertain, they may turn to generic AI chatbots for help. However, these tools can produce vague warnings, unsupported conclusions, or explanations that fail to identify the specific evidence behind a prediction.

There is also a privacy concern: submitting sensitive messages to cloud-based AI services may transmit personal information to external servers.

### The Solution

**ScamShield Local takes an evidence-first, local-first approach.**

Instead of simply labeling a message as a scam, the application aims to explain:

- Which phrases appear suspicious.
- Why those phrases may indicate a potential scam.
- What risk category the message falls into.
- How the user can verify the claims safely.
- What cannot be established from the message text alone.

The objective is to help users make more informed decisions without requiring them to blindly trust an AI-generated verdict.

---

## 🚀 Key Features

### 1. Risk Assessment

Categorizes analyzed messages into three outcomes:

- **High Risk:** Strong warning signs that warrant serious caution.
- **Suspicious:** Potential warning signs that require further investigation.
- **No Obvious Warning Signs Detected:** The analysis did not identify clear red flags.

The final category does not mean the message is safe or legitimate.

### 2. Evidence-First Explanations

Identifies specific phrases from the submitted message and explains why they may be concerning.

Examples include:

- Artificial urgency or threats of immediate consequences.
- Requests for upfront registration fees.
- Attempts to obtain credentials or sensitive information.
- Pressure to act before independently verifying a claim.

Evidence quotes are intended to make the analysis understandable and auditable. They should be checked against the original message rather than accepted automatically.

### 3. Safe Verification Recommendations

Encourages independent verification, such as:

- Opening an official banking app directly.
- Visiting a known official website instead of following a suspicious link.
- Contacting an organization through a trusted phone number.
- Verifying job offers through the employer's legitimate channels.

### 4. Explicit Uncertainty

Highlights limitations of text-based analysis, including the inability to reliably establish sender identity, website ownership, or the authenticity of an offer from message text alone.

### 5. Local AI Inference

Uses Ollama to run Gemma 3 4B locally, avoiding dependence on a third-party AI inference API for the core analysis workflow.

### 6. Input and Output Validation

The backend validates incoming requests and checks model responses against the application's expected data structure.

The model is instructed to treat submitted messages as untrusted content rather than instructions to follow. These safeguards can reduce certain risks but do not eliminate prompt injection or model errors.

---

## 🏗️ Architecture

```text
┌─────────────────────────────────────┐
│        React + Vite Frontend        │
│          User Interface             │
└──────────────────┬──────────────────┘
                   │
                   │ HTTP / JSON
                   ▼
┌─────────────────────────────────────┐
│         Python + FastAPI             │
│  Request Handling & Validation      │
│  Prompt Construction                │
│  Response Schema Validation         │
└──────────────────┬──────────────────┘
                   │
                   │ Local HTTP Inference
                   ▼
┌─────────────────────────────────────┐
│          Ollama Runtime             │
│           Gemma 3 4B                 │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│       Structured Risk Analysis      │
│  Risk · Evidence · Recommendations  │
└─────────────────────────────────────┘
```

### Technology Stack

| Component | Technology | Purpose |
|---|---|---|
| Frontend | React | User interface |
| Development server | Vite | Frontend development and bundling |
| Backend | Python + FastAPI | API and request handling |
| Model runtime | Ollama | Local model inference |
| AI model | Gemma 3 4B | Message analysis and explanations |
| Validation | Pydantic, if used in the implementation | Structured data validation |

The exact API endpoints, model configuration, and validation behavior depend on the implementation in the repository.

---

## 💡 Why Gemma 3 4B?

ScamShield Local uses Gemma 3 4B as a practical starting point for local AI experimentation.

### Reasons for the choice

- **Local deployment:** Can be run through Ollama on compatible consumer hardware.
- **Manageable model size:** A 4-billion-parameter model is a practical starting point compared with substantially larger models, although actual memory requirements depend on quantization, context length, and runtime overhead.
- **Natural-language analysis:** Can interpret message wording and generate explanations of potential warning signs.
- **Accessible experimentation:** Developers can experiment with the inference workflow without requiring a paid hosted-model API.

### Trade-offs

A smaller model may miss subtle scam indicators, misinterpret legitimate messages, generate unsupported evidence, or fail to follow instructions consistently.

Structured output validation can check data format, but it cannot guarantee that the model's conclusions are factually correct.

The model should therefore be evaluated using representative test cases before being relied upon for security-sensitive decisions.

---

## 🔒 Privacy and Threat Model

### What the Application Is Designed to Address

**Unnecessary external AI processing**

The core analysis workflow is designed to use a locally running Ollama instance instead of a third-party AI inference API.

**Unexplained AI conclusions**

Evidence quotes and explanations aim to make the model's reasoning easier for users to inspect.

**Malicious instructions in submitted messages**

The model is instructed to treat message content as untrusted data. Backend validation provides an additional check on the returned structure.

### What the Application Does Not Guarantee

**Complete privacy or network isolation**

Local inference alone does not prove that every application component is free from external requests. Network behavior, dependencies, logging, and optional integrations must be assessed separately.

**Protection against every prompt injection attack**

Prompt instructions and schema validation are useful safeguards, not complete security boundaries. Model behavior can still be manipulated.

**Independent fraud verification**

The application does not establish the true identity of a sender or verify live domain records, phone directories, or financial databases through text analysis alone.

**Protection against a compromised computer**

The application assumes the host operating system and local environment are not already compromised.

**Correct scam classification**

AI-generated results can contain false positives and false negatives. Users should independently verify important claims.

---

## ⚙️ Prerequisites

Install the following before running the application:

- Python 3.11 or later.
- Node.js 18 or later and npm.
- Git.
- Ollama.
- Sufficient RAM and available storage for the model and application.

Hardware requirements and inference speed vary by system configuration.

---

## 📦 Installation and Setup

The following instructions assume a repository structure similar to:

```text
ScamShield/
├── backend/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── package.json
│   └── src/
└── README.md
```

**Adjust the commands if the actual repository uses different filenames or directories.**

### Step 1: Clone the Repository

```bash
git clone https://github.com/PREET4M/ScamShield.git
cd ScamShield
```

### Step 2: Install and Prepare Ollama

Install Ollama from the official website:

https://ollama.com/download

Download the model:

```bash
ollama pull gemma3:4b
```

Check that the model responds:

```bash
ollama run gemma3:4b
```

Enter a simple test prompt and confirm that the model produces a response. Exit the interactive session when finished.

Ollama commonly runs as a background service on desktop installations. If it is not already running, start it with:

```bash
ollama serve
```

Do not start a second service if Ollama is already listening on its default port.

### Step 3: Set Up the Backend

Open a terminal at the repository root:

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment.

**Windows PowerShell:**

```powershell
.\.venv\Scripts\Activate.ps1
```

If script execution is restricted, follow the appropriate PowerShell execution-policy guidance for your environment rather than changing system-wide security settings unnecessarily.

**macOS / Linux:**

```bash
source .venv/bin/activate
```

Install the project's declared dependencies:

```bash
python -m pip install -r requirements.txt
```

Start the backend, assuming the application is defined as `app` in `main.py`:

```bash
uvicorn main:app --reload --port 8000
```

If the project uses another module or application variable, adjust the command accordingly.

If implemented, the health endpoint can be checked at:

http://127.0.0.1:8000/api/health

### Step 4: Set Up the Frontend

Open a second terminal at the repository root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, commonly:

http://localhost:5173

### Step 5: Run a Test Analysis

Submit a harmless sample message through the interface.

Confirm that:

1. The frontend accepts the input.
2. The backend receives the request.
3. Ollama is reachable and responds.
4. The application returns the expected structured result.
5. The interface displays the risk assessment, evidence, and recommendations correctly.

If any step fails, inspect the terminal output from both the frontend and backend.

---

## 🧪 Testing and Validation

ScamShield Local should be evaluated against both suspicious and legitimate messages, as well as inputs designed to test its robustness.

The following cases are suggested smoke tests. Record the observed result after running each case with the actual application and model configuration.

| Test Case | Example | Expected Behavior |
|---|---|---|
| Upfront-fee job offer | A job offer demanding a registration payment | Identify the payment request as a potential warning sign |
| Urgent account alert | A message threatening account suspension | Identify the urgency and recommend independent verification |
| Routine notification | A neutral appointment reminder | Avoid inventing suspicious evidence |
| Prompt injection attempt | Message containing instructions to override the model's task | Treat the submitted message as untrusted content and evaluate the result |
| Malformed input | Empty or incorrectly formatted request | Reject or handle the request according to backend validation rules |

### Recording Results

For each test, record:

- The exact test input.
- The expected behavior.
- The actual observed output.
- Whether the result met the expectation.
- The model version and relevant configuration.
- Any errors or unexpected behavior.

These tests provide an initial functional check, not a comprehensive accuracy benchmark.

Detection accuracy, false-positive rates, false-negative rates, and resistance to adversarial inputs require broader, repeatable evaluation.

---

## ⚠️ Known Limitations

1. **Text-only analysis:** The model evaluates submitted text and does not independently establish whether a sender, domain, or offer is genuine.
2. **Model uncertainty:** AI predictions and explanations can be incorrect or incomplete.
3. **Hardware dependence:** Inference speed and memory usage vary with hardware, quantization, context length, and runtime configuration.
4. **First-run latency:** Initial model loading and inference can take longer than subsequent requests.
5. **Prompt injection:** Maliciously crafted input may influence model behavior despite the safeguards.
6. **No guaranteed scam prevention:** ScamShield is an assistive tool and should not replace independent verification.

---

## 🛣️ Future Improvements

Potential areas for further development include:

- More systematic evaluation using diverse scam and legitimate-message datasets.
- Support for Indian languages and regional scam patterns.
- Automated regression tests for model outputs and backend validation.
- Better evaluation of false positives and false negatives.
- Robustness testing against adversarial inputs and prompt injection.
- Additional analysis capabilities while preserving the local-first design wherever possible.

These are potential improvements, not claims about features already implemented.

---

## 🤝 Contributing

Contributions, bug reports, and suggestions are welcome.

A typical contribution workflow is:

1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Commit your changes with a descriptive message.
5. Push the branch to your fork.
6. Open a pull request describing the change and its testing.

Example commands:

```bash
git checkout -b feature/your-improvement
git add .
git commit -m "Describe your improvement"
git push origin feature/your-improvement
```

Please avoid including real personal messages, credentials, API keys, or other sensitive information in issues, test fixtures, or pull requests.

---

## 📄 License

This project is intended to be distributed under the MIT License.

The repository should include a `LICENSE` file containing the actual license text before this statement is treated as a confirmed licensing declaration.

The model and its associated assets are subject to their own applicable terms. Review the relevant model license and terms before redistributing model files or incorporating them into another product.

---

## 🌱 Built for the Hacktoberfest Open-Source AI Challenge

ScamShield Local is being developed as part of the **Hacktoberfest Open-Source AI Challenge — Week 3: Slow and Steady**.

The project explores how local AI inference, evidence-based explanations, and privacy-conscious software design can work together to make scam analysis more understandable and accessible.

**Repository:** https://github.com/PREET4M/ScamShield

If you are interested in local AI, cybersecurity, or open-source development, explore the code and share your feedback.

The goal is simple: help people pause, question suspicious messages, and verify before they act.

---

*Disclaimer: ScamShield Local is an experimental AI-assisted analysis tool. It does not guarantee the detection or prevention of scams. Always verify suspicious messages through independently obtained, trusted channels.*
