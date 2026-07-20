import os

def test_routes_have_no_business_logic():
    """api/v1/routes/ files must not import from app.db or app.ml."""
    routes_dir = "backend/app/api/v1/routes"
    for fname in os.listdir(routes_dir):
        if not fname.endswith(".py") or fname == "__init__.py":
            continue
        with open(os.path.join(routes_dir, fname), "r", encoding="utf-8") as f:
            content = f.read()
        assert "from app.db" not in content, f"{fname} imports from app.db — business logic in route!"
        assert "from app.ml" not in content, f"{fname} imports from app.ml — business logic in route!"

def test_services_have_no_http_imports():
    """services/ files must not import fastapi or httpx."""
    services_dir = "backend/app/services"
    if not os.path.exists(services_dir):
        return
    for fname in os.listdir(services_dir):
        if not fname.endswith(".py") or fname == "__init__.py":
            continue
        with open(os.path.join(services_dir, fname), "r", encoding="utf-8") as f:
            content = f.read()
        assert "from fastapi" not in content, f"{fname} imports fastapi — HTTP in service layer!"
        assert "import httpx" not in content, f"{fname} imports httpx — HTTP in service layer!"

def test_ml_no_db_http_imports():
    """ml/ files must not import from api, services, ai, or db."""
    ml_dir = "backend/app/ml"
    if not os.path.exists(ml_dir):
        return
    for root, dirs, files in os.walk(ml_dir):
        for fname in files:
            if not fname.endswith(".py") or fname == "__init__.py":
                continue
            with open(os.path.join(root, fname), "r", encoding="utf-8") as f:
                content = f.read()
            for forbidden in ["from app.api", "from app.services", "from app.ai", "from app.db", "import fastapi", "import httpx", "import motor"]:
                assert forbidden not in content, f"{fname} has forbidden import: {forbidden}"
