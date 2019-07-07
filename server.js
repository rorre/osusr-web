// init project
const rateLimit = require("express-rate-limit");
const express = require('express');
const app = express();
const {
    exec
} = require('child_process');
const fs = require('fs');
const req = require('request');
var limit = {
    count: 10
}
const limiter = rateLimit({
  windowMs: 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 100 requests per windowMs
  message: {
    "err": "slow down bro"
  }
});

// osu! API key
const apiKey = process.env.apikey
     
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use("/c", limiter)

app.get("/", (request, response) => {
    response.sendFile(__dirname + '/views/index.html')
})

app.get('/c', function(request, response) {
    if (limit.count == 0) {
        response.status(503).json({
            "err": "Server is busy, try again later."
        })
        return
    }
    console.log("[INFO] Current limit: " + limit.count)
    // Check if user exists in query param
    if (!request.query.user) {
        response.status(400).json({
            "err": "Requires user in query"
        })
        return
    }
    limit.count--
    console.log("[INFO] Got request with user: " + request.query.user)
    console.log("[INFO] Asking osu! API...")

    // Requests osu! API for user
    // Used to workaround any usernames started with minus confused as parameter in PerformanceCalculator
    req("https://osu.ppy.sh/api/get_user?k=" + apiKey + "&u=" + request.query.user,
        function(error, resp, body) {
            // Check if Error
            if (error) {
                response.status(400).json({
                    err: error
                })
                limit.count++
                return
            }
            console.log("[INFO] Got message from osu! API")
            // Body isn't JSON so parse it
            var js = JSON.parse(body)
            if (js.length == 0) {
                console.log("[ERR] User not found")
                response.status(400).json({
                    err: "User not found."
                })
                limit.count++
                return
            }
            const user = js[0].user_id

            console.log("[INFO] Running PerformanceCalculator with user: " + user)
            exec(`./p/PerformanceCalculator profile "${user}" ${apiKey} --json`, (err, stdout, stderr) => {
                if (err) {
                    response.status(500).json({
                        //"err": err,
                        "stderr": stderr,
                        "stdout": stdout
                    })
                    limit.count++
                    return;
                }

                var j = JSON.parse(stdout)
                response.json(j)
                limit.count++
                console.log("[END] ---")
            });
        })
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});
