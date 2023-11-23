const express = require('express');
const cors = require('cors');
const app = express();
//const port = 3000;


const corsOptions = {
  origin: 'http://127.0.0.1:5500', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, 
};

app.use(cors(corsOptions));


app.use(express.json());


const frequenciaRoutes = require('./src/routes/frequenciaRoutes');
app.use('/api', frequenciaRoutes);

const notasRoutes = require('./src/routes/notasRoutes');
app.use('/api', notasRoutes);

const aulaRoutes = require('./src/routes/aulaRoutes');
app.use('/api', aulaRoutes);

const disciplinaRoutes = require('./src/routes/disciplinaRoutes');
app.use('/api', disciplinaRoutes);

const professorRoutes = require('./src/routes/professorRoutes');
app.use('/api', professorRoutes);

const tipoAvaliacaoRoutes = require('./src/routes/tipoAvaliacaoROutes');
app.use('/api', tipoAvaliacaoRoutes);

const alunoRoutes = require('./src/routes/alunoRoutes');
app.use('/api', alunoRoutes);

const cursoRoutes = require('./src/routes/cursoRoutes');
app.use('/api', cursoRoutes);

const usuarioRoutes = require('./src/routes/usuarioRoutes');
const Professor = require('./src/entities/professor');
app.use('/api', usuarioRoutes);

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
