import sqlalchemy as db
from sqlalchemy import MetaData, Table, Integer, String, Column, DateTime, ForeignKey, Numeric, insert, select
from sqlalchemy.orm import declarative_base, Session

from typing import Callable

import app.backend.tools as tools
from app.config import db_connect

engine = db.create_engine(db_connect, pool_pre_ping=True)
conn = engine.connect()
session = Session(engine)

Base = declarative_base()

class USER(Base):
    __tablename__ = 'user'
    id = Column(Integer, unique=True, primary_key=True, nullable=False)
    username = Column(String(), nullable=False)
    login = Column(String(), nullable=False, unique=True)
    passhash = Column(String(), nullable=False)
    confirm = Column(String(), nullable=False)    
    tariff = Column(String(), nullable=False, default='free')
    typelimit = Column(String(), nullable=False)
    numlimit = Column(String(), nullable=False)

class REWOKE(Base):
    __tablename__ = 'rewoke'
    id = Column(Integer, unique=True, primary_key=True, nullable=False)
    access = Column(String(), nullable=False)
    refresh = Column(String(), nullable=False)

Base.metadata.create_all(engine)

def signup_user(user: Callable):
    user.login = str.lower(user.login)
    if not tools.check_email(user.login):
        return {"msg":"mail not exist",
                "ru":"Такая почта не существует"}
    if get_login(user.login):
        return {"msg":"login already exists",
                "ru":"Такая почта уже зарегестрирована"}
    confirm = tools.confirm_url()
    session.add(USER(
        username=user.name,
        login=user.login,
        passhash=tools.passhash(user.password),
        confirm=confirm,
        typelimit='pic',
        numlimit='1'
    ))
    session.commit()
    return {"msg":"success", "id":get_id(user.login), "name":user.name, "confirm":confirm, "to":user.login}

def login_user(user: Callable):
    user.login = str.lower(user.login)
    if session.query(USER).filter_by(login = user.login, passhash = tools.passhash(user.password)).all():
        return {"msg":"success", "id":get_id(user.login)}
    return {'msg':'login or password is incorrect', "ru":"Логин или пароль неверны"}

def get_login(login: str):
    return session.query(USER).filter_by(login = login).all()

def get_id(login: str):
    return session.query(USER).filter_by(login = login).one_or_none().id if session.query(USER).filter_by(login = login).one_or_none() else None

def user_by_id(id: int):
    return session.query(USER).filter_by(id = id).one_or_none() if session.query(USER).filter_by(id = id).one_or_none() else None

def add_rewoke(access_jti: str, refresh_jti: str):
    session.add(REWOKE(
        access=access_jti,
        refresh=refresh_jti
    ))
    session.commit()

def check_rewoke(access_jti: str, refresh_jti: str):
    return session.query(REWOKE).filter_by(access = access_jti, refresh = refresh_jti).all()

def check_confirm(id:str):
    return session.query(USER).filter_by(id = id).one_or_none().confirm

def confirm(key:str):
    session.query(USER).filter_by(confirm = key).one_or_none().confirm = ''
    session.commit()