const express = require('express');
const router = express.Router();
const db = require('../database/db');
const Aula = require('../entities/aula');


router.get('/aulas', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM aula');
    const aula = result.rows.map(row => {
      return new Aula(
        row.id,
        row.data,
        row.descricao,
        row.idprofessor,
        row.iddisciplina
      );
    });
    res.json(aula);
  } catch (error) {
    console.error('Erro ao buscar aulas:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Rota para criar um novo curso
router.post('/aulas', async (req, res) => {
  const { data, descricao, idprofessor, iddisciplina } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO Aula (data, descricao, idprofessor, iddisciplina) VALUES ($1, $2, $3, $4) RETURNING *',
      [data, descricao, idprofessor, iddisciplina]
    );
    const novaAula = new Curso(
      result.rows[0].id,
      result.rows[0].nome,
      result.rows[0].descricao,
      result.rows[0].idprofessor,
      result.rows[0].iddisciplina
    );
    res.json(novaAula);
  } catch (error) {
    console.error('Erro ao criar um curso:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

router.put('/aulas/:id', async (req, res) => {
  const { id } = req.params;
  const { data, descricao, idprofessor, iddisciplina } = req.body;

  try {
    const result = await db.query(
      'UPDATE aula SET data = $1, descricao = $2, idprofessor = $3, iddisciplina = $4 WHERE id = $5 RETURNING *',
      [data, descricao, idprofessor, iddisciplina, id]
    );

    if (result.rows.length === 0) {
      res.status(404).send('Aula não encontrada');
      return;
    }

    const aulaAtualizada = new Aula(
      result.rows[0].id,
      result.rows[0].data,
      result.rows[0].descricao,
      result.rows[0].idprofessor,
      result.rows[0].iddisciplina
    );
    res.json(aulaAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar uma aula:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Rota para excluir uma aula
router.delete('/aulas/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM aula WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).send('Aula não encontrada');
      return;
    }

    const aulaExcluida = new Aula(
      result.rows[0].id,
      result.rows[0].data,
      result.rows[0].descricao,
      result.rows[0].idprofessor,
      result.rows[0].iddisciplina
    );
    res.json(aulaExcluida);
  } catch (error) {
    console.error('Erro ao excluir uma aula:', error);
    res.status(500).send('Erro interno do servidor');
  }
});


module.exports = router;
