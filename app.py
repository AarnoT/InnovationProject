from flask import Flask, render_template, request
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
    else:
        abort(404)

        
@app.route('/registuser')
def getRigistRequest():
    user_id = request.args.get('user')
    user_pwd = request.args.get('password')

    conn = sqlite3.connect('app.db')

    c = conn.cursor()
    c.execute('''CREATE TABLE info(name text, password text)''')
   

    try:
    
        c.execute("INSERT INTO app VALUES (user_id,user_pwd)")

        conn.commit()
        return render_template('index.html')
    except:

        traceback.print_exc()
       
        c.rollback()
        return 'Register failed'

    conn.close()

@app.route('/login')
def getLoginRequest():
    
    conn = sqlite3.connect('app.db')
    c = conn.cursor()
    user_id = request.args.get('name')
    user_pwd = request.args.get('password')
    
    try:
        c.execute('SELECT * FROM stocks WHERE symbol=?, ?', user_id, user_pwd)
       
        results = cursor.fetchall()
        print(len(results))
        if len(results) == 1:
            data = {}
            data["code"] = 'Welcome'
            for row in results:
                data["id"] = row[0]
                data["pwd"] = row[1]
            return render_template('app.html')
        else:
            return 'Username or password incorrect!'

        conn.commit()
    except:

        traceback.print_exc()
        c.rollback()

    conn.close()



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
