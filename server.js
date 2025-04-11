const express = require("express");
const app = express();
const db = require("./src/models");
const boletosRoutes = require("./src/routes/boletos");
const pdfController = require('./src/controllers/pdfController');
const port = process.env.PORT;

app.use(express.json());
app.use("/boletos", boletosRoutes);

// Testar conexão com o banco
db.sequelize
	.authenticate()
	.then(() => {
		console.log("🟢 Conexão com o banco estabelecida com sucesso!");
		// Iniciar o servidor
		app.listen(port, () => {
			console.log(`🚀 Servidor rodando em http://localhost:${port}`);
		});
	})
	.catch((err) => {
		console.error("🔴 Erro ao conectar com o banco:", err);
	});
