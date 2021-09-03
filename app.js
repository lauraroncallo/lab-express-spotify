require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID, //dotenv --> process.env (allows us to access); never push credentials to gitHub.
    clientSecret: process.env.CLIENT_SECRET // thats why we have the .env file
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
  
// Our routes go here:
//1. Create a route / index; render a view valled index.hbs and create a form with artistName field
//this form should redirect to /artist-search with a querystring http://localhost:3000?artistName="aslgn"

app.get("/", (req, res) => {
    res.render("index");
});

// 2. Create an /artist-search route. on this route get the Artist Name that comes from the query
//pass that artists name to 

// spotifyApi
//  .searchArtists(/*'HERE GOES THE QUERY ARTIST'*/)
//  .then(data => {
 //   console.log('The received data from the API: ', data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
//  })
 // .catch(err => console.log('The error while searching artists occurred: ', err));


app.get('/artist-search', async (req, res) => {
const data = await spotifyApi.searchArtists(req.query.artistName)
console.log(data.body.artists);
const allArtists = data.body.artists.items;
res.render("artist-search-results", { allArtists });
//create a artist-search-results view
//render that view passing allArtists; iterate through all artists in the view (each)
//display their name and id

  });

  app.get("/albums/:artistID", async (req, res) => {
      const data = await spotifyApi.getArtistAlbums(req.params.artistID);
      console.log(data.body);
      const allAlbums = data.body.items;
      res.render('albums', {allAlbums});
  });

  app.get("/albums/tracks/:albumID", async (req, res) => {
    const data = await spotifyApi.getAlbumTracks(req.params.albumID);
    console.log(data.body);
    const allTracks = data.body.items;
    res.render('tracks', {allTracks});
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

/*
console.log(data.body.artists.albums);
      const allAlbums = data.body.artists.albums.items;
    res.render("albums", { allAlbums });
    */