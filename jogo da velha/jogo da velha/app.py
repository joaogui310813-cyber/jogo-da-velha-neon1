from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)
# A secret_key é necessária para redirecionamentos e sessões com segurança
app.secret_key = 'projeto_neon_secreto'

# Senha que VOCÊ vai usar para acessar o ADM
SENHA_ADM = "joao123"

# Banco de dados temporário (zera se o servidor do Render reiniciar)
stats = {
    "vitorias_player": 0,
    "vitorias_robo": 0,
    "empates": 0
}

@app.route('/')
def index():
    return render_template('index.html', stats=stats)

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/painel-adm')
def adm():
    # Verifica se a senha está na URL: /painel-adm?senha=joao123
    senha_digitada = request.args.get('senha')
    
    if senha_digitada == SENHA_ADM:
        return render_template('adm.html', stats=stats)
    else:
        return "<h1>Acesso Negado!</h1><p>Use a senha correta na URL.</p>", 403

@app.route('/reset-placar', methods=['POST'])
def reset_placar():
    stats['vitorias_player'] = 0
    stats['vitorias_robo'] = 0
    stats['empates'] = 0
    # Volta para o ADM passando a senha de novo para não ser bloqueado
    return redirect(url_for('adm', senha=SENHA_ADM))

if __name__ == '__main__':
    app.run(debug=True)