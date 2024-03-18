from datetime import timedelta
from fastapi.templating import Jinja2Templates

secret = ''

access_expired = timedelta(minutes=15)
refresh_expired = timedelta(days=7)

dadata_token = ''
dadata_secret = ''

db_connect = ''

templates = Jinja2Templates(directory="app/templates")

class EmailConf:
    addr = ''
    passwrd = ''
    host = ''
    port = 465 