import sqlite3
conn = sqlite3.connect('transactions.db')
cur = conn.cursor()
cur.execute("DELETE FROM Tasks")
conn.commit()
print('бд отчищена')


import shutil
import os
folder_path = 'tasks'
shutil.rmtree(folder_path)
os.mkdir(folder_path)