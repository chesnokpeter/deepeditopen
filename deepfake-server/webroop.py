from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import FileResponse, HTMLResponse
from roop import core
import uvicorn, multiprocessing, os, sqlite3
from pathlib import Path
import json

conn = sqlite3.connect('transactions.db')
cur = conn.cursor()

print('start')

class worker():
    def __init__(self):
        self.proc =  None
        self.queue = []

    def start(self, tfiletype, sfiletype):
        if self.proc == None or not self.proc.is_alive():
            if self.queue != []:
                self.proc = multiprocessing.Process(target=extra_run, args=(self.queue[0], tfiletype, sfiletype))
                self.proc.start()

roop = worker()
app = FastAPI()

with open('config.json', 'r') as f:
    data = json.loads(f.read())
rootPath = data["roop_path"]

def extra_run(task: int, tfiletype: str, sfiletype: str) -> None:
    
    global rootPath
    if tfiletype == 'png' or tfiletype == 'jpg' or tfiletype == 'jpeg':
        rootPath =''
    core.parse_args()
    core.roop.globals.source_path = f"{rootPath}tasks/task{task}/source.{sfiletype}"
    core.roop.globals.target_path = f"{rootPath}tasks/task{task}/target.{tfiletype}"
    core.roop.globals.max_memory = data['max_memory']
    core.roop.globals.keep_fps = data['keep_fps']
    core.roop.globals.execution_threads = data['execution_threads']
    core.roop.globals.frame_processors = data['frame_processors']
    core.roop.globals.output_path = core.normalize_output_path(core.roop.globals.source_path, core.roop.globals.target_path, f"{rootPath}tasks/task{task}/output.{tfiletype}")
    core.roop.globals.headless = core.roop.globals.source_path is not None and core.roop.globals.target_path is not None and core.roop.globals.output_path is not None    
    if not core.pre_check():
        return
    for core.frame_processor in core.get_frame_processors_modules(core.roop.globals.frame_processors):
        if not core.frame_processor.pre_check():
            return
    core.limit_resources()
    core.start()



@app.get("/")
def read_root():
    return {"message": "not found"}

@app.post("/task/id")
async def get_id_task():
    status = cur.execute("SELECT * FROM Tasks ORDER BY task DESC LIMIT 1").fetchone()
    print(status)
    if not status:
        status = [1]
    else: status = [status[0] + 1]
    return {"message": "last id task:", 'task':status[0]}

# @app.get("/task/make")
# async def make_tast_get():
#     return HTMLResponse("""
#     <form action="/task/make" method="post" enctype="multipart/form-data">
#         <input type="file" name="source" id="" multiple>
#         <input type="file" name="target" id="" multiple>
#         <input type="text" name="task" placeholder="task id:int">
#         <input type="text" name="sfiletype" placeholder="source ft:str">
#         <input type="text" name="tfiletype" placeholder="target ft:str">
#         <input type="submit" name="" id="">
#     </form>""")



@app.post("/task/make")
async def make_task(source: UploadFile = File(title='source'), target: UploadFile = File(title='target'), task: int = Form(title='task'), sfiletype: str = Form(title='sfiletype'), tfiletype: str = Form(title='tfiletype')):
    if roop.queue:
        return {"message": "another task has already been started"}
    
    source_contents = await source.read()
    target_contents = await target.read()
    print(source)
    status = cur.execute("SELECT status FROM Tasks WHERE task = ?", (task,)).fetchone()
    if status != None: 
        return {"message": "already exists"}

    folder_path = Path("tasks/task"+str(task))

    if not folder_path.exists():
        folder_path.mkdir()

    with open(f"tasks/task{task}/source.{sfiletype}", "wb") as f1:
        f1.write(source_contents)
        f1.close()

    with open(f"tasks/task{task}/target.{tfiletype}", "wb") as f2:
        f2.write(target_contents)
        f2.close()

    roop.queue.append(task)
    roop.start(tfiletype=tfiletype, sfiletype=sfiletype)

    cur.execute("INSERT INTO Tasks (task, status, sfiletype, tfiletype) VALUES (?, ?, ?, ?)", (task, -1, sfiletype, tfiletype))
    conn.commit()

    return {"message": "query added", "task" : task}



@app.post("/task/complite")
async def complite_task(task: int):
    ft = cur.execute("SELECT tfiletype, sfiletype FROM Tasks WHERE task = ?", (task,)).fetchone()
    if not ft:
        return {"status": "no task"}

    if task != roop.queue[0]:
        return {"message": "request failed"}
    if ft[0] == 'png' or ft[0] == 'jpg' or ft[0] == 'jpeg':
        a = os.path.isfile(f'tasks/task{task}/done.txt')
    else:
        a = os.path.isfile(f'tasks/task{task}/output.{ft[0]}')
    if a:
        roop.queue.pop(0)
        roop.start(tfiletype=ft[0], sfiletype=ft[1])
        cur.execute("UPDATE Tasks SET status = ? WHERE task = ?", (0, task))
        return {"message": "completed"}
    elif not a:
        return {"message": "request has not been completed"}



@app.post("/task/get-info")
async def get_info(task: int):
    status = cur.execute("SELECT status, sfiletype, tfiletype FROM Tasks WHERE task = ?", (task,)).fetchone()
    if not status:
        return {"status": "no task", 'sfiletype': 'none', 'tfiletype': 'none'}
    return {'status': status[0], 'sfiletype': status[1], 'tfiletype': status[2]}



@app.post("/task/get")
async def get_task(task: int):
    status = cur.execute("SELECT status, tfiletype FROM Tasks WHERE task = ?", (task,)).fetchone()
    print(status)

    if status == None:
        return {"message": f"no task"}

    if status[0] == -1:
        return {"message": "request has not been completed"}

    else:
        return FileResponse(f"tasks/task{task}/output.{status[1]}")



if __name__ == "__main__":
    uvicorn.run(app, port=8090, reload=False)