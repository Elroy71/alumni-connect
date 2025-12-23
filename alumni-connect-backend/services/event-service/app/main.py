from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
from app.graphql.resolvers import schema
from app.auth.jwt import get_user_from_token
from app.database.connection import engine, Base
import os
from dotenv import load_dotenv

load_dotenv()

# Create tables
try:
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully")
except Exception as e:
    print(f"❌ Database error: {e}")

# Initialize FastAPI
app = FastAPI(
    title="Event Service",
    description="Event Management Microservice with GraphQL",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom context getter for GraphQL
# Custom context getter for GraphQL
async def get_context(request: Request):
    """Add user to context from JWT token"""
    # Get authorization from headers (try both cases)
    authorization = (
        request.headers.get("authorization") or 
        request.headers.get("Authorization") or 
        ""
    )
    
    print(f"\n📨 ===== PYTHON SERVICE REQUEST =====")
    print(f"Headers received: {list(request.headers.keys())}")
    print(f"Authorization header: {'✅ Present' if authorization else '❌ MISSING'}")
    
    if authorization:
        print(f"Authorization preview: {authorization[:30]}...")
    
    # Extract user from token
    user = get_user_from_token(authorization)
    
    if user:
        print(f"✅ User authenticated: {user.get('email')} (ID: {user.get('userId')})")
    else:
        print(f"❌ Authentication FAILED")
    
    print(f"===== END PYTHON SERVICE REQUEST =====\n")
    
    # Attach user to request state
    request.state.user = user
    
    return {
        "request": request,
        "user": user
    }

# GraphQL Router
graphql_app = GraphQLRouter(
    schema,
    context_getter=get_context,
    graphiql=True  # Enable GraphiQL interface
)

app.include_router(graphql_app, prefix="/graphql")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "event-service",
        "version": "1.0.0"
    }

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Event Service API",
        "graphql": "/graphql",
        "health": "/health",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("SERVICE_PORT", 4002))
    print(f"\n🚀 Starting Event Service on port {port}...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)