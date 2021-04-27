const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const Speech = require("ssml-builder");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.text());
var temperature ="0";
function getResObject(outputSpeech) {
    return {
        "version": "1.0",
        "sessionAttributes": {

        },
        "response": {
            "outputSpeech": {
                "type": "SSML",
                "ssml": `<speak>${outputSpeech}</speak>`,
            },
            "shouldEndSession": true
        }
    }
}

//data setting routes
app.post("/set-temperature",(req,res)=>{
    var temp = req.body;
    console.log(temp);
    temperature = temp;
    res.sendStatus(200);
})


//alexa skills routes
app.post("/crackwatch", (req, res) => {
    console.log(req.body);
    var speech = new Speech();
    fetch("https://api.crackwatch.com/api/games?page=0&is_cracked=true")
        .then(response => response.json())
        .then(body => {
            console.log(body);
            speech.say("los ultimos juegos crackeados son los siguientes:")
                .pause("300ms");
            for (let game of body.slice(0, 3)) {
                speech.say(game.title).pause("300ms");
            }
        }).catch((err) => {
            speech.say("Error al obtener los ultimos juegos crackeados");
        }).then(() => {
            res.json(getResObject(speech.ssml(true)));
        })
});

app.post("/temperature",(req,res)=>{
    var speech = new Speech();
    speech.say(`La temperatura del cuarto es de: ${temperature} grados celcius`)
    .pause("300ms");
    res.json(getResObject(speech.ssml(true)));
})



app.listen(9654, () => {
    console.log("listening on port 9654");
});