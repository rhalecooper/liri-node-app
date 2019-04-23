require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");
pa = process.argv;

var command = pa[2];
if (pa.length >= 1) {
   var inputName = pa[3];
} else {
    inputname = ""
}

if (command === 'spotify-this-song') {

    console.log("Ok, ready to", command)

    // node liri.js spotify-this-song 'The Sign'
    // * Artist(s)
    // * The song's name
    // * A preview link of the song from Spotify
    // * The album that the song is from

    var songName = "The Sign";
    if (inputName > "") {songName = inputName}
    console.log ("Searching Spotify for the song ...", songName)
    var newSpotify = new Spotify(keys.spotify);
    newSpotify.search({
        type: 'track',
        query: songName,
        limit: 50,
        market: "US"
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var songData = data;
        console.log('We found ' + songData.tracks.total + ' possible tracks!');
        var trackList = songData.tracks.items;

        var isTrackNotFound = true;
        for (i = 0; i < trackList.length; i++) {
            if (trackList[i].name === songName) {
                isTrackNotFound = false;
                var artistArray = trackList[i].artists
                var artistString = artistArray[0].name 
                for (j=1;j<artistArray.length;j++) {
                    artistString = artist + ', ' + artistArray[j].name 
                }
                console.log(" ");
                console.log("Artist(s):    ", artistString);
                console.log("Song's name:  ", trackList[i].name);
                console.log("Preview link: ", trackList[i].preview_url);
                console.log("Album Name:   ", trackList[i].album.name);
            }
        }
        if (isTrackNotFound) {
            console.log("No track was found matching ...", songName)
        }
    });

} else if (command === 'movie-this') {

    // node liri.js movie-this 'The Avengers'
    // node liri.js movie-this  Gone+With+The+Wind

    var movieName = inputName.split(' ').join('+');
    var movieUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    axios.get(movieUrl).then(
        function (response) {
            console.log(`node liri.js movie-this ${movieName}`)
            showMovie(response)
        }
    );


} else if (command === 'concert-this') {

    // node liri.js concert-this 'Maroon 5'

    // * Name of the venue
    // * Venue location
    // * Date of the Event (use moment to format this as "MM/DD/YYYY")


    var artistName = inputName.split(' ').join('+');;
    var bandUrl = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";

    axios.get(bandUrl).then(
        function (response) {
            console.log(`node liri.js concert-this  ${artistName}`)
            var venueName = ''
            var venueLocation = ''
            var dateOfTheEvent = ''
            var dataArray = response.data


            for (i = 0; i < dataArray.length; i++) {

                var responseData = response.data[i]

                var venueName = responseData.venue.name
                var venueLocation = responseData.venue.city + ', ' + responseData.venue.country
                var dateOfTheEvent = responseData.datetime;

                console.log(" ");
                console.log("Name of the venue:", venueName);
                console.log("Venue location:", venueLocation);
                console.log("Date of the Event", dateOfTheEvent);

            }
            console.log(" ");
            //console.log (responseData);
        }
    );
}

function showMovie(response) {

    // * Title of the movie.
    // * Year the movie came out.
    // * IMDB Rating of the movie.
    // * Rotten Tomatoes Rating of the movie.
    // * Country where the movie was produced.
    // * Language of the movie.
    // * Plot of the movie.
    // * Actors in the movie.


    temp = response.data.Ratings
    var rottenTomatos = " ";
    for (i = 0; i < temp.length; i++) {
        var Source = String(temp[i].Source);
        if (Source.toLowerCase() === "rotten tomatoes") {
            console.log("Source is ", Source.toLowerCase())
            var rottenTomatos = response.data.Ratings[i].Value
        }
    }
    console.log(`
    Title: ${response.data.Title}
    Year Movie came out: ${response.data.Year}
    Rated:  ${response.data.Rated}
    IMDB Rating: ${response.data.imdbRating}
    Rotten Tomatoes Rating : ${rottenTomatos}
    Country: ${response.data.Country}
    Language:${response.data.Language}
    Plot: ${response.data.Plot}
    Actors: ${response.data.Actors}
    Box Office: ${response.data.BoxOffice}
    `)

}