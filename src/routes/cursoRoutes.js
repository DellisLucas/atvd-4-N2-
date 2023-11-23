// routes/alunoRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../database/db');
const Curso = require('../entities/curso');


router.get('/curso', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Curso');
    const curso = result.rows.map(row => {
      return new Curso(
        row.id,
        row.nome,
        row.grade
      );
    });
    res.json(curso);
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Rota para criar um novo curso
router.post('/curso', async (req, res) => {
  const { nome, grade } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO curso (nome, grade) VALUES ($1, $2) RETURNING *',
      [nome, grade]
    );
    const novoCurso = new Curso(
      result.rows[0].id,
      result.rows[0].nome,
      result.rows[0].grade
    );
    res.json(novoCurso);
  } catch (error) {
    console.error('Erro ao criar um curso:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

router.put('/curso/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, grade } = req.body;

  try {
    const result = await db.query(
      'UPDATE curso SET nome = $1, grade = $2 WHERE id = $3 RETURNING *',
      [nome, grade, id]
    );

    if (result.rows.length === 0) {
      res.status(404).send('Curso não encontrado');
      return;
    }

    const cursoAtualizado = new Curso(
      result.rows[0].id,
      result.rows[0].nome,
      result.rows[0].grade
    );
    res.json(cursoAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar um curso:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Rota para excluir um curso
router.delete('/curso/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM curso WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).send('Curso não encontrado');
      return;
    }

    const cursoExcluido = new Curso(
      result.rows[0].id,
      result.rows[0].nome,
      result.rows[0].grade
    );
    res.json(cursoExcluido);
  } catch (error) {
    console.error('Erro ao excluir um curso:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

module.exports = router;
