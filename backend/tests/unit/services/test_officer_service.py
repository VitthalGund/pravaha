import pytest
from app.services.officer_service import rank_portfolio

def test_visit_ranking_sorts_by_priority_score():
    enterprises = [
        {"id": "A", "severity": "low", "days_since_visit": 5, "trend": "stable"},
        {"id": "B", "severity": "high", "days_since_visit": 14, "trend": "deteriorating"},
    ]
    ranked = rank_portfolio(enterprises)
    assert ranked[0]["id"] == "B"  # High severity + 14 days + deteriorating ranks #1
