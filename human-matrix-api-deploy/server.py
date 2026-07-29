from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()

# Create router with /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ========================== MODELS ==========================

# Auth Models
class User(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    has_purchased_pack: bool = False
    pack_start_date: Optional[datetime] = None
    current_day: int = 0

class SessionData(BaseModel):
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Diagnostic Models
class DiagnosticQuestion(BaseModel):
    id: int
    pole: str  # Djism, Aql, Nafs, Qalb
    question_fr: str
    
class DiagnosticAnswer(BaseModel):
    question_id: int
    score: int  # 1-10

class DiagnosticSubmission(BaseModel):
    answers: List[DiagnosticAnswer]

class DiagnosticResult(BaseModel):
    diagnostic_id: str = Field(default_factory=lambda: f"diag_{uuid.uuid4().hex[:12]}")
    user_id: Optional[str] = None
    session_id: Optional[str] = None  # For anonymous users
    djism_score: float
    aql_score: float
    nafs_score: float
    qalb_score: float
    is_initial: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    unstable_poles: List[str] = []

# Payment Models
class PaymentTransaction(BaseModel):
    transaction_id: str = Field(default_factory=lambda: f"tx_{uuid.uuid4().hex[:12]}")
    user_id: Optional[str] = None
    session_id: str
    amount: float
    currency: str
    status: str  # initiated, pending, paid, failed, expired
    payment_status: str
    metadata: Dict[str, str] = {}
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CreateCheckoutRequest(BaseModel):
    origin_url: str
    diagnostic_session_id: Optional[str] = None

# Mission Models
class Mission(BaseModel):
    mission_id: str = Field(default_factory=lambda: f"mission_{uuid.uuid4().hex[:8]}")
    pole: str
    title: str
    description: str
    duration_minutes: int = 15
    completed: bool = False

class DailyMissions(BaseModel):
    day: int
    missions: List[Mission]
    briefing_completed: bool = False
    all_completed: bool = False

class DailyProgress(BaseModel):
    progress_id: str = Field(default_factory=lambda: f"prog_{uuid.uuid4().hex[:12]}")
    user_id: str
    day: int
    briefing_listened: bool = False
    briefing_duration: int = 0  # seconds listened
    missions_completed: List[str] = []  # mission_ids
    sos_used: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ========================== DIAGNOSTIC QUESTIONS ==========================

DIAGNOSTIC_QUESTIONS: List[Dict] = [
    # Djism (Corps) - 4 questions
    {"id": 1, "pole": "Djism", "question_fr": "Je me réveille chaque matin avec une énergie suffisante pour affronter la journée."},
    {"id": 2, "pole": "Djism", "question_fr": "Mon sommeil est réparateur et je m'endors facilement."},
    {"id": 3, "pole": "Djism", "question_fr": "Je suis capable de maintenir un effort physique sans m'épuiser rapidement."},
    {"id": 4, "pole": "Djism", "question_fr": "Je prends soin de mon corps (alimentation, exercice, repos)."},
    
    # 'Aql (Esprit) - 4 questions
    {"id": 5, "pole": "Aql", "question_fr": "Je peux me concentrer longtemps sans être distrait."},
    {"id": 6, "pole": "Aql", "question_fr": "Je prends des décisions rapidement et sans douter excessivement."},
    {"id": 7, "pole": "Aql", "question_fr": "Je contrôle mes pensées et j'évite les ruminations négatives."},
    {"id": 8, "pole": "Aql", "question_fr": "J'apprends facilement de nouvelles choses et je retiens bien l'information."},
    
    # Nafs (Âme/Ego) - 4 questions
    {"id": 9, "pole": "Nafs", "question_fr": "Je résiste facilement aux tentations qui me nuisent (écrans, malbouffe, procrastination...)."},
    {"id": 10, "pole": "Nafs", "question_fr": "Je suis capable de reconnaître mes erreurs sans que mon ego me bloque."},
    {"id": 11, "pole": "Nafs", "question_fr": "Je peux attendre pour obtenir une récompense plutôt que céder à la gratification immédiate."},
    {"id": 12, "pole": "Nafs", "question_fr": "Je maîtrise ma colère et mes émotions négatives."},
    
    # Qalb (Cœur) - 3 questions
    {"id": 13, "pole": "Qalb", "question_fr": "Je ressens régulièrement une paix intérieure et une sérénité."},
    {"id": 14, "pole": "Qalb", "question_fr": "Je me sens connecté à quelque chose de plus grand que moi (spiritualité, valeurs, mission)."},
    {"id": 15, "pole": "Qalb", "question_fr": "Je connais ma direction de vie et ce qui donne du sens à mes actions."},
]

# ========================== AUTH HELPERS ==========================

async def get_current_user(request: Request, authorization: Optional[str] = Header(None)) -> Optional[User]:
    """Get current user from session token (cookie or header)"""
    session_token = request.cookies.get("session_token")
    
    if not session_token and authorization:
        if authorization.startswith("Bearer "):
            session_token = authorization[7:]
    
    if not session_token:
        return None
    
    session_doc = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
    if not session_doc:
        return None
    
    expires_at = session_doc.get("expires_at")
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    
    if expires_at < datetime.now(timezone.utc):
        return None
    
    user_doc = await db.users.find_one({"user_id": session_doc["user_id"]}, {"_id": 0})
    if not user_doc:
        return None
    
    return User(**user_doc)

async def require_user(request: Request, authorization: Optional[str] = Header(None)) -> User:
    """Require authenticated user"""
    user = await get_current_user(request, authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Non authentifié")
    return user

async def require_pack_user(request: Request, authorization: Optional[str] = Header(None)) -> User:
    """Require user with purchased pack"""
    user = await require_user(request, authorization)
    if not user.has_purchased_pack:
        raise HTTPException(status_code=403, detail="Pack 7 jours requis")
    return user

# ========================== AUTH ROUTES ==========================

@api_router.post("/auth/session")
async def exchange_session(request: Request, response: Response):
    """Exchange session_id for session_token"""
    body = await request.json()
    session_id = body.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id requis")
    
    # Call Emergent Auth
    async with httpx.AsyncClient() as client:
        auth_response = await client.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
        
        if auth_response.status_code != 200:
            raise HTTPException(status_code=401, detail="Session invalide")
        
        auth_data = auth_response.json()
    
    email = auth_data.get("email")
    name = auth_data.get("name")
    picture = auth_data.get("picture")
    session_token = auth_data.get("session_token")
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": email}, {"_id": 0})
    
    if existing_user:
        user_id = existing_user["user_id"]
        # Update user info
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"name": name, "picture": picture}}
        )
    else:
        # Create new user
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        new_user = {
            "user_id": user_id,
            "email": email,
            "name": name,
            "picture": picture,
            "created_at": datetime.now(timezone.utc),
            "has_purchased_pack": False,
            "pack_start_date": None,
            "current_day": 0
        }
        await db.users.insert_one(new_user)
    
    # Store session
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    session_doc = {
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": expires_at,
        "created_at": datetime.now(timezone.utc)
    }
    
    # Remove old sessions for this user
    await db.user_sessions.delete_many({"user_id": user_id})
    await db.user_sessions.insert_one(session_doc)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
    
    user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    return user_doc

