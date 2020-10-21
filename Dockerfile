FROM trevzctf

RUN apt update -y 
RUN apt install python3-pip -y

RUN useradd -ms /bin/bash sandbox

WORKDIR /usr/src/app
COPY . .

RUN pip3 install -r requirements.txt

expose 8015
CMD [ "gunicorn", "-k", "eventlet", "-w", "1", "-b", "0.0.0.0:8015", "app:app" ]


USER sandbox
