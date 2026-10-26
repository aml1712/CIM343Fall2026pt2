const express = require("express"); //require express to load
const app = express(); //app variable becomes how you access express framework
const port = 3000; //creates port


app.get("/", (req, res)=>{
    res.send("Hello from express");


});

//when in browser, add /hello to end of link to open this page 
app.get("/hello", (req,res)=>{
    res.send("hello world"); 
})

//adds token when name is entered to end of link
app.get("/:name", (req,res)=>{
    res.send("My name is: " + req.params.name);

})
















//end of code (LISTEN TO PORT)
app.listen(port, ()=> {
    console.log("Server Running at https://localhost:${port}");
}) 
