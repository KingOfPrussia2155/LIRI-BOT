require("dotenv").config();


var keys = require("./keys.js");
var request = require("request");
var fs = require("fs");
var action = process.argv[2];
var userInput = process.argv.slice(3).join("+");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var moment = require("moment");


switch (action) {
    case "movie-this":
        movieThis(userInput);
        break;
    case "spotify-this-song":
        spotifyThis(userInput);
        break;
    case "concert-this":
        concertThis(userInput);
        break;
    case "do-what-it-says":
        doIT();
        break;
    default:
        return console.log("FAIL");
}

function movieThis() {

    var queryUrl = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("\n---------------------------------\n")
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Produced In: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("\n---------------------------------\n")

        } else {
            console.log("\n---------------------------------\n")
        }

    });
}

function concertThis() {

    var concertURL = ("https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp")
    request(concertURL, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("\n---------------------------------\n")
            console.log("Venue: " + JSON.parse(body)[0].venue.name);
            console.log("Location: " + JSON.parse(body)[0].venue.city + ", " + JSON.parse(body)[0].venue.country);
            console.log("Event Date: " + moment(body[0].datetime).format("MM/DD/YYYY"));
            console.log("\n---------------------------------\n")
        }
    });
}

function spotifyThis() {

    if (!userInput) {

        userInput = "Apples and Bananas"
    }

    spotify.search({ type: 'track', query: userInput }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("\n---------------------------------\n")
        console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
        console.log("Song: " + data.tracks.items[0].name);
        console.log("Preview: " + data.tracks.items[0].preview_url);
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("\n---------------------------------\n")

        fs.appendFile("log.txt", "\nAppending this song and artist data: " + 
			"\n" + data.tracks.items[0].album.artists[0].name + 
			"\n" + data.tracks.items[0].name + 
			"\n" + data.tracks.items[0].album.external_urls.spotify + 
			"\n" + data.tracks.items[0].album.name, function(err) {
				if (err) {
					console.log(err);
				}
			})

    });
}

function doIT() {

    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        } else {
            var dataArr = data.split(",");
            userInput = dataArr[1];
            action = dataArr[0];

            if (action === "movie-this") {
                movieThis();
            } else if (action === "spotify-this-song") {
                spotifyThis();
            } else {
                concertThis();
            }
        }

        fs.appendFile("log.txt", "User has accessed random file.", function (err) {
            if (err) {
                console.log(err);
            }
        })
    });
}