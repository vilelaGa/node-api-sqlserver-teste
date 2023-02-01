const { json } = require("express");
const express = require("express");
const api = require("./api");
const sql = require("mssql");

const cors = require("cors");

const server = express();
const port = process.env.PORT || 1234;

server.use(express.json());
server.use(cors());

const dbSettings = {
  user: "sa",
  password: "123456",
  server: "localhost",
  database: "Teste_vilela",
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

server.get("/set", async (req, res) => {
  const pool = await sql.connect(dbSettings);
  const result = await pool.request().query("SELECT * FROM atividades");
  // console.log(result);
  return res.status(200).json(result.recordset["0"].CodColidada);
});

server.get("/", (req, res) => {
  return res.send({ message: "Gabriel" });
});

server.get("/pokemon/:id", async (req, res) => {
  let { id } = req.params;

  // console.log(id);

  id = id == 0 ? "1" : id;

  // console.log(typeof id);

  try {
    const { data } = await api.get(`pokemon/${id}`);
    return res.send({ name: data.name });
  } catch (error) {
    return res.send({ message: error });
  }
});

server.post("/mett", (req, res) => {
  const { nome, idade } = req.body;

  console.log(nome, idade);

  return res.json({
    nome: nome,
    idade: idade,
  });
});

server.post("/register/:nome/:senha", async (req, res) => {
  const { nome, senha } = req.params;

  console.log(nome, senha);

  return res.status(200).json({
    nome: nome,
    senha: senha,
  });
});

server.listen(port);
