"""Streamlit-based investor dashboard frontend."""
from __future__ import annotations

import os
from datetime import datetime
from typing import Any, Dict, List, Optional
from urllib.parse import urljoin

import requests
import streamlit as st


st.set_page_config(page_title="Investor Dashboard", layout="wide")


def _get_api_base_url() -> str:
    """Resolve the backend API base URL from env vars or Streamlit secrets."""
    secret_config = getattr(st, "secrets", {}) or {}
    raw_url = os.getenv("API_BASE_URL") or secret_config.get("API_BASE_URL") or "http://localhost:8000"
    return raw_url.rstrip("/")


API_BASE_URL = _get_api_base_url()


def build_api_url(endpoint: str, base_url: Optional[str] = None) -> str:
    """Construct a full API URL for the given endpoint."""
    clean_endpoint = endpoint.lstrip("/")
    # urljoin requires a trailing slash to avoid replacing the entire path.
    target_base = (base_url or API_BASE_URL).rstrip("/")
    base = target_base if target_base.endswith("/") else f"{target_base}/"
    return urljoin(base, clean_endpoint)


class ApiClient:
    """Simple HTTP client for communicating with the backend API."""

    def __init__(self, base_url: str) -> None:
        self.base_url = base_url

    def _handle_response(self, response: requests.Response) -> Any:
        try:
            response.raise_for_status()
        except requests.HTTPError as exc:  # pragma: no cover - simple error mapping
            try:
                detail = response.json().get("detail")
            except Exception:  # noqa: BLE001 - fallback when response is not JSON
                detail = response.text
            raise RuntimeError(detail or str(exc)) from exc
        if response.headers.get("content-type", "").startswith("application/json"):
            return response.json()
        return response.content

    def get(self, endpoint: str, *, stream: bool = False) -> Any:
        response = requests.get(
            build_api_url(endpoint, base_url=self.base_url),
            timeout=60,
            stream=stream,
        )
        return self._handle_response(response)

    def post(self, endpoint: str, *, json: Optional[Dict[str, Any]] = None, files: Optional[Dict[str, Any]] = None, data: Optional[Dict[str, Any]] = None) -> Any:
        response = requests.post(
            build_api_url(endpoint, base_url=self.base_url),
            timeout=120,
            json=json,
            files=files,
            data=data,
        )
        return self._handle_response(response)

    def delete(self, endpoint: str) -> Any:
        response = requests.delete(
            build_api_url(endpoint, base_url=self.base_url),
            timeout=60,
        )
        return self._handle_response(response)


client = ApiClient(API_BASE_URL)


def _trigger_full_refresh() -> None:
    refresh_deals_cache()
    st.experimental_rerun()


@st.cache_data(show_spinner=False)
def load_deals(version: int) -> List[Dict[str, Any]]:
    """Fetch all startup analyses."""
    return client.get("deals")


def refresh_deals_cache() -> None:
    load_deals.clear()
    st.session_state["deals_version"] = st.session_state.get("deals_version", 0) + 1


def fetch_deal(startup_id: str) -> Dict[str, Any]:
    """Fetch a single startup analysis."""
    return client.get(f"deals/{startup_id}")


def _format_datetime(value: Optional[str]) -> str:
    if not value:
        return "-"
    try:
        dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
        return dt.strftime("%b %d, %Y %I:%M %p")
    except ValueError:
        return value


def _render_metadata(metadata: Dict[str, Any]) -> None:
    cols = st.columns(4)
    cols[0].metric("Status", metadata.get("status", "-"))
    cols[1].metric("Created", _format_datetime(metadata.get("created_at")))
    cols[2].metric("Processed", _format_datetime(metadata.get("processed_at")))
    cols[3].metric("Sector", metadata.get("sector", "-"))

    founders = metadata.get("founder_names") or []
    if founders:
        st.markdown("### Founders")
        st.write(", ".join(founders))


