from pydantic import BaseModel
from app.config import access_expired, refresh_expired, secret

class LoginUser(BaseModel):
    login:    str
    password: str

class SignupUser(LoginUser):
    name:     str 

class Settings(BaseModel):
    authjwt_secret_key: str           = secret
    authjwt_token_location: set       = {"cookies"}
    authjwt_cookie_csrf_protect: bool = False
    authjwt_access_token_expires      = access_expired
    authjwt_refresh_token_expires     = refresh_expired

class RoopRequest():
    base = 'http://127.0.0.1:8090'
    make = '/task/make'
    get = '/task/get'
    compile = '/task/complite'
    info = '/task/get-info'
    id = '/task/id'