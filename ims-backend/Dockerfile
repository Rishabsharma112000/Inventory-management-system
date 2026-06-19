# Use lightweight Python base image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

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
EXPOSE 5000

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]
