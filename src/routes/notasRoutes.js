const express = require('express');
const router = express.Router();
const db = require('../database/db');
const Curso = require('../entities/notas');


router.get('/notas', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM notas');
    const notas = result.rows.map(row => {
      return new Nota(
        row.id,
        row.idtipoavaliacao,
        row.peso,
        row.idaluno,
        row.idprofessor,
        row,iddisciplina
      );
    });
    res.json(notas);
  } catch (error) {
    console.error('Erro ao buscar notas:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Rota para criar um novo curso
router.post('/notas', async (req, res) => {
  const { idtipoavaliacao, peso, idaluno, idprofessor, iddisciplina } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO Nota (id, idtipoavaliacao, peso, idaluno, idprofessor, iddisciplina) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [idtipoavaliacao, peso, idaluno, idprofessor, iddisciplina]
    );
    const novaNota = new Nota(
      result.rows[0].id,
      result.rows[0].idtipoavaliacao,
      result.rows[0].peso,
      result.rows[0].idaluno,
      result.rows[0].idprofessor,
      result.rows[0].iddisciplina
    );
    res.json(novaNota);
  } catch (error) {
    console.error('Erro ao adicionar uma nova nota:', error);
    res.status(500).send('Erro interno do servidor');
  }
});


router.put('/notas/:id', async (req, res) => {
  const { id } = req.params;
  const { idtipoavaliacao, peso, idaluno, idprofessor, iddisciplina } = req.body;

  try {
    const result = await db.query(
      'UPDATE notas SET idtipoavaliacao = $1, peso = $2, idaluno = $3, idprofessor = $4, iddisciplina = $5 WHERE id = $6 RETURNING *',
      [idtipoavaliacao, peso, idaluno, idprofessor, iddisciplina, id]
    );

    if (result.rows.length === 0) {
      res.status(404).send('Nota não encontrada');
      return;
    }

    const notaAtualizada = new Nota(
      result.rows[0].id,
      result.rows[0].idtipoavaliacao,
      result.rows[0].peso,
      result.rows[0].idaluno,
      result.rows[0].idprofessor,
      result.rows[0].iddisciplina
    );
    res.json(notaAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar uma nota:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Rota para excluir uma nota
router.delete('/notas/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM notas WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).send('Nota não encontrada');
      return;
    }

    const notaExcluida = new Nota(
      result.rows[0].id,
      result.rows[0].idtipoavaliacao,
      result.rows[0].peso,
      result.rows[0].idaluno,
      result.rows[0].idprofessor,
      result.rows[0].iddisciplina
    );
    res.json(notaExcluida);
  } catch (error) {
    console.error('Erro ao excluir uma nota:', error);
    res.status(500).send('Erro interno do servidor');
  }
});


module.exports = router;
