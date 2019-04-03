var express = require('express');
var router = express.Router();

router.use(express.static(__dirname + '/../assets'));
router.use(express.static(__dirname + '/../'));
router.use(express.static(__dirname + '/../node_modules/'));
router.use(express.static(__dirname + '/../css'));
router.use(express.static(__dirname + '/../templates/pages'));
router.use(express.static(__dirname + '/../templates/modals'));
router.use(express.static(__dirname + '/../templates/components'))

router.get('/', function (req, res){
	res.sendFile("index.html", { "root": './' })
});

module.exports = router;