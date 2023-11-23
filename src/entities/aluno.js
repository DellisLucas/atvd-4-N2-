// models/Aluno.js
class Aluno {
    constructor(id, nome, rg, cpf, endereco, telefone, idCurso) {
      this.id = id;
      this.nome = nome;
      this.rg = rg;
      this.cpf = cpf;
      this.endereco = endereco;
      this.telefone = telefone;
      this.idCurso = idCurso;
    }
  }
  
  module.exports = Aluno;
  