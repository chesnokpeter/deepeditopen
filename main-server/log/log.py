import logging

def requestLog():
    logger = logging.getLogger('request logging')
    logger.propagate = False
    file_handler = logging.FileHandler('log/request.log')
    file_handler.setFormatter(logging.Formatter('%(asctime)s - %(message)s'))
    logger.addHandler(file_handler)
    return logger

def errorLog():
    logger = logging.getLogger('error logging')
    logger.propagate = False
    file_handler = logging.FileHandler('log/error.log')
    file_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
    logger.addHandler(file_handler)
    return logger