import os,hmac,threading
from fastapi import FastAPI,HTTPException,Header
from pydantic import BaseModel,Field
from engine import Engine
secret=os.environ.get('WMED_OPENMED_TOKEN','')
if len(secret)<32: raise RuntimeError('Set a private service token of at least 32 characters')
engine=Engine(os.environ['WMED_OPENMED_MODEL_DIR']);lock=threading.Lock()
app=FastAPI(docs_url=None,redoc_url=None,openapi_url=None)
class Request(BaseModel):
 text:str=Field(min_length=3,max_length=6000)
@app.post('/review')
def review(body:Request,authorization:str=Header(default='')):
 if not hmac.compare_digest(authorization,'Bearer '+secret): raise HTTPException(401,'Unauthorized')
 if not lock.acquire(blocking=False): raise HTTPException(429,'Busy')
 try:return engine.review(body.text)
 except Exception:raise HTTPException(503,'Review unavailable') from None
 finally:lock.release()
