from fastapi import FastAPI, Request, status, Response
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException

from app.backend.models import Settings
from app.router import router

from log.log import requestLog, errorLog
request_log = requestLog()
error_log = errorLog()

app = FastAPI(docs_url=None, redoc_url=None)
app.mount("/static", StaticFiles(directory="app/static"), name="static")
app.include_router(router)

@AuthJWT.load_config
def get_config():
    return Settings()

# @app.middleware("https")
# async def log_request(request: Request, call_next):
#     request_log.info(f'{request.client.host} {request.method} {"/"+str(request.url).split(str(request.base_url))[1]}')
#     try:
#         return await call_next(request)
#     except Exception as e:
#         request_log.error(f'ERROR {request.client.host} {request.method} {"/"+str(request.url).split(str(request.base_url))[1]}')
#         error_log.error(e)
#         return Response("Internal server error", status_code=500)

@app.middleware("https")
async def log_request(request: Request, call_next):
    request_log.info(f'{request.client.host} {request.method} {"/"+str(request.url).split(str(request.base_url))[1]}')
    return await call_next(request)


@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException):
    if exc.message == 'Missing cookie access_token_cookie':
        return RedirectResponse('/login', status.HTTP_303_SEE_OTHER)
    elif exc.message == 'Signature verification failed':
        return RedirectResponse('/login', status.HTTP_303_SEE_OTHER)
    elif 'refresh' in str(request.url) and exc.message == 'Signature has expired':
        return RedirectResponse('/login', status.HTTP_303_SEE_OTHER)
    return JSONResponse(
        status_code=exc.status_code,
        content={"msg": exc.message}
    )