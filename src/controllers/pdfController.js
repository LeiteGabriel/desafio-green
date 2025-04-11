const fs = require("fs");
const path = require("path");
const { PDFDocument, StandardFonts } = require("pdf-lib");
const db = require("../models");
const Boleto = db.Boleto;
const OrdemBoleto = db.OrdemBoleto; // Importar o modelo OrdemBoleto

// Função para dividir o PDF e salvar os arquivos
exports.dividirPdf = async (req, res) => {
	try {
		const pdfPath = req.file.path;
		const pdfBytes = fs.readFileSync(pdfPath);
		const pdfDoc = await PDFDocument.load(pdfBytes);
		const totalPages = pdfDoc.getPageCount();

		// Buscar a ordem fixa dos boletos no banco
		const ordemBoletos = await OrdemBoleto.findAll({
			order: [["ordem", "ASC"]],
		});

		if (totalPages !== ordemBoletos.length) {
			return res
				.status(400)
				.json({ error: "Número de páginas não bate com a ordem esperada" });
		}

		// Busca boletos e organiza com base na ordem fixa
		const boletos = await Promise.all(
			ordemBoletos.map(async (ordem) => {
				const boleto = await Boleto.findOne({
					where: {
						nome_sacado: {
							[db.Sequelize.Op.iLike]: `%${ordem.nome_sacado}%`,
						},
					},
				});
				return boleto;
			})
		);

		// Caminho do diretório onde os PDFs serão salvos
		const outputDir = path.join(__dirname, "../../boletos");

		// Verificar se o diretório existe, caso contrário, criá-lo
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}

		for (let i = 0; i < totalPages; i++) {
			const novoPdf = await PDFDocument.create();
			const [pagina] = await novoPdf.copyPages(pdfDoc, [i]);
			novoPdf.addPage(pagina);
			const pdfSalvo = await novoPdf.save();

			const idBoleto = boletos[i]?.id;

			if (idBoleto) {
				const outputPath = path.join(outputDir, `${idBoleto}.pdf`);
				fs.writeFileSync(outputPath, pdfSalvo);
			} else {
				console.warn(
					`Boleto não encontrado para ${ordemBoletos[i].nome_sacado}`
				);
			}
		}

		return res.status(200).json({ message: "PDFs separados com sucesso!" });
	} catch (error) {
		console.error("Erro ao dividir PDF:", error);
		res.status(500).json({ error: "Erro ao dividir PDF" });
	}
};

exports.listarBoletos = async (req, res) => {
	try {
		const { nome, valor_inicial, valor_final, id_lote, relatorio } = req.query;

		// Construir filtros dinamicamente
		const where = {};
		if (nome) where.nome_sacado = { [db.Sequelize.Op.iLike]: `%${nome}%` };
		if (valor_inicial)
			where.valor = { [db.Sequelize.Op.gte]: parseFloat(valor_inicial) };
		if (valor_final)
			where.valor = {
				...where.valor,
				[db.Sequelize.Op.lte]: parseFloat(valor_final),
			};
		if (id_lote) where.id_lote = id_lote;

		// Buscar boletos no banco
		const boletos = await Boleto.findAll({ where });

		// Se relatorio=1, gerar PDF em base64
		if (relatorio === "1") {
			const pdfDoc = await PDFDocument.create();
			const page = pdfDoc.addPage();
			const { width, height } = page.getSize();
			const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
			let y = height - 50;

			page.drawText("Relatório de Boletos", { x: 50, y, size: 18, font });
			y -= 30;

			boletos.forEach((boleto) => {
				page.drawText(
					`ID: ${boleto.id} | Nome: ${boleto.nome_sacado} | Lote: ${boleto.id_lote} | Valor: ${boleto.valor} | Linha Digitável: ${boleto.linha_digitavel}`,
					{ x: 50, y, size: 12, font }
				);
				y -= 20;
			});

			const pdfBytes = await pdfDoc.save();
			const base64 = Buffer.from(pdfBytes).toString("base64");

			// Caminho do diretório onde o relatório será salvo
			const outputDir = path.join(__dirname, "../../boletos");

			// Verificar se o diretório existe, caso contrário, criá-lo
			if (!fs.existsSync(outputDir)) {
				fs.mkdirSync(outputDir, { recursive: true });
			}

			// Salvar o relatório em PDF no diretório
			const now = new Date();
			const formattedDate = `${String(now.getDate()).padStart(2, "0")}-${String(
				now.getMonth() + 1
			).padStart(2, "0")}-${now.getFullYear()}`;
			const formattedTime = `${String(now.getHours()).padStart(
				2,
				"0"
			)}:${String(now.getMinutes()).padStart(2, "0")}:${String(
				now.getSeconds()
			).padStart(2, "0")}`;

			const outputPath = path.join(
				outputDir,
				`relatorio (${formattedDate} ${formattedTime}).pdf`
			);
			fs.writeFileSync(outputPath, pdfBytes);

			return res.json({ base64 });
		}

		// Retornar boletos em JSON
		return res.json(boletos);
	} catch (error) {
		console.error("Erro ao listar boletos:", error);
		res.status(500).json({ error: "Erro ao listar boletos" });
	}
};