@api_router.get("/auth/me")
async def get_me(user: User = Depends(require_user)):
    """Get current user info"""
    return user.model_dump()

@api_router.post("/auth/reviewer")
async def reviewer_login(response: Response, code: str = ""):
    """Special login for Google Play reviewers"""
    # Secret code for Google Play review team
    REVIEWER_CODE = "MENTALNATION2024REVIEW"
    
    if code != REVIEWER_CODE:
        raise HTTPException(status_code=401, detail="Code invalide")
    
    # Get or create reviewer account
    reviewer_email = "googleplay.review@mentalnation.com"
    user = await db.users.find_one({"email": reviewer_email})
    
    if not user:
        # Create reviewer account with full access
        user = {
            "user_id": "reviewer_google_play",
            "email": reviewer_email,
            "name": "Google Play Reviewer",
            "picture": None,
            "created_at": datetime.now(timezone.utc),
            "has_purchased_pack": True,
            "pack_start_date": datetime.now(timezone.utc),
            "current_day": 1
        }
        await db.users.insert_one(user)
    
    # Create session
    session_token = str(uuid.uuid4())
    session_data = {
        "user_id": user["user_id"],
        "session_token": session_token,
        "expires_at": datetime.now(timezone.utc) + timedelta(days=30)
    }
    await db.user_sessions.insert_one(session_data)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=30 * 24 * 60 * 60
    )
    
    return {
        "message": "Connecté en tant que reviewer",
        "user_id": user["user_id"],
        "email": reviewer_email,
        "has_purchased_pack": True
    }

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """Logout user"""
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_many({"session_token": session_token})
    
    response.delete_cookie("session_token", path="/")
    return {"message": "Déconnecté"}

