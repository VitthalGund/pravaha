import os
import ast
import pytest

def test_rbac_coverage_on_routes():
    routes_dir = os.path.join(os.path.dirname(__file__), "..", "..", "app", "api", "v1", "routes")
    routes_dir = os.path.abspath(routes_dir)
    
    assert os.path.exists(routes_dir), f"Routes directory not found: {routes_dir}"
    
    for fname in os.listdir(routes_dir):
        if fname.endswith(".py") and not fname.startswith("__"):
            filepath = os.path.join(routes_dir, fname)
            with open(filepath, "r", encoding="utf-8") as f:
                tree = ast.parse(f.read(), filename=fname)
                
            for node in ast.walk(tree):
                if isinstance(node, ast.AsyncFunctionDef) or isinstance(node, ast.FunctionDef):
                    # Check if function is decorated with router
                    is_route = any(
                        isinstance(d, ast.Call) and getattr(d.func, "attr", None) in ("get", "post", "put", "delete", "patch")
                        for d in node.decorator_list
                    )
                    if is_route:
                        # Ensure function arguments or dependencies include require_role or get_current_user
                        arg_names = [a.arg for a in node.args.args]
                        assert "user" in arg_names or "current_user" in arg_names or "requesting_user" in arg_names or node.name == "health_check", (
                            f"Route {node.name} in {fname} missing security user dependency"
                        )
