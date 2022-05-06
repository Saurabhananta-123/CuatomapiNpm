const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const https = require("https");

const express = require("express");

const app = express();

const port = process.env.PORT || 8000;

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});

const gettimestorie = [];

request("https://time.com/", (error, response, html) => {
	if (!error && response.statusCode == 200) {
		const $ = cheerio.load(html);
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
	}

	const jsondata = JSON.stringify(gettimestorie, null, 2);
	fs.writeFile("data.json", jsondata, (err) => {
		if (err) throw err;
		console.log("Data written to file");
	});

	app.get("/getTimeStories", (req, res) => {
		fs.readFile("data.json", (err, data) => {
			if (err) throw err;

			res.end(data);
		});
	});
});
