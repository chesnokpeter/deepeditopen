from shutil import rmtree 
from os import mkdir
from pathlib import Path

def clear():
    folder_path = 'results'
    if not Path(folder_path).exists():
        ...
    else:
        rmtree(folder_path)
    mkdir(folder_path)
    open('results/empty', 'x')
    print('cleaned')

if __name__ == "__main__":
    clear()