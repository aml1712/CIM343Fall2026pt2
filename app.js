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
    console.log("Server Running at https://localhost:${port}");
}); 
