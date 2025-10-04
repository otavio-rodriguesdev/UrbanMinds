# run.py
from flask import Flask, render_template

# Criamos a aplicação Flask diretamente aqui para simplicidade
app = Flask(__name__, template_folder="app/templates", static_folder="app/static")

@app.route("/")
def index():
    """Serve a página principal da aplicação."""
    return render_template("index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)