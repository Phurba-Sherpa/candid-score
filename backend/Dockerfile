# syntax=docker/dockerfile:1.7

FROM python:3.14-slim AS builder

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /usr/local/bin/

WORKDIR /app

COPY pyproject.toml uv.lock README.md ./

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-install-project --no-dev

# Copy application source
COPY alembic.ini ./alembic.ini
COPY migrations ./migrations
COPY app ./app
COPY main.py ./main.py

# Install the project itself
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev


FROM builder AS development
RUN apt-get update && \
    apt-get install -y --no-install-recommends git && \
    rm -rf /var/lib/apt/lists/*
CMD ["uv", "run", "fastapi", "dev", "main.py", "--host", "0.0.0.0", "--reload"]


FROM python:3.14-slim AS production
WORKDIR /app
ENV PATH="/app/.venv/bin:$PATH"
COPY --from=builder /app /app
RUN adduser --disabled-password --gecos "" appuser && chown -R appuser:appuser /app
USER appuser
EXPOSE 8000
CMD ["fastapi", "run", "main.py", "--host", "0.0.0.0", "--port", "8000"]
