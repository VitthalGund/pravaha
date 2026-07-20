# Account Aggregator (AA) & Unified Lending Interface (ULI) Integration Design

## Overview
This document specifies the consent-based data pull architecture matching RBI's Account Aggregator (AA) framework and Unified Lending Interface (ULI) pattern for Pravaha.

## Architecture

```mermaid
sequenceDiagram
    autonumber
    actor User as Enterprise Owner
    participant Mobile as Pravaha Mobile App
    participant Backend as Pravaha Backend
    participant AA as RBI Account Aggregator
    participant Bank as Priority Sector Bank (FIP)

    User->>Mobile: Tap "Link Bank Account via AA"
    Mobile->>Backend: POST /aa/consent/request
    Backend->>AA: Create Consent Handle (FI Types: DEPOSIT, KCC)
    AA-->>Backend: Return Consent Redirect URL
    Backend-->>Mobile: Present RBI AA Consent View
    User->>AA: Authenticate & Authorize Data Sharing
    AA->>Backend: Consent Notification (Consent ID)
    Backend->>AA: Request Financial Data Pull (FIFetch)
    AA->>Bank: Fetch Encrypted Statement Data
    Bank-->>AA: Return Encrypted Data
    AA-->>Backend: Deliver Encrypted FI Data
    Backend->>Backend: Decrypt & Parse into Cash Flow Entries
```

## Data Provider Interface Contract

```python
from abc import ABC, abstractmethod

class AADataProvider(ABC):
    @abstractmethod
    async def request_consent(self, user_id: str, fi_types: list[str]) -> str:
        """Returns consent handle URL"""
        pass

    @abstractmethod
    async def fetch_financial_data(self, consent_id: str) -> list[dict]:
        """Returns normalized cash flow entries"""
        pass
```

## Implementation Roadmap
- **Phase 1 (Current)**: Mock e-Shakti provider (`ESHAKTI-*` reference IDs)
- **Phase 2 (Pilot Readiness)**: Sandbox integration with Setu / Sahamati AA gateway
- **Phase 3 (Production)**: Live ULI API integration for instant priority sector credit underwriting
