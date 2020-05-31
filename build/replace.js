const path = require('path');
const fs = require('fs');

let file = path.join(__dirname, '../dist/assets/css/app.css');

fs.readFile(file, "utf-8", function (err, data) {
	if (err)
		return console.log(err);

	console.log(file + " File content before replace: '\/assets'");
	// console.log(data);

	var renameMe = "\/assets";
	var re = RegExp(renameMe, "g");

	data = data.replace(re, "..");
	fs.writeFileSync(file, data);

	console.log(file + " File content after replace: '..' ");
	// console.log(data);
});