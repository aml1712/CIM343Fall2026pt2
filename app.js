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

app.post("/form", (req, res)=>{
    //res.send("form processed") //Not needed anymore
    const animal = req.body.animal; //animal selected from form

    //gives how many votes each animal has, starts at 0
    let votes = {
        narwhal:0,
        seal:0,
        penguin:0
    };

    //does cookie exist
    if(req.cookies.votes !== undefined) {
        votes = req.cookies.votes;
    }

    //if value is undefined, set to 0
    if(votes[animal] == undefined) {
        votes[animal] = 0;
    };

    votes[animal] = votes[animal] + 1; //increaes value by 1 when voted on the animal

    res.cookie("votes", votes, {maxAge: 7 * 24 * 60 * 60 * 1000}); //how long the cookie lives, days x hours x minutes

    res.render("response", {votes: votes}); 

});

app.delete("/clear", (req, res)=>{
    res.clearCookie("votes");
    res.send("Votes Cleared" + "<a href='/form'>Back to form</a>");

});









//adds token when name is entered to end of link
app.get("/:name", (req,res)=>{
    res.send("My name is: " + req.params.name);
})



















//end of code (LISTEN TO PORT)
app.listen(port, ()=> {
    console.log("Server Running at https://localhost:${port}");
}) 
