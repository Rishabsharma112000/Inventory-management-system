from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.database import engine, Base
from app.config.settings import get_settings
from app.routers import (
    auth,
    categories,
    suppliers,
    products,
    customers,
    inventory,
    orders,
    dashboard,
    alerts,
    reports
)

# Create all tables
Base.metadata.create_all(bind=engine)

settings = get_settings()

app = FastAPI(
    title="IMS Backend API",
    version="1.0.0",
    description="Inventory Management System API"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(suppliers.router)
app.include_router(products.router)
app.include_router(customers.router)
app.include_router(orders.router)
app.include_router(dashboard.router)
app.include_router(inventory.router)
app.include_router(alerts.router)
app.include_router(reports.router)


@app.get("/")
async def root():
    return {"message": "IMS Backend is running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)
