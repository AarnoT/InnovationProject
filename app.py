from flask import abort, Flask, render_template, request, redirect
import sqlite3

app = Flask(__name__)


@app.route('/', defaults={'path' : 'index'})
@app.route('/<path>')
def main(path='index'):
    '''Return correct file.'''
    if path == 'index':
        return render_template('index.html')
    elif path == 'app':
        return render_template('app.html')
    elif path == 'register':
        return render_template('register.html')
    elif path == 'app.js':
        with open('app.js') as f:
            return f.read()
    elif path == 'tiger.png':
        with open('tiger.png', 'rb') as f:
            return f.read()
    elif path == 'sound.mp3':
        with open('sound.mp3', 'rb') as f:
            return f.read()
    else:
        abort(404)

        
@app.route('/registuser', methods=['POST'])
def getRigistRequest():
    
    conn = sqlite3.connect('app.db')
    c = conn.cursor()
    user_id = request.form.get('name')
    user_pwd = request.form.get('password')
    c.execute('''CREATE TABLE IF NOT EXISTS info(name text, password text)''')   
    
    try:
        c.execute("INSERT INTO info VALUES (?, ?)", (user_id, user_pwd))
        conn.commit()
        return redirect('/');
    
    except:
        traceback.print_exc()
        c.rollback()
        return 'Register failed'
    conn.close()

@app.route('/login', methods=['POST'])
def getLoginRequest():
    conn = sqlite3.connect('app.db')
    c = conn.cursor()
    user_id = request.form.get('name')
    user_pwd = request.form.get('password')
    
    rows = c.execute('SELECT 1 FROM info WHERE name=? AND password=?', (user_id, user_pwd)) 
    results = rows.fetchall()
    conn.close()

    if len(results) >= 1:
        return redirect('/app?user=' + str(user_id))
    else:
        return 'Username or password incorrect!'

@app.route('/addPoint')
def addPoint():
    conn = sqlite3.connect('app.db')
    c = conn.cursor()
    user_id = request.args.get('name')
    c.execute('''CREATE TABLE IF NOT EXISTS points(name text, points int)''')   
    rows = c.execute('SELECT points FROM points WHERE name=?', (user_id,))
    rows = rows.fetchall()
    points = 0
    if rows:
        points = rows[0][0]
        c.execute("UPDATE points SET points=? WHERE name=?", (points + 1, user_id))
    else:
    	points = 0
    	c.execute("INSERT INTO points VALUES (?, ?)", (user_id, 1))
    conn.commit()
    conn.close()
    return str(points + 1)

@app.route('/getPoints')
def getPoints():
    conn = sqlite3.connect('app.db')
    c = conn.cursor()
    user_id = request.args.get('name')
    rows = c.execute('SELECT points FROM points WHERE name=?', (user_id,))
    rows = rows.fetchall()
    conn.close()
    points = 0
    if rows:
        points = rows[0][0]
    return str(points)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
