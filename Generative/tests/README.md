# Testing Folder

This folder contains comprehensive tests for the Generative AI Career Guidance platform.

## Structure

```
tests/
├── conftest.py              # Global test configuration and fixtures
├── unit/                    # Unit tests for individual components
│   ├── test_services/       # Service layer tests
│   └── test_routes/         # Route/endpoint tests
├── integration/             # Integration tests for full workflows
│   ├── test_api_integration.py
│   ├── test_auth_flow.py
│   └── test_ai_service_integration.py
└── frontend/                # Frontend component tests
    ├── test_components/
    └── test_pages/
```

## Running Tests

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Run All Tests
```bash
pytest
```

### Run Specific Test Categories
```bash
# Unit tests only
pytest tests/unit/ -m unit

# Integration tests only
pytest tests/integration/ -m integration

# Frontend tests only
pytest tests/frontend/ -m frontend

# Run with coverage report
pytest --cov=. --cov-report=html
```

### Run Tests by Markers
```bash
# Authentication tests
pytest -m auth

# AI service tests
pytest -m ai_service

# Slow tests (integration tests)
pytest -m slow
```

## Test Categories

1. **Unit Tests**: Test individual functions, classes, and methods in isolation
2. **Integration Tests**: Test API endpoints and full user workflows
3. **Frontend Tests**: Test React components and user interactions

## Coverage Requirements

- Minimum 80% code coverage required
- Coverage report generated in `tests/coverage_html/`

## Writing Tests

### Unit Tests
- Test individual functions/methods in isolation
- Use mocks for external dependencies
- Focus on edge cases and error handling

### Integration Tests
- Test complete user workflows
- Use real API calls (with test data)
- Verify data persistence and state changes

### Frontend Tests
- Test component rendering and user interactions
- Mock API calls
- Test responsive behavior and accessibility