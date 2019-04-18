require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");
pa = process.argv;

var command = pa[2];
var inputName = pa[3];

if (command === 'spotify-this-song') {

    console.log("command was", command)
    var songName = inputName;
    var newSpotify = new Spotify(keys.spotify);
    newSpotify.search({
        type: 'track',
        query: songName
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(data);
        console.log('I We found ' + data.tracks.total + ' tracks!');
        var trackList = data.tracks.items;
        //console.log ("trackList", trackList)
        trackList.forEach(
            function (track, index) {
                console.log(index + ': ' + track.name + ' (' + track.popularity + ')')
            }
        )

    });

} else if (command === 'movie-this') {

    // node liri.js movie-this 'Gone With The Wind'
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


            for (i=0; i<dataArray.length; i++) {

                var responseData = response.data[i]
                
                var venueName = responseData.venue.name
                var venueLocation = responseData.venue.city + ', ' + responseData.venue.country
                var dateOfTheEvent = responseData.datetime;
                
                console.log (" ");
                console.log ("Name of the venue:", venueName);
                console.log ("Venue location:", venueLocation);
                console.log ("Date of the Event", dateOfTheEvent);
                
            }
            console.log (" ");
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

    if (response.data.Ratings.length >= 1) {
        var rottenTomatos = response.data.Ratings[1].Value
    } else {
        var rottenTomatos = " "
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