import hashlib as hl
from dadata import Dadata
import random, string

from app.config import dadata_token, dadata_secret
from log.log import errorLog

dadata = Dadata(dadata_token, dadata_secret)

def passhash(str: str) -> str:
    return hl.sha512(str.encode()).hexdigest()

def check_email(str: str) -> str:
    try:
        result = dadata.clean("email", str)
        return True if result['qc'] == 0 else False
    except Exception as e:
        error_log = errorLog()
        error_log.error(e)
        return True

def confirm_url() -> str:
    return ''.join(random.choices(string.ascii_letters + string.digits, k=10))