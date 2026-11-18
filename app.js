const express = require("express"); //require express to load
const app = express(); //app variable becomes how you access express framework
const port = 3000; //creates port
const cookieParser = require("cookie-parser"); //loads cookie parser into applicatiom


app.set("view engine", "hbs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


app.get("/", (req, res)=>{
    res.send("Hello from express");
});

//when in browser, add /hello to end of link to open this page 
app.get("/hello", (req,res)=>{
    res.send("hello world"); 
})

//looks for home.hbs symbolic link
app.get("/home", (req, res)=>{
    res.render("home", {title: "My home page"});
})


app.get("/form", (req, res)=>{
    res.render("survey", {title: "Survey"});
});


//TRACKER APP ASSIGNMENT CODE PART 1
app.get("/tracker/v1", (req, res) => {
    res.send(`

        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <title>CoastalSteps | Daily Tracker</title>

            <style>
            * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    font-family: Arial, sans-serif;
                    background: #eaf5fa;
                    color: #193c54;
                }

                header {
                    background: linear-gradient(135deg, #b8e1ef, #6bb5d0);
                    padding: 35px 20px;
                    text-align: center;
                }header h1 {
                    margin: 0;
                    font-size: 36px;
                    color: #174d6b;
                }

                header p {
                    color: #285d76;
                }

                .container {
                    max-width: 550px;
                    margin: 40px auto;
                    padding: 30px;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 5px 20px rgba(40, 100, 130, 0.10);
                }

                h2 {
                    margin-top: 0;
                    color: #236b8e;
                }

                label {
                    display: block;
                    margin-top: 20px;
                    margin-bottom: 8px;
                    font-weight: bold;
                } input, select {
                    width: 100%;
                    padding: 13px;
                    border: 1px solid #c5dfe9;
                    border-radius: 10px;
                    font-size: 16px;
                    background: #f7fbfd;
                }

                button {
                    width: 100%;
                    margin-top: 25px;
                    padding: 15px;
                    border: none;
                    border-radius: 12px;
                    background: #398eb5;
                    color: white;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                }

                button:hover {
                    background: #246c91;
                }

                .dashboard-link {
                    display: block;
                    text-align: center;
                    margin-top: 20px;
                    color: #398eb5;
                    text-decoration: none;
                }

            </style>
        </head>

        <body>

            <header>
                <h1>CoastSteps</h1>
                <p>Move with the rhythm of the coast.</p>
            </header>

            <div class="container">

                <h2>Log Your Activity</h2>

                <p>Keep track of your daily movement and progress.</p>

                <form action="/tracker/v1" method="POST">

                    <label for="date">Activity Date</label>
                    <input type="date" id="date" name="date" required>

                    <label for="steps">Number of Steps</label>
                    <input type="number" id="steps" name="steps"
                        placeholder="Enter your steps"
                        min="1" step="1" required>

                    <label for="activity">Activity Type</label>

                    <select id="activity" name="activity" required>

                        <option value="">Select activity</option>
                        <option value="Walking">Walking</option>
                        <option value="Running">Running</option>
                        <option value="Hiking">Hiking</option>
                        <option value="Treadmill">Treadmill</option>
                        <option value="Other">Other</option>

                    </select>

                    <button type="submit">Save Entry</button>

                </form>

                <a class="dashboard-link" href="/tracker/v1/dashboard">
                    View My Dashboard
                </a>

            </div>

        </body>
        </html>

    `);

});


























//BASKTEBALL SURVEY CODE HW ASSIGNMENT

app.post("/form", (req, res)=>{
    const team = req.body.team; //team selected from form
    const player = req.body.player; //player elected from form

    //gives how many votes each animal has, starts at 0
    let teamVotes = {
        "Miami Heat":0,
        "Los Angeles Lakers":0,
        "Golden State Warriors":0,
        "New York Knicks":0,
        "Washington Wizards":0,
        "Philly 76ers":0,
        "Other":0
    };

    let playerVotes = {
        "Giannis Antetokounmpo":0,
        "Lebron James":0,
        "Steph Curry":0,
        "Kevin Durant":0,
        "Dwayne Wade":0,
        "Draymond Green":0,
        "Jordan Poole":0,
        "Other":0
    };


    //does cookie exist
    if(req.cookies.teamVotes !== undefined) {
        teamVotesotes = req.cookies.teamVotesotes;
    }

    if(req.cookies.playerVotes !== undefined) {
        playerVotes = req.cookies.playerVotes;
    }


    //if value is undefined, set to 0
    if(teamVotes[team] == undefined) {
        teamVotes[team] = 0;
    };

    if(playerVotes[player] == undefined) {
        playerVotes[player] = 0;
    };


    teamVotes[team] = teamVotes[team] + 1; //increaes value by 1 when voted on
    playerVotes[player] = playerVotes[player] + 1;


    res.cookie("teamVotes", teamVotes, {maxAge: 7 * 24 * 60 * 60 * 1000}); //how long the cookie lives, days x hours x minutes
    res.cookie("playerVotes", playerVotes, {maxAge: 7 * 24 * 60 * 60 * 1000});

    res.render("response", {
        team: team,
        player: player,
        teamVotes: teamVotes,
        playerVotes: playerVotes
});

});


app.delete("/clear", (req, res)=>{
    res.clearCookie("teamVotes");
    res.clearCookie("playerVotes");
    res.send("Votes Cleared" + "<a href='/form'>Back to form</a>");

});



//adds token when name is entered to end of link
app.get("/:name", (req,res)=>{
    res.send("My name is: " + req.params.name);
});



//end of code (LISTEN TO PORT)
app.listen(port, ()=> {
    console.log('Server Running at https://localhost:${port}');
}); 
