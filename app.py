import re
from flask import Flask, render_template, request, render_template_string
from flask_socketio import SocketIO, emit, send

app = Flask(__name__)
socketio = SocketIO(app)


@app.route("/")
def home():
    return render_template('index.html')


@socketio.on('connect')
def handle_connect():
    print('Client connected')


@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')


@socketio.on('render todo')
def render_todo(data):
    output = ""
    try:
        output = render_template_string(f"{data}")
    except Exception as e:
        output = str(e)
    socketio.emit('rendered data', output, room=request.sid)


if __name__ == '__main__':
    print(f"[WEB] Listening at http://localhost:8015")
    socketio.run()
