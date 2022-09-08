const got = require('got');
const util = require("../modules/util.js");

async function getTopHeadlines(limit) {

    try {
        const {body} = await got("https://newsapi.org/v2/top-headlines", {
            searchParams: {
                country: "nz",
                apiKey: "07d7a317a6b3448d87843f58cec91613"
            },
            responseType: "json"
        });

        let limitInt = parseInt(limit);
        const articles = body.articles;
        const totalResults = articles.length;

        if (limitInt === Number.NaN) {
            limitInt = 1;
        }
        if (limitInt > totalResults) {
            limitInt = totalResults;
        }

        let topArticles = [];
        let randIntArray = util.getArrayOfRandomIntegers(0, totalResults - 1, limitInt);

        randIntArray.forEach(function (index) {
            topArticles.push(articles[index]);
        });

        return topArticles;

    } catch (error) {
        console.log(error);
    }

    return null;

}

module.exports = {getTopHeadlines};