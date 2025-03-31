const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'your_secret_key';

app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'vini',
  password: '123',
  database: 'palmodoro',
  port: 3306,
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Middleware de autenticação
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Rota raiz
app.get('/', (req, res) => {
  res.send('Servidor rodando! 🚀');
});

// Register user
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(query, [name, email, hashedPassword], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ message: 'User registered successfully' });
  });
});

// Login user
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const userQuery = 'SELECT id, email, password FROM users WHERE email = ?';
  db.query(userQuery, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Erro interno do servidor' });
    if (results.length === 0) return res.status(401).json({ message: 'Credenciais inválidas' });
    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Credenciais inválidas' });
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Login realizado com sucesso', userId: user.id, token });
  });
});

// Atualizar atividade como concluída
app.put('/activities/:id', (req, res) => {
  const { id } = req.params;
  db.query('UPDATE activities SET completed = 1 WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: 'Atividade concluída com sucesso' });
  });
});

// Adicionar atividade
app.post('/activities', (req, res) => {
  const { userId, title } = req.body;
  const query = 'INSERT INTO activities (user_id, title, completed, created_at) VALUES (?, ?, false, NOW())';
  db.query(query, [userId, title], (err, result) => {
    if (err) return res.status(500).send({ message: 'Erro ao adicionar atividade' });
    res.status(201).send({ message: 'Atividade adicionada com sucesso!', activityId: result.insertId });
  });
});

// Obter atividades do usuário
app.get('/activities', authenticateToken, (req, res) => {
  db.query('SELECT * FROM activities WHERE user_id = ?', [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Erro ao buscar atividades' });
    res.status(200).json(results);
  });
});

// Deletar atividade
app.delete('/activities/:id', authenticateToken, (req, res) => {
  db.query('DELETE FROM activities WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao excluir atividade' });
    res.status(200).json({ message: 'Atividade excluída com sucesso' });
  });
});

// Inicia o servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
