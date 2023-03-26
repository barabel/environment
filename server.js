const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();
const port = 8890;

app.use(bodyParser.json());

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
});

app.use('/api', router);

// Модалка удачной отправки
router.post('/popup_success', (req, res) => {
	res.send({
		"type": "thankYou",
		"withoutClose": "true",
		"title": "Спасибо за заявку!",
		"description": "Ваше заявление отправлено, ждите звонка",
		"btn": {
			"title": "Вернуться к сайту"
		}
	});
});
