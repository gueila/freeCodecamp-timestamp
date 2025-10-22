// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});

// your first API endpoint... 
app.get("/api/:date?", function (req, res) {
  console.log("params", req.params);
  const error = { error: "Invalid Date" }
  let date = new Date(req.params.date)
  console.log(date, date.valueOf());
  let dateUnix = date.getTime()
  if (!date.valueOf()) {
    console.log("SEARCH");

    const dateInt = parseInt(req.params.date)
    if (!req.params.date) {
      const newDate = new Date()
      return res.json({ unix: newDate.getTime(), utc: newDate.toUTCString() })
    }
    if (req.params?.date?.length !== dateInt?.toString().length) {
      return res.json(error)
    }
    dateUnix = dateInt
    date = new Date(dateInt)
  }
  const utc = `${date.toUTCString()}`
  const response = { unix: dateUnix, utc: date.toUTCString() }
  console.log("RES", utc, response);
  res.json(response);
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3001, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// http://localhost:3001/api/2016-12-25
// http://localhost:3001/api/1451001600000
// http://localhost:3001/api/05 October 2011, GMT
// http://localhost:3001/api/this-is-not-a-date
// http://localhost:3001/api/undefined
// params { date: '2016-12-25' }
// RES { unix: 2016, utc: 1970-01-01T00:00:02.016Z }
// params { date: '2016-12-25' }
// RES { unix: 2016, utc: 1970-01-01T00:00:02.016Z }
// params { date: '1451001600000' }
// RES { unix: 1451001600000, utc: 2015-12-25T00:00:00.000Z }
// params { date: '05 October 2011, GMT' }
// RES { unix: 5, utc: 1970-01-01T00:00:00.005Z }
// params { date: 'this-is-not-a-date' }
// RES { unix: NaN, utc: Invalid Date }
// params { date: undefined }
// RES { unix: NaN, utc: Invalid Date }
// params { date: undefined }
// RES { unix: NaN, utc: Invalid Date }