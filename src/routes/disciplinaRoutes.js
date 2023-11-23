// routes/alunoRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../database/db');
const Disciplina = require('../entities/disciplina');


router.get('/disciplinas', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM disciplina');
    const disciplina = result.rows.map(row => {
      return new disciplina(
        row.id,
        row.nome,
        row.idProfessor,
        row.idCurso
      );
    });
    res.json(disciplina);
  } catch (error) {
    console.error('Erro ao buscar disciplina:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Rota para criar um novo curso
router.post('/disciplinas', async (req, res) => {
  const { nome, idProfessor, idCurso } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO disciplina (nome, idProfessor, idCurso) VALUES ($1, $2, $3) RETURNING *',
      [nome, idProfessor, idCurso]
    );
    const novaDisciplina = new Disciplina(
      result.rows[0].nome,
      result.rows[0].idProfessor,
      result.rows[0].idCurso
    );
    res.json(novaDisciplina);
  } catch (error) {
    console.error('Erro ao adicionar uma disciplina:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

router.put('/disciplinas/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, idProfessor, idCurso } = req.body;

  try {
    const result = await db.query(
      'UPDATE disciplina SET nome = $1, idProfessor = $2, idCurso = $3 WHERE id = $4 RETURNING *',
      [nome, idProfessor, idCurso, id]
    );

    if (result.rows.length === 0) {
      res.status(404).send('Disciplina não encontrada');
      return;
    }

    const disciplinaAtualizada = new Disciplina(
      result.rows[0].id,
      result.rows[0].nome,
      result.rows[0].idProfessor,
      result.rows[0].idCurso
    );
    res.json(disciplinaAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar uma disciplina:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Rota para excluir uma disciplina
router.delete('/disciplinas/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM disciplina WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).send('Disciplina não encontrada');
      return;
    }

    const disciplinaExcluida = new Disciplina(
      result.rows[0].id,
      result.rows[0].nome,
      result.rows[0].idProfessor,
      result.rows[0].idCurso
    );
    res.json(disciplinaExcluida);
  } catch (error) {
    console.error('Erro ao excluir uma disciplina:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

module.exports = router;
