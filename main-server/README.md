## deepedit main server

### install (python 3.11)
1. `git clone https://github.com/deep-edit/main-server-deepedit.git`
2. `cd main-server-deepedit`
3. `py -3.11 -m venv venv`
4. `.\venv\Scripts\activate` (windows) \
    `source venv/bin/activate` (mac or linux)
5. `pip install -r requirements.txt`

### start
`uvicorn app.app:app --reload --log-config=log/conf.ini` or \
`py start.py`

### before pushing to github, run `before_git_push.py`