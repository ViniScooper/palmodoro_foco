// filepath: server.js
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
  port: 3306, // Porta do MySQL (adicione apenas se não for a padrão)
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
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
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const user = results[0];

    // Verifica a senha usando bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gera o token JWT
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });

    // Retorna o userId e o token
    res.json({
      message: 'Login realizado com sucesso',
      userId: user.id, // Inclua o userId na resposta
      token,
    });
  });
});

// Atualizar atividade como concluída
app.put('/activities/:id', (req, res) => {
  const { id } = req.params;

  const query = 'UPDATE activities SET completed = 1 WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: 'Atividade concluída com sucesso' });
  });
});

// Adicionar atividade
app.post('/activities', (req, res) => {
  const { userId, title } = req.body;

  const query = `
    INSERT INTO activities (user_id, title, completed, created_at)
    VALUES (?, ?, false, NOW())
  `;

  db.query(query, [userId, title], (err, result) => {
    if (err) {
      console.error('Erro ao adicionar atividade:', err);
      return res.status(500).send({ message: 'Erro ao adicionar atividade' });
    }
    res.status(201).send({ message: 'Atividade adicionada com sucesso!', activityId: result.insertId });
  });
});

// Obter dados do usuário e atividades concluídas
app.get('/user/:id', (req, res) => {
  const { id } = req.params; // Obtém o ID do usuário da URL
  console.log('User ID recebido:', id); // Log do ID recebido

  const userQuery = 'SELECT id, name, email FROM users WHERE id = ?';
  const activitiesQuery = 'SELECT * FROM activities WHERE user_id = ? AND completed = 1';

  db.query(userQuery, [id], (err, userResult) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err); // Log do erro
      return res.status(500).send(err);
    }
    if (userResult.length === 0) {
      console.log('Usuário não encontrado'); // Log se o usuário não for encontrado
      return res.status(404).send({ message: 'Usuário não encontrado' });
    }

    db.query(activitiesQuery, [id], (err, activitiesResult) => {
      if (err) {
        console.error('Erro ao buscar atividades:', err); // Log do erro
        return res.status(500).send(err);
      }

      console.log('Usuário encontrado:', userResult[0]); // Log do usuário encontrado
      console.log('Atividades concluídas:', activitiesResult); // Log das atividades concluídas

      res.status(200).send({
        user: userResult[0],
        completedActivities: activitiesResult,
      });
    });
  });
});

// Atualizar dados do usuário
app.put('/user/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
  db.query(query, [name, email, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: 'Dados do usuário atualizados com sucess  o' });
  });
});

// Salvar sessão
app.post('/sessions', (req, res) => {
  const { userId, activityId, durationSeconds, completedAt } = req.body;

  const query = `
    INSERT INTO sessions (user_id, activity_id, duration_seconds, completed_at)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [userId, activityId, durationSeconds, completedAt], (err, result) => {
    if (err) {
      console.error('Erro ao salvar a sessão:', err);
      return res.status(500).send({ message: 'Erro ao salvar a sessão' });
    }
    res.status(201).send({ message: 'Sessão salva com sucesso!' });
  });
});

app.get('/sessions/:userId', (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT s.id, s.duration_seconds, s.completed_at, a.title AS activity_title
    FROM sessions s
    LEFT JOIN activities a ON s.activity_id = a.id
    WHERE s.user_id = ?
    ORDER BY s.completed_at DESC
  `;
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar sessões:', err);
      return res.status(500).send({ message: 'Erro ao buscar sessões' });
    }
    if (results.length === 0) {
      return res.status(404).send({ message: 'Nenhuma sessão encontrada para este usuário.' });
    }
    res.status(200).send(results);
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});