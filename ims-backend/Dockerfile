# Use lightweight Python base image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Set default PORT environment variable
ENV PORT=5000

# Install system dependencies for psycopg2
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE $PORT

# Run the application - use shell form to access environment variable
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-5000}
