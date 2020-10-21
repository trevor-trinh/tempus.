# tempus.

tempus is a fully functional todolist with a beautiful UI and a vulnerable flask backend. 

A great learning opportunity, I was inspired by friends to make this and learned plenty of new skills and solidified existing ones along the way. 

This was created as a challenge in cybersecurity Capture the Flag (CTF) competitions. Initially created for GHCHS's Cybersecurity Club CTF, trevzCTF.

tempus uses python's `flask` as the backend, rendering pages using `Jinja2`. It can be deployed safely using `Docker`.

Python `Flask-SocketIO` on the backend communicates with the frontend javascript `socket.io` on every new todo item. It stores the rendered data into the browser's local storage for future viewing. It also stores viewing done items preference, list of all todos and dones, and color preference. 

Note: You can remove parts of script.js, that fetch to the backend, to have a secure standalone todolist. In that case, run the todolist with gunicorn using the same command in the Dockerfile but standalone. 

## Screenshots
![Salmon background showing finished tasks](assets/screenshot1.png?raw=true)
![Black background minimal](assets/screenshot2.png?raw=true)


## Installation

1. Clone and move into this repository:

```bash
git clone https://github.com/trevor-trinh/tempus..git
cd tempus.
``

(OPTIONAL) Use python `venv` to make a virtual environment:

```bash
python3 -m venv env
source env/bin/activate
```

2. Install the Python requirements with pip:

```bash
pip install -r requirements.txt
```

3. To test run the app (if you're not using python `venv`, do not include the `source` and `deactivate` commands):

```bash
source "env/bin/activate"
export FLASK_APP=app.py
export FLASK_ENV=development
flask run -p 8015 -h "0.0.0.0"
deactivate
```

4. To run in production with `Docker`:

```bash
docker pull trevortrinh/trevzctf
# Edit build.sh with your docker image tag like: your-name/tempus.
./build.sh
./start.sh
```


## Contributing
While I don't really know how to use github and accept changes just yet, pull requests are welcome!
