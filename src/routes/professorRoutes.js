// routes/alunoRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../database/db');
const Professor = require('../entities/professor');


router.get('/professores', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM professor');
    const professor = result.rows.map(row => {
      return new professor(
        row.id,
        row.nome,
        row.formacao,
        row.idDisciplina
      );
    });
    res.json(professor);
  } catch (error) {
    console.error('Erro ao buscar professor:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Rota para criar um novo curso
router.post('/professores', async (req, res) => {
  const { nome, formacao, idDisciplina } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO professor (nome, formacao, idDisciplina) VALUES ($1, $2, $3) RETURNING *',
      [nome, formacao, idDisciplina]
    );
    const novoProfessor = new Professor(
      result.rows[0].nome,
      result.rows[0].formacao,
      result.rows[0].idDisciplina
    );
    res.json(novoProfessor);
  } catch (error) {
    console.error('Erro ao adicionar um professor:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

router.put('/professores/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, formacao, idDisciplina } = req.body;

  try {
    const result = await db.query(
      'UPDATE professor SET nome = $1, formacao = $2, idDisciplina = $3 WHERE id = $4 RETURNING *',
      [nome, formacao, idDisciplina, id]
    );

    if (result.rows.length === 0) {
      res.status(404).send('Professor não encontrado');
      return;
    }

    const professorAtualizado = new Professor(
      result.rows[0].id,
      result.rows[0].nome,
      result.rows[0].formacao,
      result.rows[0].idDisciplina
    );
    res.json(professorAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar um professor:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Rota para excluir um professor
router.delete('/professores/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM professor WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).send('Professor não encontrado');
      return;
    }

    const professorExcluido = new Professor(
      result.rows[0].id,
      result.rows[0].nome,
      result.rows[0].formacao,
      result.rows[0].idDisciplina
    );
    res.json(professorExcluido);
  } catch (error) {
    console.error('Erro ao excluir um professor:', error);
    res.status(500).send('Erro interno do servidor');
  }
});


module.exports = router;
