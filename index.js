const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const cadastroSocios = require('./model/CadastroSocios');
const pagamento = require('./model/PagamentoMensal');

//database
connection
	.authenticate()
	.then(() => {
		console.log('Conexão feita com o banco de dados!');
	})
	.catch((msgErro) => {
		console.log(msgErro);
	});

//express => use EJS como View engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//rotas
app.get('/', async (req, res) => {
	const cadastros = await cadastroSocios.findAll({
		raw: true,
		order: [
			[ 'id', 'desc' ] //DESC = Decrescente e ASC = Crescente
		]
	});
	res.render(cadastros);
});

app.get('/cadastrar', (req, res) => {
	res.render('inicialClube');
});

app.post('/salvarCadastro', (req, res) => {
	var nome = req.body.nome;
	var sobrenome = req.body.sobrenome;
	var dtNasc = req.body.dtNasc;
	var email = req.body.email;
	var telefone = req.body.telefone;
	var endereco = req.body.endereco;

	cadastroSocios
		.create({
			nome: nome,
			sobrenome: sobrenome,
			dtNasc: dtNasc,
			email: email,
			telefone: telefone,
			endereco: endereco
		})
		.then(() => {
			res.redirect('/');
		});
});

app.get('/cadastrarPagamento', (req, res) => {
	res.render('pagamento');
});

app.post('/salvarPagamento', (req, res) => {
	var descricaoPagamento = req.body.descricaoPagamento;

	pagamento
		.create({
			descricaoPagamento: descricaoPagamento
		})
		.then(() => {
			res.redirect('/');
		});
});

app.listen(8081, () => console.log('No ar!'));
