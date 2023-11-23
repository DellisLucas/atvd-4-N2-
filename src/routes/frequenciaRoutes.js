const express = require('express');
const router = express.Router();
const db = require('../database/db');
const Frequencia = require('../entities/frequencia');


router.get('/frequencia', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM frequencia');
    const frequencia = result.rows.map(row => {
      return new Frequencia(
        row.id,
        row.idaula,
        row.idaluno,
      );
    });
    res.json(frequencia);
  } catch (error) {
    console.error('Erro ao buscar a frequencia:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Rota para criar um novo curso
router.post('/frequencia', async (req, res) => {
  const { idaula, idaluno } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO Frequencia (idaula, idaluno) VALUES ($1, $2) RETURNING *',
      [idaula, idaluno]
    );
    const novaFrequencia = new Frequencia(
      result.rows[0].id,
      result.rows[0].idaula,
      result.rows[0].idaluno
    );
    res.json(novaFrequencia);
  } catch (error) {
    console.error('Erro ao adicionar uma nova frequencia:', error);
    res.status(500).send('Erro interno do servidor');
  }
});


router.put('/frequencia/:id', async (req, res) => {
  const { id } = req.params;
  const { idaula, idaluno } = req.body;

  try {
    const result = await db.query(
      'UPDATE frequencia SET idaula = $1, idaluno = $2 WHERE id = $3 RETURNING *',
      [idaula, idaluno, id]
    );

    if (result.rows.length === 0) {
      res.status(404).send('Frequência não encontrada');
      return;
    }

    const frequenciaAtualizada = new Frequencia(
      result.rows[0].id,
      result.rows[0].idaula,
      result.rows[0].idaluno
    );
    res.json(frequenciaAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar uma frequência:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Rota para excluir uma frequência
router.delete('/frequencia/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM frequencia WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).send('Frequência não encontrada');
      return;
    }

    const frequenciaExcluida = new Frequencia(
      result.rows[0].id,
      result.rows[0].idaula,
      result.rows[0].idaluno
    );
    res.json(frequenciaExcluida);
  } catch (error) {
    console.error('Erro ao excluir uma frequência:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

module.exports = router;