def _render_company_overview(memo: Dict[str, Any]) -> None:
    overview = memo.get("company_overview", {})
    st.subheader("Company Overview")
    st.markdown(f"**Name:** {overview.get('name', '-')}")
    st.markdown(f"**Sector:** {overview.get('sector', '-')}")

    founders = overview.get("founders") or []
    if founders:
        st.markdown("#### Founding Team")
        for founder in founders:
            st.markdown(
                f"- **{founder.get('name', 'Unknown')}**\n"
                f"  - Education: {founder.get('education') or 'N/A'}\n"
                f"  - Background: {founder.get('professional_background') or 'N/A'}\n"
                f"  - Previous Ventures: {founder.get('previous_ventures') or 'N/A'}"
            )

    technology = overview.get("technology")
    if technology:
        st.markdown("#### Technology")
        st.write(technology)


def _render_market_analysis(memo: Dict[str, Any]) -> None:
    market = memo.get("market_analysis", {})
    st.subheader("Market Analysis")

    industry = market.get("industry_size_and_growth", {})
    if industry:
        st.markdown("#### Industry Size & Growth")
        tam = industry.get("total_addressable_market", {})
        som = industry.get("serviceable_obtainable_market", {})
        tam_val = tam.get("value")
        som_val = som.get("value")
        st.write(f"Total Addressable Market: {tam_val or 'N/A'}")
        st.write(f"Serviceable Obtainable Market: {som_val or 'N/A'}")
        st.write(industry.get("commentary", ""))

    competitors = market.get("competitor_details") or []
    if competitors:
        st.markdown("#### Competitor Landscape")
        for competitor in competitors:
            st.markdown(
                f"- **{competitor.get('name', '-')}:** {competitor.get('commentary', '')}\n"
                f"  - Category: {competitor.get('category', 'N/A')}\n"
                f"  - Business Model: {competitor.get('business_model', 'N/A')}\n"
                f"  - Funding: {competitor.get('funding', 'N/A')}\n"
                f"  - Margins: {competitor.get('margins', 'N/A')}"
            )

    opportunities = market.get("sub_segment_opportunities") or []
    if opportunities:
        st.markdown("#### Sub-Segment Opportunities")
        st.write("\n".join(f"- {item}" for item in opportunities))

    recent_news = market.get("recent_news")
    if recent_news:
        st.markdown("#### Recent News")
        st.write(recent_news)


def _render_business_model(memo: Dict[str, Any]) -> None:
    model = memo.get("business_model", {})
    st.subheader("Business Model")
    st.write(model.get("revenue_streams", "No revenue streams available."))

    pricing = model.get("pricing")
    if pricing:
        st.markdown("#### Pricing")
        st.write(pricing)

    scalability = model.get("scalability")
    if scalability:
        st.markdown("#### Scalability")
        st.write(scalability)

    unit_economics = model.get("unit_economics", {})
    if unit_economics:
        st.markdown("#### Unit Economics")
        st.write(f"LTV: {unit_economics.get('customer_lifetime_value_ltv', 'N/A')}")
        st.write(f"CAC: {unit_economics.get('customer_acquisition_cost_cac', 'N/A')}")


def _render_financials(memo: Dict[str, Any]) -> None:
    financials = memo.get("financials", {})
    st.subheader("Financials")
    st.write(financials.get("funding_history", "No funding history available."))

    projections = financials.get("projections") or []
    if projections:
        st.markdown("#### Projections")
        for projection in projections:
            st.write(f"- {projection.get('year', 'N/A')}: {projection.get('revenue', 'N/A')}")

    valuation = financials.get("valuation_rationale")
    if valuation:
        st.markdown("#### Valuation Rationale")
        st.write(valuation)

    srr = financials.get("srr_mrr", {})
    if srr:
        st.markdown("#### Revenue Metrics")
        st.write(f"Booked ARR: {srr.get('current_booked_arr', 'N/A')}")
        st.write(f"Current MRR: {srr.get('current_mrr', 'N/A')}")

    burn = financials.get("burn_and_runway", {})
    if burn:
        st.markdown("#### Burn & Runway")
        st.write(f"Funding Ask: {burn.get('funding_ask', 'N/A')}")
        st.write(f"Stated Runway: {burn.get('stated_runway', 'N/A')}")
        st.write(f"Implied Net Burn: {burn.get('implied_net_burn', 'N/A')}")


