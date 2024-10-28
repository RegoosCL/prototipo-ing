from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_mysqldb import MySQL

app = Flask(__name__, template_folder='template')

# Configuración de la base de datos MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''  # Asegúrate de tener la contraseña correcta
app.config['MYSQL_DB'] = 'rolbd'

mysql = MySQL(app)

# Ruta para la página de inicio (Login)
@app.route('/')
def home():
    return render_template('login.html')

# Ruta para la página de inicio después del login exitoso
@app.route('/index')
def index():
    return render_template('index.html')

# Ruta para el login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    cur = mysql.connection.cursor()
    # Consulta para verificar el usuario y contraseña
    cur.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
    user = cur.fetchone()
    cur.close()

    if user:
        # Si el usuario y la contraseña son correctos
        return jsonify({"success": True})
    else:
        # Si son incorrectos
        return jsonify({"success": False, "message": "Usuario o contraseña incorrectos"})

# Ruta para el registro
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        # Mostrar el formulario de registro
        return render_template('register.html')
    
    if request.method == 'POST':
        # Obtener los datos desde el frontend
        data = request.json
        username = data['username']
        email = data['email']
        password = data['password']

        cur = mysql.connection.cursor()
        try:
            # Insertar el nuevo usuario en la base de datos
            cur.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)", 
                        (username, email, password))
            mysql.connection.commit()
            cur.close()
            return jsonify({"success": True})
        except Exception as e:
            # Manejar error de duplicado o algún problema en la inserción
            mysql.connection.rollback()
            cur.close()
            return jsonify({"success": False, "message": "Error en el registro. El usuario o email ya existe."})

# Iniciar la aplicación Flask
if __name__ == '__main__':
    app.run(debug=True)
