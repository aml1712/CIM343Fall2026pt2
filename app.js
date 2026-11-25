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

// ------------------------------------------------------

//Tracker App Assignment PART 2

function coastStepsV2ParseDate(dateText) {
    if (typeof dateText !== "string" || !/^\d{2}\/\d{2}\/\d{4}$/.test(dateText)) {
        return null;
    }

    const parts = dateText.split("/");
    const month = Number(parts[0]);
    const day = Number(parts[1]);
    const year = Number(parts[2]);

    const date = new Date(Date.UTC(year, month - 1, day));

    if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() !== month - 1 ||
        date.getUTCDate() !== day
    ) {
        return null;
    }

    return (
        String(year).padStart(4, "0") + "-" +
        String(month).padStart(2, "0") + "-" +
        String(day).padStart(2, "0")
    );
}

// Convert a sortable YYYY-MM-DD key into MM/DD/YYYY.
function coastStepsV2FormatDate(dateKey) {
    if (!dateKey) return "";
    const parts = dateKey.split("-");
    return parts[1] + "/" + parts[2] + "/" + parts[0];
}

// Read and safely parse the CoastSteps cookie.
function coastStepsV2ReadEntries(req) {
    try {
        const parsed = JSON.parse(req.cookies.stepTracker_v2 || "[]");
        if (!Array.isArray(parsed)) return [];

        return parsed.filter(entry =>
            entry &&
            typeof entry.date === "string" &&
            coastStepsV2ParseDate(entry.date) !== null &&
            Number.isSafeInteger(Number(entry.steps)) &&
            Number(entry.steps) > 0 &&
            ["Walking", "Running", "Hiking", "Treadmill", "Other"].includes(entry.activity)
        ).map(entry => ({
            date: entry.date,
            steps: Number(entry.steps),
            activity: entry.activity
        }));
    } catch (error) {
        return [];
    }
}

// ---------- COASTSTEPS V2: TRACKER ENTRY PAGE ----------

