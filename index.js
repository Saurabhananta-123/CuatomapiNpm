const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");

const http = require("http");

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	fs.readFile("data.json", (err, data) => {
		if (err) throw err;

		res.end(data);
	});
});

server.listen(port, () => {
	console.log(`Server running at port ${port}`);
});

const gettimestorie = [];

axios("https://time.com/").then((response) => {
	const htmldata = response.data;
	const $ = cheerio.load(htmldata);

	const title = $(".latest-stories__heading").text();
	const letsee = $(".latest-stories__item a").each((i, el) => {
		const title = $(el).text().replace(/\s\s+/g, " ");
		const Url = $(el).attr("href").replace(/\s\s+/g, " ");

		gettimestorie.push({
			title: title,
			Url: Url,
		});
	});

	console.log(gettimestorie);
	const jsondata = JSON.stringify(gettimestorie, null, 2);
	fs.writeFile("data.json", jsondata, (err) => {
		if (err) throw err;
		console.log("Data written to file");
	});
});
