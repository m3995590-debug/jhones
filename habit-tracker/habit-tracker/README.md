# 🔥 Habit Tracker

Um rastreador de hábitos simples: adicione hábitos, marque quando completar
no dia e acompanhe sua sequência (streak) de dias consecutivos.

Projeto feito para praticar full-stack básico: **Node.js + Express** no
back-end e **HTML/CSS/JS puro** no front-end, sem frameworks, para facilitar
o entendimento de cada parte.

## Funcionalidades

- ✅ Adicionar hábitos
- ✅ Marcar/desmarcar hábito como concluído no dia
- ✅ Cálculo automático de streak (sequência de dias)
- ✅ Excluir hábitos
- ✅ Dados salvos em arquivo local (`data.json`), sem precisar configurar banco de dados

## Stack

- **Back-end:** Node.js + Express
- **Front-end:** HTML, CSS e JavaScript puro (vanilla)
- **Persistência:** arquivo JSON local (`data.json`, criado automaticamente)

## Como rodar localmente

Pré-requisito: ter o [Node.js](https://nodejs.org/) instalado (versão 18 ou superior).

```bash
# 1. Clone o repositório
git clone https://github.com/SEU-USUARIO/habit-tracker.git
cd habit-tracker

# 2. Instale as dependências
npm install

# 3. Rode o servidor
npm start
```

Depois é só abrir **http://localhost:3000** no navegador.

> Durante o desenvolvimento, `npm run dev` reinicia o servidor automaticamente a cada alteração.

## Estrutura do projeto

```
habit-tracker/
├── server.js          # servidor Express + API + lógica de streak
├── package.json
├── public/
│   ├── index.html      # página principal
│   ├── style.css        # estilos
│   └── app.js            # lógica do front-end (consome a API)
└── data.json           # criado automaticamente ao rodar (não versionado)
```

## Ideias para expandir

- [ ] Autenticação de usuário (cada pessoa com seus próprios hábitos)
- [ ] Trocar o arquivo JSON por um banco de verdade (SQLite, Postgres)
- [ ] Gráfico de histórico (ex: heatmap estilo GitHub contributions)
- [ ] Notificações/lembretes diários
- [ ] Editar o nome de um hábito já criado
- [ ] Testes automatizados (Jest/Vitest) para a lógica de streak

## Licença

MIT
