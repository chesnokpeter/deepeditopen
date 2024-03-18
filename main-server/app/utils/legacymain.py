from fastapi import FastAPI, Depends, Request, status, UploadFile, Form, File
from fastapi.responses import JSONResponse, RedirectResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException

from pathlib import Path
import uvicorn
import requests
import logging

import app.database as database
import app.backend.emailer as emailer
from app.backend.models import LoginUser, SignupUser, RoopRequest, Settings

import clear_results
clear_results.start()

# logger = logging.getLogger(__name__)
# logging.basicConfig(filename='log/app.log', encoding='utf-8', level=logging.INFO)
# logger.info('staaaart')

app = FastAPI(docs_url=None, redoc_url=None)
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

@AuthJWT.load_config
def get_config():
    return Settings()

@app.middleware("https")
async def log_request(request: Request, call_next):
    # Запись информации о запросе в журнал
    print(f"Received request: {request.method} {request.url}")

    # Продолжение обработки запроса
    response = await call_next(request)

    return response

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



@app.get('/favicon.ico', include_in_schema=False)
async def favicon():
    return FileResponse('app/static/favicon.ico')

@app.get('/')
def root():
    return RedirectResponse('/home')

@app.get('/soon')
def soon(request: Request):
    return templates.TemplateResponse('soon.html', {"request": request})

@app.get('/signup')
def signuppage(request: Request):
    return templates.TemplateResponse('signup.html', {"request": request})

@app.post('/api/signup')
def signup(user: SignupUser, Authorize: AuthJWT = Depends()):
    json = database.signup_user(user)
    if json['msg'] == 'success' and json['id']:
        access_token = Authorize.create_access_token(subject=json['id'])
        refresh_token = Authorize.create_refresh_token(subject=json['id'])
        Authorize.set_access_cookies(access_token)
        Authorize.set_refresh_cookies(refresh_token)
        email = emailer.Email(to=json['to'])
        email.send(email.render(name=json['name'], key=json['confirm']))
    return json

@app.get('/login')
def loginpage(request: Request):
    return templates.TemplateResponse('login.html', {"request": request})

@app.post('/api/login')
def login(user: LoginUser, Authorize: AuthJWT = Depends()):
    json = database.login_user(user)
    if json['msg'] == 'success' and json['id']:
        access_token = Authorize.create_access_token(subject=json['id'])
        refresh_token = Authorize.create_refresh_token(subject=json['id'])
        Authorize.set_access_cookies(access_token)
        Authorize.set_refresh_cookies(refresh_token)
    return json

@app.post('/api/logout')
def logout(Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    access_jti = Authorize.get_jti(Authorize._token)
    Authorize.jwt_refresh_token_required()
    refresh_jti = Authorize.get_jti(Authorize._token)
    database.add_rewoke(access_jti=access_jti, refresh_jti=refresh_jti)
    Authorize.unset_jwt_cookies()
    return {'msg':"success"}

@app.post('/api/refresh')
def refresh(Authorize: AuthJWT = Depends()):
    Authorize.jwt_refresh_token_required()
    current_user = Authorize.get_jwt_subject()
    new_access_token = Authorize.create_access_token(subject=current_user)
    Authorize.set_access_cookies(new_access_token)
    return {'msg':"success"}

@app.get('/home')
def homepage(request: Request, Authorize: AuthJWT = Depends()):
    return templates.TemplateResponse('home.html', {"request": request})

@app.get('/lk')
def homepage(request: Request, Authorize: AuthJWT = Depends()):
    return templates.TemplateResponse('lk.html', {"request": request})

@app.post('/api/user')
def user(Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    subject = int(Authorize.get_jwt_subject())
    access_jti = Authorize.get_jti(Authorize._token)
    Authorize.jwt_refresh_token_required()
    refresh_jti = Authorize.get_jti(Authorize._token)
    if database.check_rewoke(access_jti=access_jti, refresh_jti=refresh_jti):
        return RedirectResponse('/login', status.HTTP_303_SEE_OTHER)
    if database.check_confirm(subject):
        return RedirectResponse('/login', status.HTTP_303_SEE_OTHER)
    user = database.user_by_id(subject)
    if not user:
        return RedirectResponse('/login', status.HTTP_303_SEE_OTHER)
    return {"msg":"success", "name":user.username, "tariff":user.tariff}

@app.get('/confirm')
def confirm(key:str):
    database.confirm(key)
    return RedirectResponse('/home')




@app.post('/api/create')
async def create(source: UploadFile = File(title='source'), target: UploadFile = File(title='target'), sfiletype: str = Form(title='sfiletype'), tfiletype: str = Form(title='tfiletype')):
    source_contents = await source.read()
    target_contents = await target.read()

    r = requests.request('POST', RoopRequest.base+RoopRequest.id)
    r = r.json()
    task = r['task']
    print(task)

    data = {
        'source':source_contents,
        'target':target_contents,
        'task':task,
        'sfiletype':sfiletype,
        'tfiletype':tfiletype,
    }
    files = {
        'source':source_contents,
        'target':target_contents
    }
    r = requests.request('POST', RoopRequest.base+RoopRequest.make, data=data, files=files)
    r = r.json()
    print(r)
    if r['message'] == 'query added':
        return r
    elif r['message'] == 'another task has already been started':
        return {"message": "another task has already been started"}

    return {"msg":"error"}


@app.get('/api/complite')
async def complite(task: int):
    r = requests.request('POST', RoopRequest.base+RoopRequest.compile+f'?task={task}')
    r = r.json()
    return r


@app.get('/api/get')
async def get(task: int):
    r = requests.request('POST', RoopRequest.base+RoopRequest.info+f'?task={task}')
    r = r.json()
    r = r['tfiletype']
    if r == 'none':
        return {"msg":"error"}

    a = requests.request('POST', RoopRequest.base+RoopRequest.get+f'?task={task}')
    a = a.content

    folder_path = Path("results")

    if not folder_path.exists():
        folder_path.mkdir()

    with open(f"results/r{task}.{r}", "wb") as f2:
        f2.write(a)
        f2.close()

    return FileResponse(f"results/r{task}.{r}")

# if __name__ == "__main__":
#     uvicorn.run(app, port=8080, host='0.0.0.0', log_config='log/log_conf.yaml')