# Investor Dashboard (Streamlit)

This project exposes a Streamlit-based investor dashboard for reviewing AI-generated startup analyses that are served by the existing backend API.

## Prerequisites

* Python 3.11+
* A running backend API that exposes the `/deals`, `/upload`, `/generate_memo/{deal_id}`, and related download endpoints.

## Local development

1. Install dependencies:

   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

2. Set the backend API base URL (defaults to `http://localhost:8000`):

   ```bash
   export API_BASE_URL="https://your-backend-url"
   ```

   You can also adjust the backend URL from the Streamlit sidebar while the app is running if you need to switch hosts.

3. Start the Streamlit application:

   ```bash
   streamlit run streamlit_app.py --server.port=8080
   ```

## Deployment

The `Dockerfile` builds a production image that launches the Streamlit server. Configure the `API_BASE_URL` environment variable at runtime so the app can reach the backend.

## Cloud Build

`cloudbuild.yaml` demonstrates how to build and push the Streamlit frontend image. Update the build arguments to reflect your backend URL before running the build.
