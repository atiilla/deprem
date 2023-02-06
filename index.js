const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const cheerio = require('cheerio');
const fetch = require('node-fetch');
io.on('connection', (socket) => {
    console.log('a user connected');
});

const GetEarthquakeData = async () => {
    let data = await fetch('https://deprem.afad.gov.tr/last-earthquakes.html');
    let html = await data.text();
    let $ = cheerio.load(html);
    let table = $('table').eq(0);
    let rows = table.find('tr');
    let result = [];
    rows.each((index, row) => {
        // get first 3 rows only
        if (index < 5) {
            let cols = $(row).find('td');
            let data = {
                date: $(cols[0]).text(),
                time: $(cols[1]).text(),
                latitude: $(cols[2]).text(),
                longitude: $(cols[3]).text(),
                depth: $(cols[4]).text(),
                magnitude: $(cols[5]).text(),
                location: $(cols[6]).text(),
            };
            if(data.date != ''){
                result.push(data);
            }
           
        }
        // lastThreeRows.each((index, row) => {
        //     let cols = $(row).find('td');
        //     let data = {
        //         date: $(cols[0]).text(),
        //         time: $(cols[1]).text(),
        //         latitude: $(cols[2]).text(),
        //         longitude: $(cols[3]).text(),
        //         depth: $(cols[4]).text(),
        //         magnitude: $(cols[5]).text(),
        //         location: $(cols[6]).text(),
        //     };
        //     console.log(data);
        // });
     
    }
    );
    return result;
};

setInterval(() => {
    GetEarthquakeData().then((data) => {
        io.emit('data', data);
    });
    // fetch('https://jsonplaceholder.typicode.com/posts')
    //     .then((response) => response.json())
    //     .then((data) => {
    //         io.emit('data', data);
    //     });
}, 1000);

app.get('/', (req, res) => {
   
    res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});