def _render_risk_analysis(memo: Dict[str, Any]) -> None:
    risk = memo.get("risk_metrics", {})
    conclusion = memo.get("conclusion", {})
    st.subheader("Risk & Recommendation")
    st.metric("Composite Risk Score", risk.get("composite_risk_score", "N/A"))
    st.write(risk.get("narrative_justification", ""))
    st.write(risk.get("score_interpretation", ""))

    attractiveness = conclusion.get("overall_attractiveness")
    if attractiveness:
        st.markdown("#### Overall Recommendation")
        st.write(attractiveness)


def _render_claims_analysis(memo: Dict[str, Any]) -> None:
    claims = memo.get("claims_analysis") or []
    if not claims:
        st.info("No claims analysis available.")
        return

    for idx, claim in enumerate(claims, start=1):
        with st.expander(f"Claim {idx}: {claim.get('claim', 'Untitled Claim')}", expanded=False):
            st.write(f"Result: {claim.get('result', 'N/A')}")
            st.write(f"Probability: {claim.get('simulated_probability', 'N/A')}")
            st.write(f"Analysis Method: {claim.get('analysis_method', 'N/A')}")
            assumptions = claim.get("simulation_assumptions") or {}
            if assumptions:
                st.markdown("**Assumptions**")
                for key, value in assumptions.items():
                    st.write(f"- {key.replace('_', ' ').title()}: {value}")


def _render_source_downloads(startup_id: str, analysis_data: Dict[str, Any]) -> None:
    st.subheader("Source Files")
    raw_files = analysis_data.get("raw_files") or {}

    download_links: List[str] = []
    if raw_files.get("pitch_deck_url"):
        download_links.append(f"- [Pitch Deck]({raw_files['pitch_deck_url']})")
    else:
        download_links.append(f"- [Pitch Deck API]({build_api_url(f'download_pitch_deck/{startup_id}')})")

    # Provide fallback API links for optional sources.
    optional_sources = [
        ("Video Pitch", "download_video_pitch"),
        ("Audio Pitch", "download_audio_pitch"),
        ("Text Notes", "download_text_notes"),
    ]
    for label, endpoint in optional_sources:
        download_links.append(f"- [{label}]({build_api_url(f'{endpoint}/{startup_id}')})")

    memo_docx = analysis_data.get("memo", {}).get("docx_url")
    if memo_docx:
        download_links.append(f"- [Investment Memo]({memo_docx})")

    st.markdown("\n".join(download_links), unsafe_allow_html=True)


def _handle_delete(startup_id: str) -> None:
    try:
        client.delete(f"deals/{startup_id}")
    except Exception as exc:  # noqa: BLE001 - surfacing API error to the user
        st.error(f"Failed to delete analysis: {exc}")
        return
    st.success("Analysis deleted successfully.")
    refresh_deals_cache()
    st.experimental_rerun()


def _handle_generate(startup_id: str, payload: Dict[str, int]) -> Optional[Dict[str, Any]]:
    try:
        result = client.post(f"generate_memo/{startup_id}", json={
            "team_strength": payload["team_strength"],
            "market_opportunity": payload["market_opportunity"],
            "traction": payload["traction"],
            "claim_credibility": payload["claim_credibility"],
            "financial_health": payload["financial_health"],
        })
    except Exception as exc:  # noqa: BLE001
        st.error(f"Failed to generate summary: {exc}")
        return None

    deal_id = result.get("deal_id") if isinstance(result, dict) else startup_id
    st.success("Summary regenerated with custom weightings.")
    refresh_deals_cache()
    try:
        return fetch_deal(deal_id or startup_id)
    except Exception:  # noqa: BLE001 - fallback to previous data if fetch fails
        return None


