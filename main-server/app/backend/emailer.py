# from jinja2 import Template
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from log.log import errorLog

class Email():
    def __init__(self, by, psswrd, to, host, port):
        self.by = by
        self.psswrd = psswrd
        self.to = to
        smtp_server = smtplib.SMTP_SSL(host, port)
        smtp_server.login(by, psswrd)
        self.smtp_server = smtp_server
    
    def render(adress='confirm_email.html', **kwargs):
        return f'''
            Уважаемый {kwargs['name']}
            Вы используете этот адрес электронной почты для регистрации учетной записи на сайте deepedit
            
            Ваша персональная ссылка: deep-edit.ru/confirm?key={kwargs['key']}
            
            Если Вы не регистрируетесь на сайте, проигнорируйте это письмо.
            Если у вас есть какие-либо вопросы, пожалуйста, свяжитесь с нами по электронной почте: email@deep-edit.ru
            С уважением,
            Команда разработчиков deepedit'''
        # with open("confirm_email.html", 'r', encoding='utf-8') as file:
        #     template_content = file.read()
        # template = Template(template_content)
        # return template.render(kwargs)

    def send(self, html):
        try:
            msg = MIMEMultipart()
            msg["From"] = self.by
            msg["To"] = self.to
            msg["Subject"] = "Подтверждение почты"
            msg.attach(MIMEText(html, 'plain', _charset='utf-8'))
            self.smtp_server.sendmail(self.by, self.to, msg.as_string())
            self.smtp_server.quit()
        except Exception as e:
            error_log = errorLog()
            error_log.error(e)



