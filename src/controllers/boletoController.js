const fs = require("fs");
const csv = require("csv-parser");
const { Boleto, Lote } = require("../models");

const importarCSV = async (req, res) => {
	const resultados = [];

	if (!req.file || !req.file.path) {
		return res
			.status(400)
			.json({ erro: "Arquivo não enviado ou caminho inválido." });
	}

	fs.createReadStream(req.file.path)
		.pipe(csv({ separator: ";" }))
		.on("data", (data) => resultados.push(data))
		.on("end", async () => {
			try {
				let boletoId = (await Boleto.count()) + 1;

				for (const item of resultados) {
					// Validação dos dados do CSV
					if (
						!item.unidade ||
						!item.nome ||
						!item.valor ||
						!item.linha_digitavel
					) {
						console.warn("Registro inválido encontrado e ignorado:", item);
						continue;
					}

					// Formatar unidade e buscar lote correspondente
					const unidadeFormatada = `00${item.unidade}`.slice(-4);
					const id_formatado = {
						"0017": 3,
						"0018": 6,
						"0019": 7,
					};

					let lote = await Lote.findOne({
						where: { nome: unidadeFormatada },
					});

					// Se o lote não for encontrado, usar o id_formatado para determinar o id_lote
					if (!lote) {
						const idLoteFormatado = id_formatado[unidadeFormatada];
						if (idLoteFormatado) {
							// Criar lote com o id formatado
							lote = await Lote.create({
								id: idLoteFormatado,
								nome: unidadeFormatada,
							});
						} else {
							// Caso não exista no id_formatado, criar lote normalmente
							lote = await Lote.create({ nome: unidadeFormatada });
						}
					}

					// Garantir que o lote foi criado ou encontrado
					if (!lote || !lote.id) {
						console.error(
							`Erro ao criar ou encontrar o lote para unidade: ${unidadeFormatada}`
						);
						continue;
					}

					// Verificar se o boleto já existe antes de criar
					const boletoExistente = await Boleto.findOne({
						where: { linha_digitavel: item.linha_digitavel },
					});
					if (boletoExistente) {
						console.warn(`Boleto já existe: ${item.linha_digitavel}`);
						continue;
					}
					// Verificar se o valor é um número válido
					if (isNaN(parseFloat(item.valor))) {
						console.warn(`Valor inválido encontrado: ${item.valor}`);
						continue;
					}
					// Criar o novo boleto no banco de dados com ID incremental
					await Boleto.create({
						id: boletoId++, // Incrementar o ID do boleto
						nome_sacado: item.nome,
						id_lote: lote.id,
						valor: parseFloat(item.valor),
						linha_digitavel: item.linha_digitavel,
						ativo: true,
						criado_em: new Date(),
					});
				}

				// Remover o arquivo após o processamento
				fs.unlinkSync(req.file.path);

				res.status(201).json({ mensagem: "Boletos importados com sucesso!" });
			} catch (err) {
				console.error(err);
				res.status(500).json({ erro: "Erro ao importar boletos." });
			}
		});
};

module.exports = { importarCSV };