def _handle_upload(form_values: Dict[str, Any]) -> None:
    pitch: Optional[Any] = form_values.get("pitch_deck")
    video: Optional[Any] = form_values.get("video_pitch")
    audio: Optional[Any] = form_values.get("audio_pitch")
    notes: str = form_values.get("additional_info", "")

    if not any([pitch, video, audio, notes.strip()]):
        st.warning("Please provide at least one input before uploading.")
        return

    files: Dict[str, Any] = {}
    if pitch:
        files["pitch_deck"] = (pitch.name, pitch.getvalue(), pitch.type or "application/octet-stream")
    if video:
        files["video_pitch"] = (video.name, video.getvalue(), video.type or "application/octet-stream")
    if audio:
        files["audio_pitch"] = (audio.name, audio.getvalue(), audio.type or "application/octet-stream")

    data: Dict[str, Any] = {}
    if notes.strip():
        data["additional_information"] = notes.strip()

    with st.spinner("Uploading documents and starting analysis..."):
        try:
            client.post("upload", files=files or None, data=data or None)
        except Exception as exc:  # noqa: BLE001
            st.error(f"Upload failed: {exc}")
            return

    st.success("Upload complete. Analysis will begin shortly.")
    refresh_deals_cache()
    st.experimental_rerun()


def render_dashboard() -> None:
    st.title("Investor Dashboard")
    st.caption("Review and manage AI-generated startup analyses.")

    with st.expander("Create New Analysis", expanded=False):
        with st.form("upload_form"):
            pitch_deck = st.file_uploader("Pitch Deck", type=["pdf", "ppt", "pptx"], key="pitch_deck")
            video_pitch = st.file_uploader("Video Pitch", type=["mp4", "mov"], key="video_pitch")
            audio_pitch = st.file_uploader("Audio Pitch", type=["mp3", "wav"], key="audio_pitch")
            additional_info = st.text_area("Additional Notes", help="Provide any extra context for the analysis.")
            submitted = st.form_submit_button("Upload Data", type="primary")
            if submitted:
                _handle_upload(
                    {
                        "pitch_deck": pitch_deck,
                        "video_pitch": video_pitch,
                        "audio_pitch": audio_pitch,
                        "additional_info": additional_info,
                    }
                )

    version = st.session_state.get("deals_version", 0)
    try:
        with st.spinner("Loading analyses..."):
            deals = load_deals(version)
    except Exception as exc:  # noqa: BLE001
        st.error(f"Unable to load startup analyses: {exc}")
        deals = []

    st.button("Refresh", on_click=_trigger_full_refresh, key="refresh_button")

    if not deals:
        st.info("No startup analyses available yet. Upload documents to generate insights.")
        return

    header_cols = st.columns([3, 1, 2, 2])
    header_cols[0].markdown("**Startup**")
    header_cols[1].markdown("**Safety Score**")
    header_cols[2].markdown("**Recommendation**")
    header_cols[3].markdown("**Actions**")

    for startup in deals:
        metadata = startup.get("metadata", {})
        memo = (startup.get("memo") or {}).get("draft_v1")
        with st.container():
            cols = st.columns([3, 1, 2, 2])
            company_name = metadata.get("company_name", "Unknown Company")
            cols[0].markdown(f"**{company_name}**\n\n{metadata.get('sector', 'Unknown Sector')}")
            cols[1].markdown(str((memo or {}).get("risk_metrics", {}).get("composite_risk_score", "N/A")))
            cols[2].write((memo or {}).get("conclusion", {}).get("overall_attractiveness", "N/A"))

            action_column = cols[3]
            detail_key = f"details_{startup.get('deal_id')}"
            if action_column.button("View Details", key=detail_key):
                st.session_state["view"] = "detail"
                st.session_state["selected_deal"] = startup.get("deal_id")
                st.experimental_rerun()

            if memo:
                download_url = build_api_url(f"download_memo/{startup.get('deal_id')}")
                action_column.markdown(f"[Download Memo]({download_url})", unsafe_allow_html=True)
            else:
                action_column.markdown("_Memo not available yet_")

            delete_key = f"delete_{startup.get('deal_id')}"
            if action_column.button("Delete", key=delete_key):
                _handle_delete(startup.get("deal_id"))


