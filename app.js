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





// --------------------------------------------------------------------------------------------------------------------- //


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

//TRACKER APP ASSIGNMENT CODE PART 1 POST ROUTE
app.post("/tracker/v1", (req, res) => {
    const date = req.body.date;
    const steps = Number(req.body.steps);
    const activity = req.body.activity;

    const validActivities = [
        "Walking",
        "Running",
        "Hiking",
        "Treadmill",
        "Other"
    ];

     if (
        !date ||
        !Number.isSafeInteger(steps) ||
        steps <= 0 ||
        !validActivities.includes(activity) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(date)
    ) {
        return res.status(400).send("Invalid entry. Please check your information.");
    }

    let entries = [];

    try {
        entries = JSON.parse(req.cookies.stepTracker_v1 || "[]");

        if (!Array.isArray(entries)) {
            entries = [];
        }

    } catch (error) {
        entries = [];
    }

    const newEntry = {
        date: date,
        steps: steps,
        activity: activity
    };

    entries.push(newEntry);

    entries.sort((a, b) => a.date.localeCompare(b.date));
    entries = entries.slice(-30);

    res.cookie("stepTracker_v1", JSON.stringify(entries), {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax"
    });

    res.redirect("/tracker/v1");

});


//TRACKER APP ASSIGNMENT CODE PART 1 DASHBOARD
app.get("/tracker/v1/dashboard", (req, res) => {
    let entries = [];

    try {
        entries = JSON.parse(req.cookies.stepTracker_v1 || "[]");

        if (!Array.isArray(entries)) {
            entries = [];
        }

    } catch (error) {
        entries = [];
    }
     const dailyGoal = 10000;
     const dates = entries.map(entry => entry.date).sort();
    const latestDate = dates.length > 0
        ? dates[dates.length - 1]
        : null;

         const dailyEntries = entries.filter(entry => {
        return entry.date === latestDate;
    });

    const totalSteps = dailyEntries.reduce((total, entry) => {
        return total + Number(entry.steps);
    }, 0);

    const progress = Math.min((totalSteps / dailyGoal) * 100, 100);
    const progressText = Math.round((totalSteps / dailyGoal) * 100);

     const formattedDate = latestDate
        ? new Date(latestDate + "T00:00:00Z").toLocaleDateString(
            "en-US",
            { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }
        )
        : "No activity recorded yet";

         const miles = (totalSteps / 2000).toFixed(2);

          const activityList = entries.slice().reverse().map(entry => {
        return `
            <li>
                <strong>${entry.activity}</strong>
                <span>${entry.steps.toLocaleString()} steps</span>
                <small>${entry.date}</small>
            </li>
        `;
    }).join("");

    const chartEntriesJson = JSON.stringify(entries).replace(/</g, "\\u003c");

     res.send(`

        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <title>CoastSteps | Dashboard</title>
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

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
                    padding: 30px;
                    text-align: center;
                }

                header h1 {
                    margin: 0;
                    color: #174d6b;
                    font-size: 34px;
                }

                header p {
                    color: #285d76;
                }

                .container {
                    max-width: 850px;
                    margin: 35px auto;
                    padding: 20px;
                }

                .card {
                    background: white;
                    border-radius: 20px;
                    padding: 25px;
                    margin-bottom: 22px;
                    box-shadow: 0 5px 20px rgba(40, 100, 130, 0.08);
                }

                h2 {
                    color: #236b8e;
                }

                .summary {
                    text-align: center;
                }

                .ring {
                    width: 190px;
                    height: 190px;
                    border-radius: 50%;
                    background: conic-gradient(
                        #399ebc ${progress}%,
                        #e5f1f5 ${progress}%
                    );
                    margin: 25px auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .ring-inner {
                    width: 155px;
                    height: 155px;
                    border-radius: 50%;
                    background: white;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                .ring-inner strong {
                    font-size: 29px;
                    color: #236b8e;
                }

                .ring-inner span {
                    color: #7294a5;
                    font-size: 14px;
                }

                .stats {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                }

                .stat {
                    background: #f0f8fb;
                    padding: 20px;
                    border-radius: 15px;
                    text-align: center;
                }

                .stat strong {
                    display: block;
                    font-size: 25px;
                    color: #398eb5;
                    margin-bottom: 7px;
                }

                .stat span {
                    color: #638394;
                    font-size: 13px;
                }

                ul {
                    list-style: none;
                    padding: 0;
                }

                li {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    gap: 8px;
                    padding: 15px 0;
                    border-bottom: 1px solid #e5f0f4;
                }

                li small {
                    color: #7294a5;
                }

                .button {
                    display: block;
                    text-align: center;
                    text-decoration: none;
                    padding: 15px;
                    border-radius: 12px;
                    background: #398eb5;
                    color: white;
                    font-weight: bold;
                    margin-top: 20px;
                }

                .button:hover {
                    background: #246c91;
                }

                @media (max-width: 600px) {
                    .stats {
                        grid-template-columns: 1fr;
                    }
                }

            </style>
        </head>

        <body>

            <header>
                <h1>CoastSteps</h1>
                <p>Your movement, your progress.</p>
            </header>

            <div class="container">

                <div class="card summary">

                    <h2>Daily Activity</h2>

                    <p>${formattedDate}</p>

                    <div class="ring">
                        <div class="ring-inner">
                            <strong>${totalSteps.toLocaleString()}</strong>
                            <span>Steps</span>
                        </div>
                    </div>

                    <p>
                        ${progressText}% of your 10,000 step goal completed!
                    </p>

                </div>

                <div class="stats">

                    <div class="stat">
                        <strong>${miles}</strong>
                        <span>Estimated Miles</span>
                    </div>

                    <div class="stat">
                        <strong>${dailyGoal.toLocaleString()}</strong>
                        <span>Daily Step Goal</span>
                    </div>

                </div>

                <div class="card">

                <h2>Daily Steps Over Time</h2>

             <p>Track your movement and daily progress.</p>

                <div style="width: 100%; height: 300px;">

        <canvas id="stepsChart"></canvas>

    </div>

    <div class="chart-filters">
    <button onclick="changeChartRange('day')">Day</button>
    <button onclick="changeChartRange('week')">Week</button>
    <button onclick="changeChartRange('month')">Month</button>
    <button onclick="changeChartRange('year')">Year</button>
</div>


</div>
                <div class="card">

                    <h2>Recent Activity</h2>

                    ${
                        entries.length > 0
                        ? `<ul>${activityList}</ul>`
                        : `<p>No activity recorded yet. Add your first entry!</p>`
                    }

                </div>

                <a class="button" href="/tracker/v1">
                    + Add New Activity
                </a>

            </div>

            <script>

const chartEntries = ${chartEntriesJson};
const dailyTotals = {};

chartEntries.forEach(entry => {
    if (!dailyTotals[entry.date]) {
        dailyTotals[entry.date] = 0;
    }

    dailyTotals[entry.date] += Number(entry.steps);
});


const sortedDates = Object.keys(dailyTotals).sort();


const chartCanvas = document.getElementById("stepsChart");

const stepsChart = new Chart(chartCanvas, {
    type: "bar",

    data: {
        labels: [],
        datasets: [{
            label: "Daily Steps",
            data: [],
            backgroundColor: "#75BCD1",
            borderColor: "#398EB5",
            borderWidth: 1,
            borderRadius: 8
        }]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: false
            },

            title: {
                display: true,
                text: "Your Daily Movement"
            }
        },

        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Number of Steps"
                }
            },

            x: {
                title: {
                    display: true,
                    text: "Date"
                }
            }
        }
    }
});


function changeChartRange(range) {

    let filteredDates = sortedDates;

    if (range === "day") {
        filteredDates = sortedDates.slice(-7);
    }

    else if (range === "week") {
        filteredDates = sortedDates.slice(-56);
    }

    else if (range === "month") {
        filteredDates = sortedDates.slice(-365);
    }

    else if (range === "year") {
        filteredDates = sortedDates;
    }

    const filteredSteps = filteredDates.map(date => dailyTotals[date]);

    stepsChart.data.labels = filteredDates;
    stepsChart.data.datasets[0].data = filteredSteps;

    stepsChart.update();
}

changeChartRange("day");




</script>

        </body>
        </html>

    `);

});



























// --------------------------------------------------------------------------------------------------------------------- //


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
