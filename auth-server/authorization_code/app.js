/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require("express"); // Express web server framework
var cors = require("cors");
var request = require("request"); // "Request" library
var querystring = require("querystring");
var cookieParser = require("cookie-parser");
const cheerio = require("cheerio");
var bodyParser = require("body-parser");
const axios = require("axios");

var client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
var client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
var redirect_uri = process.env.SPOTIFY_REDIRECT_URI; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = "spotify_auth_state";

var app = express();

app
  .use(express.static(__dirname + "/public"))
  .use(cookieParser())
  .use(cors())
  .use(
    bodyParser.urlencoded({
      extended: true
    })
  )
  .use(bodyParser.json());

app.get("/login", function(req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope =
    "user-read-private user-read-email user-read-playback-state playlist-modify-private playlist-modify-public";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      })
  );
});

app.get("/callback", function(req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch"
        })
    );
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code"
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer(client_id + ":" + client_secret).toString("base64")
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        var options = {
          url: "https://api.spotify.com/v1/me",
          headers: { Authorization: "Bearer " + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect(
          "http://localhost:3000/#" +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token
            })
        );
      } else {
        res.redirect(
          "/#" +
            querystring.stringify({
              error: "invalid_token"
            })
        );
      }
    });
  }
});

app.get("/refresh_token", function(req, res) {
  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64")
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        access_token: access_token
      });
    }
  });
});

app.post("/track-names", function(req, res) {
  const url = req.body.junoUrl;
  console.log("TCL: req.body", req.body);
  axios(url)
    .then(response => {
      console.log("TCL: response", response);
      const html = response.data;
      const $ = cheerio.load(html);
      const tracks = $(".juno-chart > .jd-listing-item > .col-12");
      const trackArray = [];

      tracks.each(function() {
        const artist = $(this)
          .find(".jq_highlight > .juno-artist > a")
          .text();
        const title = $(this)
          .find(".jq_highlight > .col > .juno-title")
          .text();
        if (artist && title) {
          trackArray.push({ artist, title });
        }
      });
      console.log("TCL: trackArray[2]", trackArray[2]);

      res.status(200).send([trackArray[0]]); // the status 200 is the default one, but this is how you can simply change it
    })
    .catch("error >>>", console.error);
});

app.post("/search-for-tracks", function(req, res) {
  const options = {
    headers: {
      Authorization: "Bearer " + req.body.accessToken
    }
  };

  console.log("TCL: req.body.tracks", req.body.tracks);

  const tracksToGet = req.body.tracks.map(track => {
    const title = track.junoResult.title
      .replace(/[()feat]/g, "")
      .split(" ")
      .map(word => word.trim())
      .join("%20");
    console.log("TCL: title", title);
    const url = `https://api.spotify.com/v1/search?q=track:${title}%20artist:${track.junoResult.artist}&type=track&market=GB`;
    return axios.get(url, options);
  });
  console.log("TCL: tracksToGet", tracksToGet);

  axios
    .all(tracksToGet)
    .then(response => {
      const tracksResponse = response.map((e, i) => ({
        id: i,
        spotifyTracks: e.data.tracks
      }));

      res.status(200).send(tracksResponse);
    })
    .catch("error >>>", console.error);
});

app.post("/create-playlist", function(req, res) {
  const getOptions = {
    url: "https://api.spotify.com/v1/me",
    headers: {
      Authorization: "Bearer " + req.body.accessToken
    }
  };

  request.get(getOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log("TCL: req.body.playlistId", req.body.playlistId);
      if (req.body.playlistId) {
        createPlaylist(req.body.playlistId);
      } else {
        const parsedBody = JSON.parse(body);
        const createOptions = {
          url: `https://api.spotify.com/v1/users/${parsedBody.id}/playlists`,
          body: JSON.stringify({
            name: req.body.playlistName,
            public: false
          }),
          dataType: "json",
          headers: {
            Authorization: "Bearer " + req.body.accessToken,
            "Content-Type": "application/json"
          }
        };
        request.post(createOptions, function(error, response, body) {
          const parsedBody = JSON.parse(body);
          if (!error) {
            createPlaylist(parsedBody.id);
          } else {
            console.log("error creating playlist", error);
          }
        });
      }

      function createPlaylist(playlistId) {
        const updateOptions = {
          url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
          body: JSON.stringify({
            uris: req.body.trackUris
          }),
          dataType: "json",
          headers: {
            Authorization: "Bearer " + req.body.accessToken,
            "Content-Type": "application/json"
          }
        };
        request.post(updateOptions, function(error, response, body) {
          if (!error) {
            console.log("Success. Tracks were added to playlist", body);
          } else {
            console.log("error adding tracks to playlist", error);
          }
        });
      }
    } else {
      console.log("error getting user ID", error);
    }
  });
});

console.log("Listening on 8888");
app.listen(8888);
