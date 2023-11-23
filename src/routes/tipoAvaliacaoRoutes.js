// routes/alunoRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../database/db');
const tipoAvaliacao = require('../entities/tipoAvaliacao');


router.get('/avaliacao', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tipoAvaliacao');
    const avaliacao = result.rows.map(row => {
      return new avaliacao(
        row.id,
        row.descricao
      );
    });
    res.json(avaliacao);
  } catch (error) {
    console.error('Erro ao buscar avaliação:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Rota para criar um novo curso
router.post('/avaliacao', async (req, res) => {
  const { descricao } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO tipoAvaliacao (descricao) VALUES ($1) RETURNING *',
      [descricao]
    );
    const novoTipoAvaliacao = new tipoAvaliacao(
      result.rows[0].descricao,
    );
    res.json(novoTipoAvaliacao);
  } catch (error) {
    console.error('Erro ao criar uma avaliacao:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

router.put('/avaliacao/:id', async (req, res) => {
  const { id } = req.params;
  const { descricao } = req.body;

  try {
    const result = await db.query(
      'UPDATE tipoAvaliacao SET descricao = $1 WHERE id = $2 RETURNING *',
      [descricao, id]
    );

    if (result.rows.length === 0) {
      res.status(404).send('Avaliação não encontrada');
      return;
    }

    const avaliacaoAtualizada = new tipoAvaliacao(
      result.rows[0].id,
      result.rows[0].descricao
    );
    res.json(avaliacaoAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar uma avaliação:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Rota para excluir uma avaliação
router.delete('/avaliacao/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM tipoAvaliacao WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).send('Avaliação não encontrada');
      return;
    }

    const avaliacaoExcluida = new tipoAvaliacao(
      result.rows[0].id,
      result.rows[0].descricao
    );
    res.json(avaliacaoExcluida);
  } catch (error) {
    console.error('Erro ao excluir uma avaliação:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

module.exports = router;