# ========================== ACCOUNT MANAGEMENT ==========================

class DeleteAccountRequest(BaseModel):
    email: str

@api_router.post("/account/delete-request")
async def request_account_deletion(request_data: DeleteAccountRequest):
    """Request account deletion - GDPR compliance"""
    email = request_data.email.lower().strip()
    
    # Find user by email
    user = await db.users.find_one({"email": email})
    
    if user:
        # Mark account for deletion (30 days delay as per GDPR)
        await db.users.update_one(
            {"email": email},
            {"$set": {
                "deletion_requested": True,
                "deletion_requested_at": datetime.now(timezone.utc),
                "deletion_scheduled_for": datetime.now(timezone.utc) + timedelta(days=30)
            }}
        )
        
        # Log the deletion request
        deletion_log = {
            "user_id": user["user_id"],
            "email": email,
            "requested_at": datetime.now(timezone.utc),
            "scheduled_for": datetime.now(timezone.utc) + timedelta(days=30),
            "status": "pending"
        }
        await db.deletion_requests.insert_one(deletion_log)
        
        # Delete sessions immediately
        await db.user_sessions.delete_many({"user_id": user["user_id"]})
    
    # Always return success (don't reveal if account exists or not)
    return {
        "message": "Demande de suppression enregistrée",
        "scheduled_for": "30 jours"
    }

# ========================== DIAGNOSTIC ROUTES ==========================

@api_router.get("/diagnostic/questions")
async def get_diagnostic_questions():
    """Get all diagnostic questions"""
    return {"questions": DIAGNOSTIC_QUESTIONS}

@api_router.post("/diagnostic/submit")
async def submit_diagnostic(
    submission: DiagnosticSubmission,
    request: Request,
    authorization: Optional[str] = Header(None)
):
    """Submit diagnostic answers and get results"""
    user = await get_current_user(request, authorization)
    
    # Calculate scores per pole
    pole_scores = {"Djism": [], "Aql": [], "Nafs": [], "Qalb": []}
    
    for answer in submission.answers:
        question = next((q for q in DIAGNOSTIC_QUESTIONS if q["id"] == answer.question_id), None)
        if question:
            pole_scores[question["pole"]].append(answer.score * 10)  # Convert to 0-100
    
    # Calculate averages
    djism_score = sum(pole_scores["Djism"]) / len(pole_scores["Djism"]) if pole_scores["Djism"] else 0
    aql_score = sum(pole_scores["Aql"]) / len(pole_scores["Aql"]) if pole_scores["Aql"] else 0
    nafs_score = sum(pole_scores["Nafs"]) / len(pole_scores["Nafs"]) if pole_scores["Nafs"] else 0
    qalb_score = sum(pole_scores["Qalb"]) / len(pole_scores["Qalb"]) if pole_scores["Qalb"] else 0
    
    # Identify unstable poles
    unstable_poles = []
    if djism_score < 50:
        unstable_poles.append("Djism")
    if aql_score < 50:
        unstable_poles.append("Aql")
    if nafs_score < 50:
        unstable_poles.append("Nafs")
    if qalb_score < 50:
        unstable_poles.append("Qalb")
    
    # Determine if this is initial diagnostic
    is_initial = True
    if user:
        existing = await db.diagnostics.find_one({"user_id": user.user_id, "is_initial": True})
        if existing:
            is_initial = False
    
    # Create diagnostic result
    result = DiagnosticResult(
        user_id=user.user_id if user else None,
        session_id=f"anon_{uuid.uuid4().hex[:12]}" if not user else None,
        djism_score=djism_score,
        aql_score=aql_score,
        nafs_score=nafs_score,
        qalb_score=qalb_score,
        is_initial=is_initial,
        unstable_poles=unstable_poles
    )
    
    await db.diagnostics.insert_one(result.model_dump())
    
    return result.model_dump()

