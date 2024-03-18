import uvicorn
from app.app import app
from shutil import rmtree 
from os import mkdir
from pathlib import Path

if __name__ == "__main__":
    def clear():
        folder_path = 'results'
        if not Path(folder_path).exists():
            ...
        else:
            rmtree(folder_path)
        mkdir(folder_path)
        open('results/empty', 'x')
        print('cleaned')

    clear()
    uvicorn.run(app, port=8000, host='0.0.0.0', log_config='log/conf.ini')