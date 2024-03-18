## main server
### install (python 3.11)
1. `git clone https://github.com/deep-edit/main-server-deepedit.git`
2. `cd main-server-deepedit`
3. `py -3.11 -m venv venv`
4. `.\venv\Scripts\activate` (windows) \
    `source venv/bin/activate` (mac or linux)
5. `pip install -r requirements.txt`

### start
`cd main-server`
`uvicorn app.app:app --reload --log-config=log/conf.ini` or \
`py start.py`


## deepfake server 
## install
1. `git clone ` 
2. `cd `
3. Download roop https://boosty.to/neurogen/posts/83be1b4a-0cf5-4ff5-92f6-34e9c20e0e48?share=post_link and put roop in the root of the repository its contents \
It should go like this:
```    
Catalog: C:\roop_deep\roop

Name

CodeFormer
ffmpeg
gfpgan
models
pip
python
roop
tasks
tmp
trtcache
venv
whl
.gitignore
clear.py
config.json
README.md
requirements.txt
requirements_dml.txt
requirements_legacy.txt
run.py
start.bat
start_portable_amd.bat
start_portable_cpu.bat
start_portable_nvidia.bat
transactions.db
webroop.py
```

### start
to start, run `start.bat` in `/deepfake-server/`