@api_router.get("/diagnostic/latest")
async def get_latest_diagnostic(user: User = Depends(require_user)):
    """Get user's latest diagnostic"""
    diagnostic = await db.diagnostics.find_one(
        {"user_id": user.user_id},
        {"_id": 0},
        sort=[("created_at", -1)]
    )
    return diagnostic

@api_router.get("/diagnostic/initial")
async def get_initial_diagnostic(user: User = Depends(require_user)):
    """Get user's initial diagnostic"""
    diagnostic = await db.diagnostics.find_one(
        {"user_id": user.user_id, "is_initial": True},
        {"_id": 0}
    )
    return diagnostic

# ========================== PAYMENT ROUTES ==========================

@api_router.post("/payment/checkout")
async def create_checkout(
    checkout_request: CreateCheckoutRequest,
    request: Request,
    authorization: Optional[str] = Header(None)
):
    """Create Stripe checkout session for Pack 7 Jours"""
    from emergentintegrations.payments.stripe.checkout import (
        StripeCheckout, CheckoutSessionRequest
    )
    
    user = await get_current_user(request, authorization)
    
    # Fixed price - 17€
    amount = 17.00
    currency = "eur"
    
    # Build URLs
    origin = checkout_request.origin_url
    success_url = f"{origin}/offer/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/offer"
    
    # Initialize Stripe
    stripe_api_key = os.environ.get("STRIPE_API_KEY")
    host_url = str(request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
    
    metadata = {
        "product": "pack_7_jours",
        "user_id": user.user_id if user else "anonymous",
        "diagnostic_session_id": checkout_request.diagnostic_session_id or ""
    }
    
    checkout_req = CheckoutSessionRequest(
        amount=amount,
        currency=currency,
        success_url=success_url,
        cancel_url=cancel_url,
        metadata=metadata
    )
    
    session = await stripe_checkout.create_checkout_session(checkout_req)
    
    # Create payment transaction record
    transaction = PaymentTransaction(
        user_id=user.user_id if user else None,
        session_id=session.session_id,
        amount=amount,
        currency=currency,
        status="initiated",
        payment_status="pending",
        metadata=metadata
    )
    
    await db.payment_transactions.insert_one(transaction.model_dump())
    
    return {"url": session.url, "session_id": session.session_id}

@api_router.get("/payment/status/{session_id}")
async def get_payment_status(
    session_id: str,
    request: Request,
    response: Response,
    authorization: Optional[str] = Header(None)
):
    """Check payment status and update user if paid"""
    from emergentintegrations.payments.stripe.checkout import StripeCheckout
    import stripe
    
    stripe_api_key = os.environ.get("STRIPE_API_KEY")
    host_url = str(request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
    
    status = await stripe_checkout.get_checkout_status(session_id)
    
    # Update transaction
    await db.payment_transactions.update_one(
        {"session_id": session_id},
        {"$set": {"status": status.status, "payment_status": status.payment_status}}
    )
    
    user_created = False
    user_email = None
    
    # If paid, create user account or update existing
    if status.payment_status == "paid":
        transaction = await db.payment_transactions.find_one({"session_id": session_id})
        if transaction:
            user_id = transaction.get("metadata", {}).get("user_id")
            
            # Get customer email from Stripe session
            try:
                stripe.api_key = stripe_api_key
                stripe_session = stripe.checkout.Session.retrieve(session_id)
                customer_email = stripe_session.customer_details.email if stripe_session.customer_details else None
                user_email = customer_email
            except Exception as e:
                logger.error(f"Error getting Stripe session: {e}")
                customer_email = None
            
            if user_id and user_id != "anonymous":
                # User was logged in - update their account
                user = await db.users.find_one({"user_id": user_id})
                if user and not user.get("has_purchased_pack"):
                    await db.users.update_one(
                        {"user_id": user_id},
                        {"$set": {
                            "has_purchased_pack": True,
                            "pack_start_date": datetime.now(timezone.utc),
                            "current_day": 1
                        }}
                    )
                    await generate_daily_missions(user_id, 1)
            elif customer_email:
                # Anonymous user - create account with Stripe email
                existing_user = await db.users.find_one({"email": customer_email})
                
                if existing_user:
                    # User exists with this email - update their account
                    if not existing_user.get("has_purchased_pack"):
                        await db.users.update_one(
                            {"email": customer_email},
                            {"$set": {
                                "has_purchased_pack": True,
                                "pack_start_date": datetime.now(timezone.utc),
                                "current_day": 1
                            }}
                        )
                        await generate_daily_missions(existing_user["user_id"], 1)
                    user_id = existing_user["user_id"]
                else:
                    # Create new user with Stripe email
                    new_user_id = f"stripe_{uuid.uuid4().hex[:12]}"
                    new_user = User(
                        user_id=new_user_id,
                        email=customer_email,
                        name=customer_email.split("@")[0],  # Use email prefix as name
                        has_purchased_pack=True,
                        pack_start_date=datetime.now(timezone.utc),
                        current_day=1
                    )
                    await db.users.insert_one(new_user.model_dump())
                    await generate_daily_missions(new_user_id, 1)
                    user_id = new_user_id
                    user_created = True
                
                # Update transaction with user_id
                await db.payment_transactions.update_one(
                    {"session_id": session_id},
                    {"$set": {"user_id": user_id}}
                )
                
                # Create session for the user
                session_token = str(uuid.uuid4())
                session_data = SessionData(
                    user_id=user_id,
                    session_token=session_token,
                    expires_at=datetime.now(timezone.utc) + timedelta(days=30)
                )
                await db.sessions.insert_one(session_data.model_dump())
                
                # Set session cookie
                response.set_cookie(
                    key="session_token",
                    value=session_token,
                    httponly=True,
                    secure=True,
                    samesite="none",
                    max_age=30 * 24 * 60 * 60  # 30 days
                )
    
    return {
        "status": status.status,
        "payment_status": status.payment_status,
        "amount_total": status.amount_total,
        "currency": status.currency,
        "user_created": user_created,
        "user_email": user_email
    }

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    from emergentintegrations.payments.stripe.checkout import StripeCheckout
    
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    stripe_api_key = os.environ.get("STRIPE_API_KEY")
    host_url = str(request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        if webhook_response.payment_status == "paid":
            user_id = webhook_response.metadata.get("user_id")
            if user_id and user_id != "anonymous":
                user = await db.users.find_one({"user_id": user_id})
                if user and not user.get("has_purchased_pack"):
                    await db.users.update_one(
                        {"user_id": user_id},
                        {"$set": {
                            "has_purchased_pack": True,
                            "pack_start_date": datetime.now(timezone.utc),
                            "current_day": 1
                        }}
                    )
                    await generate_daily_missions(user_id, 1)
        
        return {"status": "ok"}
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return {"status": "error", "message": str(e)}

# ========================== MISSIONS & PROTOCOL ==========================

async def generate_daily_missions(user_id: str, day: int):
    """Generate AI-powered missions for a specific day"""
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    
    api_key = os.environ.get("EMERGENT_LLM_KEY")
    
    chat = LlmChat(
        api_key=api_key,
        session_id=f"missions_{user_id}_{day}",
        system_message="""Tu es le Stratège de la Sentinelle, un coach mental d'élite. 
Tu génères des missions quotidiennes ultra-concrètes et non-négociables pour les 4 pôles:
- Djism (Corps): Actions physiques, sommeil, nutrition
- 'Aql (Esprit): Concentration, décision, apprentissage  
- Nafs (Âme/Ego): Discipline, maîtrise de soi, résistance aux tentations
- Qalb (Cœur): Paix intérieure, connexion spirituelle, sens de la vie

Chaque mission doit être:
- Courte (une phrase)
- Actionnable immédiatement
- Mesurable
- Réalisable en 15-30 minutes max

Réponds UNIQUEMENT en JSON valide avec ce format:
{
  "missions": [
    {"pole": "Djism", "title": "Titre court", "description": "Description actionnable", "duration_minutes": 15},
    {"pole": "Aql", "title": "...", "description": "...", "duration_minutes": 15},
    {"pole": "Nafs", "title": "...", "description": "...", "duration_minutes": 15},
    {"pole": "Qalb", "title": "...", "description": "...", "duration_minutes": 15}
  ]
}"""
    ).with_model("openai", "gpt-4.1")
    
    prompt = f"""Génère les 4 missions du Jour {day} du Protocole de Restauration 7 Jours.
    
Contexte du jour {day}:
- Jour 1-2: Fondations - établir les bases
- Jour 3-4: Intensification - augmenter l'effort
- Jour 5-6: Consolidation - renforcer les acquis
- Jour 7: Intégration - préparer l'autonomie

Génère des missions adaptées à ce stade du protocole."""

    try:
        response = await chat.send_message(UserMessage(text=prompt))
        
        # Parse JSON response
        import json
        # Clean response - remove markdown code blocks if present
        clean_response = response.strip()
        if clean_response.startswith("```"):
            clean_response = clean_response.split("```")[1]
            if clean_response.startswith("json"):
                clean_response = clean_response[4:]
        clean_response = clean_response.strip()
        
        missions_data = json.loads(clean_response)
        
        # Store missions
        missions_doc = {
            "user_id": user_id,
            "day": day,
            "missions": [
                {
                    "mission_id": f"mission_{uuid.uuid4().hex[:8]}",
                    "pole": m["pole"],
                    "title": m["title"],
                    "description": m["description"],
                    "duration_minutes": m.get("duration_minutes", 15),
                    "completed": False
                }
                for m in missions_data["missions"]
            ],
            "briefing_completed": False,
            "all_completed": False,
            "created_at": datetime.now(timezone.utc)
        }
        
        await db.daily_missions.insert_one(missions_doc)
        return missions_doc
        
    except Exception as e:
        logger.error(f"Error generating missions: {e}")
        # Fallback missions
        fallback_missions = {
            "user_id": user_id,
            "day": day,
            "missions": [
                {"mission_id": f"mission_{uuid.uuid4().hex[:8]}", "pole": "Djism", "title": "Marche consciente", "description": "Marche 20 minutes dehors sans téléphone. Respire profondément.", "duration_minutes": 20, "completed": False},
                {"mission_id": f"mission_{uuid.uuid4().hex[:8]}", "pole": "Aql", "title": "Focus sans distraction", "description": "Travaille 25 minutes sur ta tâche prioritaire. Pas de notifications.", "duration_minutes": 25, "completed": False},
                {"mission_id": f"mission_{uuid.uuid4().hex[:8]}", "pole": "Nafs", "title": "Résiste à une tentation", "description": "Identifie une tentation récurrente et résiste-y consciemment aujourd'hui.", "duration_minutes": 15, "completed": False},
                {"mission_id": f"mission_{uuid.uuid4().hex[:8]}", "pole": "Qalb", "title": "Moment de gratitude", "description": "Écris 3 choses pour lesquelles tu es reconnaissant. Ressens-les vraiment.", "duration_minutes": 10, "completed": False}
            ],
            "briefing_completed": False,
            "all_completed": False,
            "created_at": datetime.now(timezone.utc)
        }
        await db.daily_missions.insert_one(fallback_missions)
        return fallback_missions

@api_router.get("/protocol/status")
async def get_protocol_status(user: User = Depends(require_pack_user)):
    """Get user's current protocol status"""
    # Calculate current day based on pack_start_date
    if user.pack_start_date:
        start_date = user.pack_start_date
        if isinstance(start_date, str):
            start_date = datetime.fromisoformat(start_date)
        if start_date.tzinfo is None:
            start_date = start_date.replace(tzinfo=timezone.utc)
        
        days_elapsed = (datetime.now(timezone.utc) - start_date).days + 1
        current_day = min(days_elapsed, 7)
    else:
        current_day = 1
    
    # Update user's current day
    await db.users.update_one({"user_id": user.user_id}, {"$set": {"current_day": current_day}})
    
    # Get today's missions
    missions_doc = await db.daily_missions.find_one(
        {"user_id": user.user_id, "day": current_day},
        {"_id": 0}
    )
    
    # Generate if not exists
    if not missions_doc:
        missions_doc = await generate_daily_missions(user.user_id, current_day)
        del missions_doc["_id"]
    
    # Get progress
    progress = await db.daily_progress.find_one(
        {"user_id": user.user_id, "day": current_day},
        {"_id": 0}
    )
    
    return {
        "current_day": current_day,
        "pack_start_date": user.pack_start_date.isoformat() if user.pack_start_date else None,
        "missions": missions_doc,
        "progress": progress
    }

@api_router.post("/protocol/briefing/complete")
async def complete_briefing(
    request: Request,
    user: User = Depends(require_pack_user)
):
    """Mark daily briefing as completed"""
    body = await request.json()
    day = body.get("day", user.current_day or 1)
    duration = body.get("duration", 0)
    
    # Update or create progress
    await db.daily_progress.update_one(
        {"user_id": user.user_id, "day": day},
        {
            "$set": {
                "briefing_listened": True,
                "briefing_duration": duration,
                "updated_at": datetime.now(timezone.utc)
            },
            "$setOnInsert": {
                "progress_id": f"prog_{uuid.uuid4().hex[:12]}",
                "user_id": user.user_id,
                "day": day,
                "missions_completed": [],
                "sos_used": 0,
                "created_at": datetime.now(timezone.utc)
            }
        },
        upsert=True
    )
    
    # Update missions doc
    await db.daily_missions.update_one(
        {"user_id": user.user_id, "day": day},
        {"$set": {"briefing_completed": True}}
    )
    
    return {"success": True, "message": "Briefing complété"}

@api_router.post("/protocol/mission/complete")
async def complete_mission(
    request: Request,
    user: User = Depends(require_pack_user)
):
    """Mark a mission as completed"""
    body = await request.json()
    mission_id = body.get("mission_id")
    day = body.get("day", user.current_day or 1)
    
    if not mission_id:
        raise HTTPException(status_code=400, detail="mission_id requis")
    
    # Update mission status
    await db.daily_missions.update_one(
        {"user_id": user.user_id, "day": day, "missions.mission_id": mission_id},
        {"$set": {"missions.$.completed": True}}
    )
    
    # Update progress
    await db.daily_progress.update_one(
        {"user_id": user.user_id, "day": day},
        {
            "$addToSet": {"missions_completed": mission_id},
            "$set": {"updated_at": datetime.now(timezone.utc)},
            "$setOnInsert": {
                "progress_id": f"prog_{uuid.uuid4().hex[:12]}",
                "user_id": user.user_id,
                "day": day,
                "briefing_listened": False,
                "briefing_duration": 0,
                "sos_used": 0,
                "created_at": datetime.now(timezone.utc)
            }
        },
        upsert=True
    )
    
    # Check if all missions completed
    missions_doc = await db.daily_missions.find_one({"user_id": user.user_id, "day": day})
    if missions_doc:
        all_completed = all(m["completed"] for m in missions_doc.get("missions", []))
        if all_completed:
            await db.daily_missions.update_one(
                {"user_id": user.user_id, "day": day},
                {"$set": {"all_completed": True}}
            )
    
    return {"success": True, "message": "Mission complétée"}

@api_router.post("/protocol/sos")
async def use_sos(user: User = Depends(require_pack_user)):
    """Record SOS usage"""
    day = user.current_day or 1
    
    await db.daily_progress.update_one(
        {"user_id": user.user_id, "day": day},
        {
            "$inc": {"sos_used": 1},
            "$set": {"updated_at": datetime.now(timezone.utc)},
            "$setOnInsert": {
                "progress_id": f"prog_{uuid.uuid4().hex[:12]}",
                "user_id": user.user_id,
                "day": day,
                "briefing_listened": False,
                "briefing_duration": 0,
                "missions_completed": [],
                "created_at": datetime.now(timezone.utc)
            }
        },
        upsert=True
    )
    
    return {"success": True, "message": "SOS enregistré"}

@api_router.get("/protocol/report")
async def get_final_report(user: User = Depends(require_pack_user)):
    """Get final comparison report (Day 7)"""
    # Get initial diagnostic
    initial = await db.diagnostics.find_one(
        {"user_id": user.user_id, "is_initial": True},
        {"_id": 0}
    )
    
    # Get latest diagnostic
    latest = await db.diagnostics.find_one(
        {"user_id": user.user_id, "is_initial": False},
        {"_id": 0},
        sort=[("created_at", -1)]
    )
    
    # Get all progress
    progress_list = await db.daily_progress.find(
        {"user_id": user.user_id},
        {"_id": 0}
    ).to_list(10)
    
    # Calculate stats
    total_missions = 0
    completed_missions = 0
    total_sos = 0
    
    for p in progress_list:
        completed_missions += len(p.get("missions_completed", []))
        total_sos += p.get("sos_used", 0)
    
    total_missions = 7 * 4  # 7 days * 4 missions
    
    return {
        "initial_diagnostic": initial,
        "final_diagnostic": latest,
        "stats": {
            "total_missions": total_missions,
            "completed_missions": completed_missions,
            "completion_rate": round((completed_missions / total_missions) * 100, 1) if total_missions > 0 else 0,
            "sos_used": total_sos
        }
    }

# ========================== AUDIO PROXY ==========================

# Google Drive audio files mapping
BRIEFING_AUDIO_IDS = {
    1: "1PAE4l2EbOR3R4qXOJc77BMFmlfi10SB6",
    2: "1pZ6D4N7HymSyOP79As68_e3YksKO6Ka1",
    3: "1roKE7vhMFK5rg1EAYD08Ub5xGLAXRDrs",
    4: "1MeTG1IQxQnZFoM7V3_Jy10MuJju5naLB",
    5: "1XwGkxlR7UNFVFSssxmDrPY2vEFs6pouF",
    6: "1Lj8IsbjD0z-ReBWqGhsZw3A3hCiVvmYn",
    7: "1vuH6Y5c1eceXLhSdeHdFJEvcZQAVI9a1",
}

@api_router.get("/audio/briefing/{day}")
async def get_briefing_audio(day: int):
    """Proxy endpoint to serve Google Drive audio files"""
    from fastapi.responses import StreamingResponse
    
    if day not in BRIEFING_AUDIO_IDS:
        raise HTTPException(status_code=404, detail="Audio non trouvé")
    
    file_id = BRIEFING_AUDIO_IDS[day]
    google_url = f"https://drive.google.com/uc?export=download&id={file_id}"
    
    async def stream_audio():
        async with httpx.AsyncClient(follow_redirects=True, timeout=60.0) as client:
            async with client.stream("GET", google_url) as response:
                async for chunk in response.aiter_bytes(chunk_size=8192):
                    yield chunk
    
    return StreamingResponse(
        stream_audio(),
        media_type="audio/mpeg",
        headers={
            "Accept-Ranges": "bytes",
            "Cache-Control": "public, max-age=86400"
        }
    )

# ========================== BASE ROUTES ==========================

@api_router.get("/")
async def root():
    return {"message": "Mental Nation API", "version": "1.0"}

@api_router.get("/health")
async def health():
    return {"status": "healthy"}

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