def render_detail_view(startup_id: str) -> None:
    if st.button("← Back to Dashboard", key="back_button"):
        st.session_state["view"] = "dashboard"
        st.session_state.pop("selected_deal", None)
        st.experimental_rerun()

    try:
        with st.spinner("Loading analysis..."):
            analysis_data = fetch_deal(startup_id)
    except Exception as exc:  # noqa: BLE001
        st.error(f"Failed to load analysis: {exc}")
        return

    metadata = analysis_data.get("metadata", {})
    st.title(metadata.get("company_name", "Startup Analysis"))
    st.caption(f"Deal ID: {analysis_data.get('deal_id', startup_id)}")

    _render_metadata(metadata)

    memo = (analysis_data.get("memo") or {}).get("draft_v1")
    if not memo:
        st.info("Analysis data is not yet available. Please check back later.")
        return

    with st.expander("Customize Investment Memo", expanded=False):
        with st.form("weight_form"):
            default_weight = metadata.get("weightage") or {}
            team_strength = st.slider("Team Strength", 0, 40, int(default_weight.get("team_strength", 20)))
            market_opportunity = st.slider("Market Opportunity", 0, 40, int(default_weight.get("market_opportunity", 20)))
            traction = st.slider("Traction", 0, 40, int(default_weight.get("traction", 20)))
            claim_credibility = st.slider("Claim Credibility", 0, 40, int(default_weight.get("claim_credibility", 25)))
            financial_health = st.slider("Financial Health", 0, 40, int(default_weight.get("financial_health", 15)))
            submitted = st.form_submit_button("Generate Summary", type="primary")
            if submitted:
                updated = _handle_generate(
                    startup_id,
                    {
                        "team_strength": team_strength,
                        "market_opportunity": market_opportunity,
                        "traction": traction,
                        "claim_credibility": claim_credibility,
                        "financial_health": financial_health,
                    },
                )
                if updated:
                    analysis_data = updated
                    metadata = analysis_data.get("metadata", metadata)
                    memo = (analysis_data.get("memo") or {}).get("draft_v1")
                    st.experimental_rerun()

    tabs = st.tabs([
        "Company Overview",
        "Market",
        "Business Model",
        "Financials",
        "Risk",
        "Claims",
        "Sources",
    ])

    with tabs[0]:
        _render_company_overview(memo)
    with tabs[1]:
        _render_market_analysis(memo)
    with tabs[2]:
        _render_business_model(memo)
    with tabs[3]:
        _render_financials(memo)
    with tabs[4]:
        _render_risk_analysis(memo)
    with tabs[5]:
        _render_claims_analysis(memo)
    with tabs[6]:
        _render_source_downloads(startup_id, analysis_data)


def main() -> None:
    if "deals_version" not in st.session_state:
        st.session_state["deals_version"] = 0
    if "view" not in st.session_state:
        st.session_state["view"] = "dashboard"

    view = st.session_state.get("view", "dashboard")
    if view == "detail" and st.session_state.get("selected_deal"):
        render_detail_view(st.session_state["selected_deal"])
    else:
        st.session_state["view"] = "dashboard"
        render_dashboard()


if __name__ == "__main__":
    main()
