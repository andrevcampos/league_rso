var http = require('http');
var url = require('url');
const request = require('request');

var clientID        = "oceaniaesportsgg",
    clientSecret    = "wxWC4HTxchtC9T95nmRBHC3RXw12hOCvLE9W1l6OJbo";

var appBaseUrl      = "https://oceaniaesports.gg",
    appCallbackUrl  = appBaseUrl + "/lol-redirect";

var provider        = "https://auth.riotgames.com",
    authorizeUrl    = provider + "/authorize",
    tokenUrl        = provider + "/token";

var server = http.createServer(function(req, res) {

    var queryData = url.parse(req.url, true).query;
    var buf = Buffer.from(queryData.code, 'base64').toString();
    var codemy2 = "oceaniaesportsgg:"+clientSecret;
    var codemy = Buffer.from(codemy2).toString('base64');
    //var codemy1 = "Basic " + Base64Encode(codemy2);

    request.post({
        url: tokenUrl,
        headers: { "Authorization": "Basic " + codemy},
        // auth: { // sets "Authorization: Basic ..." header
        //     user: clientID,
        //     pass: clientSecret
        // },
        form: { // post information as form-data
            grant_type: "authorization_code",
            code: queryData.code,
            redirect_uri: appCallbackUrl
        }
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // parse the response to JSON
            var payload = JSON.parse(body);

            // separate the tokens from the entire response body
            var tokens = {
                refresh_token:  payload.refresh_token,
                id_token:       payload.id_token,
                access_token:   payload.access_token
            };

            res.writeHead(200, {'Content-Type': 'text/plain'});
            var message = "Sucess",
                version = tokens + '\n',
                response = [message, version].join('\n');
            res.end(response);
            
        } else {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            var message = "Error",
                version = response.statusCode + '\n' + buf + "\n" + codemy + "\n" + codemy,
                response = [message, version].join('\n');
            res.end(response);
            
        }
    });

});
server.listen();

// var http = require('http');
// const axios = require("axios")
// const fastify = require("fastify")()
// const examplesecret = "wxWC4HTxchtC9T95nmRBHC3RXw12hOCvLE9W1l6OJbo"
// var queryData = url.parse(req.url, true).query;

// var server = http.createServer(function(req, res) {
//     const formData = new URLSearchParams()
//     formData.append('grant_type', "authorization_code")
//     formData.append('code', queryData.code)
//     formData.append('redirect_uri', "https://oceaniaesports.gg/authorize")
//     const tokens = await axios.post("https://auth.riotgames.com/token", formData, {
//         headers: {
//             "Authorization": `Basic ${Buffer.from(`oceaniaesportsgg:${examplesecret}`).toString("base64")}`
//          }
//     }).catch(error => console.error(error))
//     console.log(tokens.data)
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     var message = 'It works2!\n',
//         version = req.url + queryData.code + ' NodeJS ' + process.versions.node + '\n',
//         response = [message, version].join('\n');
//     res.end(tokens.data);
// })

// server.listen();