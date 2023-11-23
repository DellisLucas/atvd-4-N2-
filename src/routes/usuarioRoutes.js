// routes/alunoRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../database/db');
const Usuario = require('../entities/Usuario');


router.get('/usuarios', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Usuario');
    const usuario = result.rows.map(row => {
      return new Usuario(
        row.id,
        row.nome,
        row.email
      );
    });
    res.json(usuario);
  } catch (error) {
    console.error('Erro ao buscar usuario:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Rota para criar um novo curso
router.post('/usuarios', async (req, res) => {
  const { nome, email } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO usuario (nome, email) VALUES ($1, $2) RETURNING *',
      [nome, email]
    );
    const novoUsuario = new Usuario(
      result.rows[0].id,
      result.rows[0].nome,
      result.rows[0].email
    );
    res.json(novoUsuario);
  } catch (error) {
    console.error('Erro ao criar um usuario:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

router.delete('/usuario/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM usuario WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).send('Usuário não encontrado');
      return;
    }

    const usuarioExcluido = new Usuario(
      result.rows[0].id,
      result.rows[0].nome,
      result.rows[0].email
    );
    res.json(usuarioExcluido);
  } catch (error) {
    console.error('Erro ao excluir um usuário:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

router.put('/usuario/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body;

  try {
    const result = await db.query(
      'UPDATE usuario SET nome = $1, email = $2 WHERE id = $3 RETURNING *',
      [nome, email, id]
    );

    if (result.rows.length === 0) {
      res.status(404).send('Usuário não encontrado');
      return;
    }

    const usuarioAtualizado = new Usuario(
      result.rows[0].id,
      result.rows[0].nome,
      result.rows[0].email
    );
    res.json(usuarioAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar um usuário:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

module.exports = router;
