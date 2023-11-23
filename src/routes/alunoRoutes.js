// routes/alunoRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../database/db');
const Aluno = require('../entities/aluno');

// Rota para listar todos os alunos
router.get('/alunos', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Aluno');
    const alunos = result.rows.map(row => {
      return new Aluno(
        row.id,
        row.nome,
        row.rg,
        row.cpf,
        row.endereco,
        row.telefone,
        row.id_curso
      );
    });
    res.json(alunos);
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    res.status(500).send('Erro interno do servidor1');
  }
});

// Rota para criar um novo aluno
router.post('/alunos', async (req, res) => {
  const { nome, rg, cpf, endereco, telefone, idCurso } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO aluno (nome, rg, cpf, endereco, telefone, idcurso) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nome, rg, cpf, endereco, telefone, idCurso]
    );
    const novoAluno = new Aluno(
      result.rows[0].id,
      result.rows[0].nome,
      result.rows[0].rg,
      result.rows[0].cpf,
      result.rows[0].endereco,
      result.rows[0].telefone,
      result.rows[0].id_curso
    );
    res.json(novoAluno);
  } catch (error) {
    console.error('Erro ao criar um aluno:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

router.put('/alunos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, rg, cpf, endereco, telefone, idCurso } = req.body;

  try {
    const result = await db.query(
      'UPDATE aluno SET nome = $1, rg = $2, cpf = $3, endereco = $4, telefone = $5, idcurso = $6 WHERE id = $7 RETURNING *',
      [nome, rg, cpf, endereco, telefone, idCurso, id]
    );

    if (result.rows.length === 0) {
      res.status(404).send('Aluno não encontrado');
      return;
    }

    const alunoAtualizado = new Aluno(
      result.rows[0].id,
      result.rows[0].nome,
      result.rows[0].rg,
      result.rows[0].cpf,
      result.rows[0].endereco,
      result.rows[0].telefone,
      result.rows[0].id_curso
    );
    res.json(alunoAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar um aluno:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Rota para excluir um aluno
router.delete('/alunos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM aluno WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).send('Aluno não encontrado');
      return;
    }

    const alunoExcluido = new Aluno(
      result.rows[0].id,
      result.rows[0].nome,
      result.rows[0].rg,
      result.rows[0].cpf,
      result.rows[0].endereco,
      result.rows[0].telefone,
      result.rows[0].id_curso
    );
    res.json(alunoExcluido);
  } catch (error) {
    console.error('Erro ao excluir um aluno:', error);
    res.status(500).send('Erro interno do servidor');
  }
});


module.exports = router;
