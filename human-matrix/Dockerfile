FROM python:3.12-slim

WORKDIR /app

# Copy requirements first for caching
COPY backend/requirements.txt backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy all source code
COPY backend/ backend/
COPY emergentintegrations/ emergentintegrations/
COPY render.yaml .
COPY .gitignore .

EXPOSE 8000

CMD uvicorn backend.server:app --host 0.0.0.0 --port $PORT