app.get("/tracker/v2", (req, res) => {
    const savedMessage = req.query.saved === "1"
        ? '<div class="notice success">Your activity was saved successfully. Keep riding that wave!</div>'
        : "";

    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CoastalSteps | Log Activity</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Limelight&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --deep: #0A536F;
            --ocean: #287A85;
            --blue: #399295;
            --aqua: #6BB8BE;
            --mist: #97C6BE;
            --foam: #A6E4D2;
            --sand: #CCBA79;
            --paper: #FFFFFF;
            --background: #F0F8F6;
            --ink: #244B58;
            --muted: #6D8C91;
        }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            min-height: 100vh;
            font-family: "Nunito", Arial, sans-serif;
            color: var(--ink);
            background:
                radial-gradient(circle at 8% 8%, rgba(166,228,210,.55), transparent 28%),
                linear-gradient(145deg, #F5FBF9, #E5F3F2);
        }
        .topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 18px;
            max-width: 1120px;
            margin: auto;
            padding: 22px 26px;
        }
        .brand {
            color: var(--deep);
            font-family: "Limelight", Georgia, serif;
            font-size: 27px;
            text-decoration: none;
        }
        .navlink {
            color: var(--deep);
            font-weight: 800;
            text-decoration: none;
            padding: 10px 15px;
            border-radius: 999px;
            background: rgba(255,255,255,.75);
        }
        .hero {
            text-align: center;
            padding: 42px 20px 30px;
            background: linear-gradient(125deg, rgba(166,228,210,.65), rgba(107,184,190,.32));
        }
        .hero h1 {
            margin: 0;
            color: var(--deep);
            font-family: "Limelight", Georgia, serif;
            font-size: clamp(32px, 5vw, 48px);
            font-weight: 400;
        }
        .hero p { margin: 12px 0 0; color: #356B76; font-size: 17px; }
        .wave-mark { color: var(--ocean); font-size: 27px; letter-spacing: 8px; margin-top: 12px; }
        .layout { width: min(100% - 32px, 620px); margin: 32px auto 60px; }
        .card {
            background: rgba(255,255,255,.94);
            border: 1px solid rgba(151,198,190,.35);
            border-radius: 25px;
            padding: clamp(22px, 5vw, 36px);
            box-shadow: 0 12px 35px rgba(10,83,111,.08);
        }
        h2 { margin: 0 0 8px; color: var(--deep); font-size: 23px; }
        .intro { color: var(--muted); margin: 0 0 24px; }
        label { display: block; font-weight: 800; margin: 19px 0 8px; color: var(--deep); }
        input, select {
            width: 100%;
            padding: 14px 15px;
            border: 1px solid #C8DFDB;
            border-radius: 13px;
            background: #F8FCFB;
            color: var(--ink);
            font: inherit;
            outline: none;
        }
        input:focus, select:focus { border-color: var(--aqua); box-shadow: 0 0 0 3px rgba(107,184,190,.18); }
        .hint { color: var(--muted); font-size: 13px; margin: 7px 0 0; }
        .primary {
            display: block;
            width: 100%;
            border: 0;
            border-radius: 14px;
            padding: 15px 20px;
            margin-top: 27px;
            color: white;
            background: linear-gradient(110deg, var(--ocean), var(--aqua));
            font: 800 16px "Nunito", sans-serif;
            cursor: pointer;
            box-shadow: 0 8px 18px rgba(40,122,133,.18);
        }
        .primary:hover { filter: brightness(.96); transform: translateY(-1px); }
        .notice { padding: 13px 16px; border-radius: 13px; margin-bottom: 20px; font-weight: 800; }
        .success { background: #E5F7EF; color: #287A65; border: 1px solid #BDE8D7; }
        .error { background: #FFF2E8; color: #945B2B; }
        .footnote { text-align: center; color: var(--muted); font-size: 13px; margin-top: 22px; }
        @media (max-width: 520px) {
            .topbar { padding: 17px; }
            .brand { font-size: 23px; }
            .hero { padding-top: 34px; }
        }
    </style>
</head>
<body>
    <nav class="topbar">
        <a class="brand" href="/tracker/v2">CoastSteps</a>
        <a class="navlink" href="/tracker/v2/dashboard">My Dashboard ↗</a>
    </nav>

    <header class="hero">
        <h1>Move with the rhythm of the coast.</h1>
        <p>A little movement makes waves.</p>
        <div class="wave-mark" aria-hidden="true">〰 〰 〰</div>
    </header>

    <main class="layout">
        <section class="card">
            ${savedMessage}
            <h2>Log your activity</h2>
            <p class="intro">Add your steps and celebrate the ways you move.</p>

            <form action="/tracker/v2" method="POST">
                <label for="date">Activity date</label>
                <input
                    type="text"
                    id="date"
                    name="date"
                    placeholder="MM/DD/YYYY"
                    pattern="(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/[0-9]{4}"
                    title="Enter a date in MM/DD/YYYY format, such as 11/18/2026"
                    maxlength="10"
                    required
                >
                <p class="hint">Use MM/DD/YYYY, for example 11/18/2026.</p>

                <label for="steps">Number of steps</label>
                <input type="number" id="steps" name="steps" min="1" step="1" placeholder="5500" required>

                <label for="activity">Activity type</label>
                <select id="activity" name="activity" required>
                    <option value="">Choose an activity</option>
                    <option value="Walking">Walking</option>
                    <option value="Running">Running</option>
                    <option value="Hiking">Hiking</option>
                    <option value="Treadmill">Treadmill</option>
                    <option value="Other">Other</option>
                </select>

                <button class="primary" type="submit">Save activity</button>
            </form>
            <p class="footnote">Your entries are saved in a browser cookie for 30 days.</p>
        </section>
    </main>
</body>
</html>
    `);
});

// ---------- COASTSTEPS V2: SAVE A NEW ENTRY ----------

app.post("/tracker/v2", (req, res) => {
    const date = req.body.date;
    const dateKey = coastStepsV2ParseDate(date);
    const steps = Number(req.body.steps);
    const activity = req.body.activity;
    const validActivities = ["Walking", "Running", "Hiking", "Treadmill", "Other"];

    if (
        !dateKey ||
        !Number.isSafeInteger(steps) ||
        steps <= 0 ||
        !validActivities.includes(activity)
    ) {
        return res.status(400).send(`
            <h1>Invalid activity entry</h1>
            <p>Please enter a real date in MM/DD/YYYY format, a positive whole-number step count, and a valid activity.</p>
            <a href="/tracker/v2">Return to CoastSteps</a>
        `);
    }

    const entries = coastStepsV2ReadEntries(req);

    entries.push({
        date: date,
        steps: steps,
        activity: activity
    });

    // Keep the newest 35 individual entries to reduce the risk of exceeding
    // the browser's approximately 4 KB per-cookie size limit.
    entries.sort((a, b) =>
        coastStepsV2ParseDate(a.date).localeCompare(coastStepsV2ParseDate(b.date))
    );
    const savedEntries = entries.slice(-35);

    res.cookie("stepTracker_v2", JSON.stringify(savedEntries), {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        path: "/"
    });

    res.redirect("/tracker/v2?saved=1");
});

// ---------- COASTSTEPS V2: DASHBOARD ----------

app.get("/tracker/v2/dashboard", (req, res) => {
    const entries = coastStepsV2ReadEntries(req);

    // Aggregate multiple activity entries into one total for each date.
    const dailyTotals = {};
    entries.forEach(entry => {
        const key = coastStepsV2ParseDate(entry.date);
        if (!dailyTotals[key]) dailyTotals[key] = 0;
        dailyTotals[key] += entry.steps;
    });

    const dateKeys = Object.keys(dailyTotals).sort();
    const latestDateKey = dateKeys.length ? dateKeys[dateKeys.length - 1] : "";
    const requestedDateKey = coastStepsV2ParseDate(req.query.date || "");
    const selectedDateKey = requestedDateKey || latestDateKey;
    const selectedDate = selectedDateKey ? coastStepsV2FormatDate(selectedDateKey) : "";
    const selectedSteps = selectedDateKey ? (dailyTotals[selectedDateKey] || 0) : 0;

    const dailyGoal = 10000;
    const progress = Math.min((selectedSteps / dailyGoal) * 100, 100);
    const progressText = Math.round(progress);
    const miles = (selectedSteps / 2000).toFixed(2);

    // Prepare the selected-day dropdown.
    const dateOptions = dateKeys.slice().reverse().map(key => {
        const formatted = coastStepsV2FormatDate(key);
        const selected = key === selectedDateKey ? "selected" : "";
        return `<option value="${formatted}" ${selected}>${formatted}</option>`;
    }).join("");

    // Prepare the recent activity list.
    const activityList = entries.slice().reverse().map(entry => `
        <li class="activity-row">
            <span class="activity-dot ${entry.activity.toLowerCase()}"></span>
            <span class="activity-name">${entry.activity}</span>
            <strong>${entry.steps.toLocaleString("en-US")} steps</strong>
            <small>${entry.date}</small>
        </li>
    `).join("");

    // Calculate the highest recorded daily total.
    const highestSteps = dateKeys.length
        ? Math.max(...dateKeys.map(key => dailyTotals[key]))
        : 0;

    // Calculate average daily steps for the current Monday-Sunday week.
    const now = new Date();
    const todayUtc = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const dayOfWeek = todayUtc.getUTCDay();
    const daysSinceMonday = (dayOfWeek + 6) % 7;
    const currentWeekStart = new Date(todayUtc);
    currentWeekStart.setUTCDate(todayUtc.getUTCDate() - daysSinceMonday);
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setUTCDate(currentWeekStart.getUTCDate() + 7);

    const currentWeekKeys = dateKeys.filter(key => {
        const date = new Date(key + "T00:00:00Z");
        return date >= currentWeekStart && date < currentWeekEnd;
    });
    const currentWeekSteps = currentWeekKeys.reduce((sum, key) => sum + dailyTotals[key], 0);
    const weeklyAverage = currentWeekKeys.length
        ? Math.round(currentWeekSteps / currentWeekKeys.length)
        : 0;

    const chartEntriesJson = JSON.stringify(entries).replace(/</g, "\\u003c");
    const selectedDateOptions = dateOptions || '<option value="">No dates recorded</option>';

    const savedMessage = req.query.saved === "1"
        ? '<div class="notice success">Activity saved successfully!</div>'
        : "";
    const clearedMessage = req.query.cleared === "1"
        ? '<div class="notice success">All CoastSteps data has been cleared.</div>'
        : "";

    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CoastSteps | Dashboard</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Limelight&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/p5@1.11.3/lib/p5.min.js"></script>
    <style>
        :root {
            --deep: #0A536F;
            --ocean: #287A85;
            --blue: #399295;
            --aqua: #6BB8BE;
            --mist: #97C6BE;
            --foam: #A6E4D2;
            --sand: #CCBA79;
            --paper: #FFFFFF;
            --background: #F0F8F6;
            --ink: #244B58;
            --muted: #6D8C91;
            --line: #E2EFEC;
        }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            background:
                radial-gradient(circle at 95% 0%, rgba(166,228,210,.5), transparent 25%),
                var(--background);
            color: var(--ink);
            font-family: "Nunito", Arial, sans-serif;
        }
        .topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            padding: 19px max(22px, calc((100% - 1180px) / 2));
            background: rgba(255,255,255,.82);
            border-bottom: 1px solid var(--line);
        }
        .brand {
            color: var(--deep);
            font: 27px "Limelight", Georgia, serif;
            text-decoration: none;
        }
        .nav-actions { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
        .navlink {
            text-decoration: none;
            color: var(--deep);
            background: #EDF7F4;
            padding: 10px 15px;
            border-radius: 999px;
            font-weight: 800;
        }
        .hero {
            padding: 30px 20px 28px;
            text-align: center;
            background: linear-gradient(115deg, #DFF3EC, #C5E7E5 55%, #EAF5E9);
        }
        .hero h1 {
            margin: 0;
            color: var(--deep);
            font: clamp(30px, 4vw, 43px) "Limelight", Georgia, serif;
            font-weight: 400;
        }
        .hero p { color: #47747B; margin: 9px 0 0; }
        .wave-mark { color: var(--ocean); font-size: 24px; letter-spacing: 9px; margin-top: 8px; }
        .container { width: min(100% - 34px, 1180px); margin: 28px auto 60px; }
        .notice { padding: 13px 16px; border-radius: 13px; margin-bottom: 18px; font-weight: 800; }
        .success { background: #E5F7EF; color: #287A65; border: 1px solid #BDE8D7; }
        .card {
            background: rgba(255,255,255,.96);
            border: 1px solid rgba(151,198,190,.32);
            border-radius: 23px;
            padding: 23px;
            box-shadow: 0 9px 28px rgba(10,83,111,.065);
            min-width: 0;
        }
        .card h2 { color: var(--deep); font-size: 20px; margin: 0 0 7px; }
        .subtle { color: var(--muted); margin: 0 0 18px; font-size: 14px; }
        .top-grid { display: grid; grid-template-columns: 1.25fr .75fr; gap: 19px; }
        .summary-card { display: flex; align-items: center; justify-content: space-between; gap: 22px; }
        .summary-copy { flex: 1; min-width: 0; }
        .selected-label { color: var(--muted); font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .07em; }
        .big-steps { color: var(--deep); font-size: clamp(34px, 5vw, 49px); font-weight: 800; line-height: 1.1; margin: 8px 0; }
        .goal-copy { color: var(--muted); margin: 0; }
        .date-select { margin-top: 16px; max-width: 190px; width: 100%; padding: 9px 11px; border: 1px solid #CDE2DE; border-radius: 10px; color: var(--deep); background: #F8FCFB; font: inherit; }
        .progress-ring {
            width: 170px; height: 170px; flex: 0 0 170px; border-radius: 50%;
            display: grid; place-items: center;
            background: conic-gradient(var(--ocean) 0%, var(--aqua) ${progress}%, #E8F1EF ${progress}% 100%);
            position: relative;
        }
        .progress-ring::before { content: ""; position: absolute; width: 137px; height: 137px; background: white; border-radius: 50%; }
        .ring-content { z-index: 1; text-align: center; }
        .ring-content strong { display: block; color: var(--deep); font-size: 30px; }
        .ring-content span { color: var(--muted); font-size: 12px; font-weight: 800; }
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .stat-box { background: linear-gradient(145deg, #F0F8F6, #E7F4F1); border-radius: 17px; padding: 18px; }
        .stat-box strong { display: block; color: var(--ocean); font-size: 27px; }
        .stat-box span { color: var(--muted); font-size: 13px; font-weight: 800; }
        .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 19px; margin-top: 19px; }
        .chart-wrap { position: relative; height: 300px; width: 100%; }
        .chart-filters { display: flex; flex-wrap: wrap; gap: 7px; margin: 12px 0 17px; }
        .filter-button {
            border: 1px solid #CFE4DF; color: var(--deep); background: #F5FAF8;
            padding: 8px 14px; border-radius: 999px; cursor: pointer;
            font: 800 13px "Nunito", sans-serif;
        }
        .filter-button.active { color: white; border-color: var(--ocean); background: var(--ocean); }
        .legend-note { color: var(--muted); font-size: 12px; margin-top: 9px; }
        .activity-list { list-style: none; margin: 0; padding: 0; }
        .activity-row {
            display: grid; grid-template-columns: 12px 1fr auto auto; align-items: center;
            gap: 10px; padding: 12px 0; border-bottom: 1px solid var(--line);
        }
        .activity-row:last-child { border-bottom: 0; }
        .activity-dot { width: 10px; height: 10px; border-radius: 50%; }
        .activity-dot.walking { background: #399295; }
        .activity-dot.running { background: #0A536F; }
        .activity-dot.hiking { background: #CCBA79; }
        .activity-dot.treadmill { background: #6BB8BE; }
        .activity-dot.other { background: #97C6BE; }
        .activity-name { font-weight: 800; }
        .activity-row strong { color: var(--ocean); font-size: 13px; }
        .activity-row small { color: var(--muted); }
        .empty-state { color: var(--muted); padding: 18px 0; }
        .wave-card { margin-top: 19px; overflow: hidden; }
        #coastalWaves {
            width: 100%; min-height: 245px; overflow: hidden; border-radius: 17px;
            background: linear-gradient(#E4F5F2, #C9EAE6);
        }
        #coastalWaves canvas { display: block; max-width: 100%; }
        .wave-caption { color: var(--muted); font-size: 13px; margin: 12px 0 0; }
        .bottom-actions { display: flex; justify-content: space-between; align-items: center; gap: 14px; margin-top: 20px; }
        .action-link, .clear-button {
            border: 0; border-radius: 12px; padding: 12px 17px; text-decoration: none;
            font: 800 14px "Nunito", sans-serif; cursor: pointer;
        }
        .action-link { color: white; background: var(--ocean); }
        .clear-button { color: #8A5D43; background: #F8EEE7; border: 1px solid #EEDACB; }
        .clear-button:hover { background: #F3E4D9; }
        @media (max-width: 800px) {
            .top-grid, .dashboard-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 560px) {
            .topbar { padding: 15px 17px; align-items: flex-start; }
            .brand { font-size: 22px; }
            .nav-actions { justify-content: flex-end; }
            .navlink { padding: 8px 11px; font-size: 12px; }
            .summary-card { flex-direction: column-reverse; align-items: flex-start; }
            .progress-ring { width: 145px; height: 145px; flex-basis: 145px; align-self: center; }
            .progress-ring::before { width: 116px; height: 116px; }
            .ring-content strong { font-size: 26px; }
            .stats-grid { grid-template-columns: 1fr 1fr; }
            .activity-row { grid-template-columns: 12px 1fr auto; }
            .activity-row small { grid-column: 2 / 4; }
            .bottom-actions { align-items: stretch; flex-direction: column; }
            .bottom-actions form, .clear-button, .action-link { width: 100%; text-align: center; }
        }
    </style>
</head>
<body>
    <nav class="topbar">
        <a class="brand" href="/tracker/v2">CoastSteps</a>
        <div class="nav-actions">
            <a class="navlink" href="/tracker/v2">+ Log activity</a>
        </div>
    </nav>

    <header class="hero">
        <h1>Your movement, your progress.</h1>
        <p>Find your flow, one step at a time.</p>
        <div class="wave-mark" aria-hidden="true">〰 〰 〰</div>
    </header>

    <main class="container">
        ${savedMessage}
        ${clearedMessage}

        <section class="top-grid">
            <div class="card summary-card">
                <div class="summary-copy">
                    <div class="selected-label">Daily activity · ${selectedDate || "No activity yet"}</div>
                    <div class="big-steps">${selectedSteps.toLocaleString("en-US")}</div>
                    <p class="goal-copy">of 10,000 steps · ${progressText}% of your daily goal</p>
                    <label for="selectedDate" class="selected-label" style="display:block;margin-top:16px;">Choose a day</label>
                    <select class="date-select" id="selectedDate" onchange="changeSelectedDate(this.value)">
                        ${selectedDateOptions}
                    </select>
                </div>
                <div class="progress-ring" aria-label="${progressText}% of daily step goal">
                    <div class="ring-content">
                        <strong>${progressText}%</strong>
                        <span>DAILY GOAL</span>
                    </div>
                </div>
            </div>

            <div class="card">
                <h2>Your daily stats</h2>
                <p class="subtle">Small steps add up to something wonderful.</p>
                <div class="stats-grid">
                    <div class="stat-box">
                        <strong>${miles}</strong>
                        <span>Estimated miles</span>
                    </div>
                    <div class="stat-box">
                        <strong>10,000</strong>
                        <span>Daily step goal</span>
                    </div>
                </div>
            </div>
        </section>

        <section class="dashboard-grid">
            <div class="card">
                <h2>Daily Steps Over Time</h2>
                <p class="subtle">Explore your movement across different time periods.</p>
                <div class="chart-filters" aria-label="Choose chart time period">
                    <button class="filter-button active" type="button" data-range="day" onclick="changeChartRange('day')">Day</button>
                    <button class="filter-button" type="button" data-range="week" onclick="changeChartRange('week')">Week</button>
                    <button class="filter-button" type="button" data-range="month" onclick="changeChartRange('month')">Month</button>
                    <button class="filter-button" type="button" data-range="year" onclick="changeChartRange('year')">Year</button>
                </div>
                <div class="chart-wrap"><canvas id="stepsChart"></canvas></div>
                <p class="legend-note" id="stepsChartNote">Daily totals for your 7 most recent recorded dates.</p>
            </div>

            <div class="card">
                <h2>Steps by Activity Type</h2>
                <p class="subtle">See how each kind of movement adds up.</p>
                <div class="chart-wrap"><canvas id="activityChart"></canvas></div>
                <p class="legend-note">Totals include all activity entries currently saved.</p>
            </div>

            <div class="card">
                <h2>Weekly Summary</h2>
                <p class="subtle">Your current Monday–Sunday week, using days with recorded entries.</p>
                <div class="stats-grid">
                    <div class="stat-box">
                        <strong>${weeklyAverage.toLocaleString("en-US")}</strong>
                        <span>Average steps per recorded day this week</span>
                    </div>
                    <div class="stat-box">
                        <strong>${highestSteps.toLocaleString("en-US")}</strong>
                        <span>Highest recorded daily total</span>
                    </div>
                </div>
            </div>

            <div class="card">
                <h2>Recent Activity</h2>
                <p class="subtle">Your latest logged movement.</p>
                ${
                    entries.length
                    ? `<ul class="activity-list">${activityList}</ul>`
                    : `<p class="empty-state">No activity recorded yet. Add your first entry to get started.</p>`
                }
            </div>
        </section>

        <section class="card wave-card">
            <h2>Coastal Waves</h2>
            <p class="subtle">Your activity creates ripples across your personal ocean.</p>
            <div id="coastalWaves"></div>
            <p class="wave-caption">More steps create taller waves. Each activity type adds its own coastal color.</p>
        </section>

        <div class="bottom-actions">
            <a class="action-link" href="/tracker/v2">＋ Log another activity</a>
            <form action="/tracker/v2/clear" method="POST" onsubmit="return confirm('Clear all CoastSteps entries? This cannot be undone.');">
                <button class="clear-button" type="submit">Clear all data</button>
            </form>
        </div>
    </main>

    <script>
        // Cookie data is supplied by the Express route; browser storage is not used.
        const trackerEntries = ${chartEntriesJson};

        const activityColors = {
            Walking: "#399295",
            Running: "#0A536F",
            Hiking: "#CCBA79",
            Treadmill: "#6BB8BE",
            Other: "#97C6BE"
        };

        // Convert MM/DD/YYYY into a sortable YYYY-MM-DD key.
        function dateToKey(dateText) {
            const parts = dateText.split("/");
            return parts[2] + "-" + parts[0] + "-" + parts[1];
        }

        // Format a date key as MM/DD/YYYY.
        function keyToDateLabel(key) {
            const parts = key.split("-");
            return parts[1] + "/" + parts[2] + "/" + parts[0];
        }

        // Find the Monday at the start of a date's week.
        function getWeekStart(date) {
            const result = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
            const daysSinceMonday = (result.getUTCDay() + 6) % 7;
            result.setUTCDate(result.getUTCDate() - daysSinceMonday);
            return result;
        }

        // Format a UTC date as YYYY-MM-DD.
        function toKey(date) {
            return date.getUTCFullYear() + "-" +
                String(date.getUTCMonth() + 1).padStart(2, "0") + "-" +
                String(date.getUTCDate()).padStart(2, "0");
        }

        // Aggregate multiple entries from one calendar date into a single daily total.
        const dailyTotalsForChart = {};
        trackerEntries.forEach(entry => {
            const key = dateToKey(entry.date);
            dailyTotalsForChart[key] = (dailyTotalsForChart[key] || 0) + Number(entry.steps);
        });

        const recordedDayKeys = Object.keys(dailyTotalsForChart).sort();

        // Build the Chart.js bar chart and update it for the selected time range.
        const stepsChart = new Chart(document.getElementById("stepsChart"), {
            type: "bar",
            data: {
                labels: [],
                datasets: [{
                    label: "Average daily steps",
                    data: [],
                    backgroundColor: "#6BB8BE",
                    borderColor: "#287A85",
                    borderWidth: 1,
                    borderRadius: 9,
                    maxBarThickness: 42
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return Number(context.raw).toLocaleString("en-US") + " steps";
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { callback: value => Number(value).toLocaleString("en-US") },
                        title: { display: true, text: "Number of steps" },
                        grid: { color: "#EAF2F0" }
                    },
                    x: {
                        title: { display: true, text: "Date / time period" },
                        grid: { display: false },
                        ticks: { maxRotation: 45, minRotation: 0 }
                    }
                }
            }
        });

        // Create weekly or monthly average buckets using only dates that have entries.
        function makeAverageBuckets(bucketType, numberOfBuckets) {
            const buckets = {};

            recordedDayKeys.forEach(key => {
                const date = new Date(key + "T00:00:00Z");
                let bucketKey;
                let label;

                if (bucketType === "week") {
                    const monday = getWeekStart(date);
                    bucketKey = toKey(monday);
                    const sunday = new Date(monday);
                    sunday.setUTCDate(monday.getUTCDate() + 6);
                    label = keyToDateLabel(bucketKey) + " – " + keyToDateLabel(toKey(sunday));
                } else {
                    bucketKey = key.slice(0, 7);
                    label = key.slice(5, 7) + "/" + key.slice(0, 4);
                }

                if (!buckets[bucketKey]) {
                    buckets[bucketKey] = { total: 0, recordedDays: 0, label: label };
                }

                buckets[bucketKey].total += dailyTotalsForChart[key];
                buckets[bucketKey].recordedDays += 1;
            });

            return Object.keys(buckets).sort().slice(-numberOfBuckets).map(key => ({
                label: buckets[key].label,
                value: Math.round(buckets[key].total / buckets[key].recordedDays)
            }));
        }

        // Switch between the most recent 7 days, 8 weeks, 12 months, or all recorded years.
        function changeChartRange(range) {
            let labels = [];
            let values = [];
            let note = "";

            if (range === "day") {
                const recentDays = recordedDayKeys.slice(-7);
                labels = recentDays.map(keyToDateLabel);
                values = recentDays.map(key => dailyTotalsForChart[key]);
                note = "Daily totals for your 7 most recent recorded dates.";
            } else if (range === "week") {
                const buckets = makeAverageBuckets("week", 8);
                labels = buckets.map(bucket => bucket.label);
                values = buckets.map(bucket => bucket.value);
                note = "Average steps per recorded day for each of your 8 most recent weeks.";
            } else if (range === "month") {
                const buckets = makeAverageBuckets("month", 12);
                labels = buckets.map(bucket => bucket.label);
                values = buckets.map(bucket => bucket.value);
                note = "Average steps per recorded day for each of your 12 most recent recorded months.";
            } else if (range === "year") {
                const yearly = {};
                recordedDayKeys.forEach(key => {
                    const year = key.slice(0, 4);
                    if (!yearly[year]) yearly[year] = { total: 0, days: 0 };
                    yearly[year].total += dailyTotalsForChart[key];
                    yearly[year].days += 1;
                });
                const years = Object.keys(yearly).sort();
                labels = years;
                values = years.map(year => Math.round(yearly[year].total / yearly[year].days));
                note = "Average steps per recorded day for each year.";
            }

            stepsChart.data.labels = labels;
            stepsChart.data.datasets[0].data = values;
            stepsChart.update();

            document.getElementById("stepsChartNote").textContent = note;

            document.querySelectorAll(".filter-button").forEach(button => {
                button.classList.toggle("active", button.dataset.range === range);
            });
        }

        // Display the selected day's dashboard summary.
        function changeSelectedDate(dateText) {
            if (dateText) {
                window.location.href = "/tracker/v2/dashboard?date=" + encodeURIComponent(dateText);
            }
        }

        // Draw the activity breakdown doughnut chart from the saved cookie entries.
        const activityTotals = {
            Walking: 0,
            Running: 0,
            Hiking: 0,
            Treadmill: 0,
            Other: 0
        };

        trackerEntries.forEach(entry => {
            if (activityTotals[entry.activity] !== undefined) {
                activityTotals[entry.activity] += Number(entry.steps);
            }
        });

        new Chart(document.getElementById("activityChart"), {
            type: "doughnut",
            data: {
                labels: Object.keys(activityTotals),
                datasets: [{
                    data: Object.values(activityTotals),
                    backgroundColor: Object.keys(activityTotals).map(name => activityColors[name]),
                    borderColor: "#FFFFFF",
                    borderWidth: 4,
                    hoverOffset: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "65%",
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: { usePointStyle: true, padding: 17, font: { family: "Nunito" } }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ": " + Number(context.raw).toLocaleString("en-US") + " steps";
                            }
                        }
                    }
                }
            }
        });

        // Create the first chart view after the page has loaded.
        changeChartRange("day");

        // Build the animated p5.js ocean scene using the current activity entries.
        const waveSketch = function(p) {
            let waveEntries = trackerEntries;
            let phase = 0;
            let waveHeight = 0;

            // Set up the sketch dimensions and canvas.
            p.setup = function() {
                const host = document.getElementById("coastalWaves");
                const canvas = p.createCanvas(host.clientWidth, 245);
                canvas.parent("coastalWaves");
                p.noStroke();
            };

            // Draw animated overlapping waves; activity type selects each wave's color.
            p.draw = function() {
                p.clear();
                p.background(224, 244, 240);

                const width = p.width;
                const height = p.height;
                const hasEntries = waveEntries.length > 0;
                const totalSteps = waveEntries.reduce((sum, entry) => sum + Number(entry.steps), 0);
                const stepInfluence = hasEntries ? Math.min(totalSteps / Math.max(waveEntries.length, 1) / 10000, 1) : 0;
                phase += 0.012;

                const colors = hasEntries
                    ? waveEntries.map(entry => activityColors[entry.activity] || "#97C6BE")
                    : ["#A6E4D2", "#97C6BE", "#6BB8BE"];

                // Draw one animated wave layer for each activity entry, capped for visual clarity.
                const layerCount = Math.max(colors.length, 3);

                for (let layer = 0; layer < layerCount; layer++) {
                    const colorHex = colors[layer % colors.length];
                    const color = p.color(colorHex);
                    const entry = hasEntries ? waveEntries[layer % waveEntries.length] : null;
                    const entrySteps = entry ? Number(entry.steps) : 0;
                    const activityBoost = entry ? Math.min(entrySteps / 12000, 1) : 0.15;
                    const amplitude = 8 + (stepInfluence * 25) + (activityBoost * 16);
                    const baseline = height * (0.44 + (layer / Math.max(layerCount - 1, 1)) * 0.65);

                    p.fill(color);
                    p.beginShape();
                    p.vertex(0, height);

                    for (let x = 0; x <= width; x += 5) {
                        const y = baseline +
                            Math.sin((x * 0.012) + phase + layer * 0.9) * amplitude +
                            Math.sin((x * 0.022) - phase * 0.7 + layer) * (amplitude * 0.32);
                        p.vertex(x, y);
                    }

                    p.vertex(width, height);
                    p.endShape(p.CLOSE);
                }

                // Show a calm empty-ocean message when no entries exist.
                if (!hasEntries) {
                    p.fill("#0A536F");
                    p.textAlign(p.CENTER, p.CENTER);
                    p.textSize(15);
                    p.text("Your ocean is calm. Log an activity to make waves!", width / 2, 48);
                }
            };

            // Resize the sketch when the dashboard layout changes.
            p.windowResized = function() {
                const host = document.getElementById("coastalWaves");
                if (host) p.resizeCanvas(host.clientWidth, 245);
            };
        };

        // Start the p5.js sketch in instance mode so it does not conflict with other scripts.
        new p5(waveSketch);
    </script>
</body>
</html>
    `);
});

// ---------- COASTSTEPS V2: CLEAR ALL TRACKER DATA ----------

app.post("/tracker/v2/clear", (req, res) => {
    res.clearCookie("stepTracker_v2", {
        httpOnly: true,
        sameSite: "lax",
        path: "/"
    });

    res.redirect("/tracker/v2/dashboard?cleared=1");
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
