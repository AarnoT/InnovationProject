from flask import Flask, render_template, request

app = Flask(__name__)


@app.route('/', defaults={'path' : 'index'})
@app.route('/<path>')
def main(path='index'):
    '''Return correct file.'''
    if path == 'index':
        return render_template('index.html')
    elif path == 'app':
        return render_template('app.html')
    elif path == 'app.js':
        with open('app.js') as f:
            return f.read()
    else:
        abort(404)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
