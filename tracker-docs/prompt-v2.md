# Prompt Script v1

## Goal
Create a Daily Steps Tracker app/website that allows users to record their daily step counts and the type of physical activity they completed (walking, running, hiking, treadmill, etc). The application should help users monitor their daily movement, visualize their progress, and understand their activity patterns through an interactive dashboard. The app should be inspired by the functionality and layout of Apple's Fitness app, but with a blue, beachy, coastal aesthetic. It should feel like a personal wellness and fitness dashboard.


## Where it lives
- It's part of an existing Express.js app that already uses cookie-parser
- Routes go in my main Express file (app.js) with my other routes
- Do NOT change my other routes or add new npm packages

## Data
Each entry should include:
{
date: "11/18/2026",
steps: 5000,
activity: "treadmill"
}
Activity Categories:
Walking
Running
Hiking
Treadmill
Other

Cookie name: stepTracker_v1
Cookie Experation Date: 30 days using maxAge


## Routes (Express + cookie-parser)
When a new entry is submitted, retrieve existing enteries from req.cookies, add the new entry, and save the updated array using res.cookie. Then Return the user to the tracker or dashboard with a success message.

Create a daily step tracker form including:
- a date input using MM/DD/YYYY format (11/18/2026)
- a number input for daily steps (5500)
- a dropdown menu for activity type (walking, running, hiking, treadmill, other)
- a save entry button
- a link to the dashboard
- Choose a beachy aestchic for the font, (limelight, henny penny, emily's candy)



/tracker/v1/dashboard
read the cookie with req.cookies and show a dashboard inspired by Apple Fitness that includes: 
1. A daily activity summary
    - Total steps for the selected day.
    - Progress toward the 10,000-step daily goal (max 100%, DO NOT GO OVER 100%)
    - A circular progress indicator showing the percentage of the daily goal completed
    - Estimated distance walked in miles, using approximately 2,000 steps per mile.

2. An Activity history selection
    - A bar chart showing steps over time
    - Options to switch between Day, Week, Month, and Year
    - Update the chart when a different time period is selected!!
    - Include readable dates, labels, and step counts
    - Keep date formated in MM/DD/YYYY for everything

3. An actiivity breakdown section
    - A circle chart showing the total steps by activity type.
    - Use a different color for each activity category (sea mist blue, ocean blue, sandy brown/yellow, seafoom green/teal, etc)

4. Weekly Summary
    - Display average daily steps for the current week
    - Display the highest recorded daily step count.

5. A p5.js coastal visualization called "Coastal Waves" that responds to the user's activity data.

6. A clear all data button that delets the cookies with res.clearCookie and and refresh the dashboard to display empty charts and an empty sketch

7. Navigation that links back to the tracker form and a link from the tracker form to the dashboard so all pages are linked to eachother

## Chart 1 (Chart.js)
Create a bar chart titled "Daily Steps Over Time" that includes:
- a bar chart in the same coastal beachy color shceme.
- a display of the number of steps on the vertical Y-axis
- a Display of dates or time periods on the horizontal X-axis.
- Use actual step entries stored in the cookie.
- Combine multiple activity entries from the same date into one daily total.

Include four selectable time periods:
1. Day: Display individual daily step totals for the most recent 7 days.
2. Week: Display average daily steps for each of the most recent 8 weeks.
3. Month: Display average daily steps for each of the most recent 12 months.
4. Year: Display average daily steps for each year with recorded entries.

Calculate the averages using days with recorded entries!!!!
The chart should update when the user switches between the four time periods!!
Use ocean blue and seafoam green colors, with subtle styling and readable labels (navy, beachy coastal vibes throughout)

## Chart 2 (Chart.js)
Create a circle doughnut chart titled "Steps by Activity Type" that includes:
- a doughnut chart in the same coastal beachy color shceme.
- Display total steps recorded for Walking, Running, Hiking, Treadmill, and Other.
- Calculate totals using the actual cookie data.
- include a readable legend identifying each activity.
- Use a different color for each activity category (keep the coastal colors)


The chart must update whenever new activity entries are added or data is cleared!

## p5.js sketch
Create a creative p5.js visualization called "Coastal Waves" inspired by the ocean and coastal scenery vibes:
- Display animated ocean waves or overlapping water ripples!!!!!!!
- Each recorded activity entry must contribute to the visualization.
- The number of steps should influence the size or height of the waves.
- The activity category should influence the color of the waves.
- Use calming shades of blue, aqua, and seafoam green.
- The sketch should respond to changes in the user's recorded activity data.
- When new entries are added, the visualization should change.
- When all entries are cleared, return to an empty ocean-inspired visualization.
- Place the p5.js sketch inside the dashboard layout, not floating at the bottom of the page!!!

## Rules / constraints
MUST FOLLOW ALL COMPLETELY
- Plain HTML, CSS, and JavaScript only (no React, no frameworks)
- Store data in cookies using cookie-parser on the server (NOT localStorage, NOT document.cookie)
- Load Chart.js and p5.js from a CDN
- Comment every function
- Include a "Clear all data" button


 ## Design & Aestchics
 Choose a beachy aestchic for the font, (limelight, henny penny, emily's candy) throughout
 The app should feel like Apple Fitness but with a d a modern coastal website aesthic
 Colors:
 - 399295
 - CCBA79
 - A6E4D2
 - 97C6BE
 - 0A536F
 - 287A85
 - 6BB8BE
 - A0CCC2
 - white

 Design/Layout:
 - keep all dates in the format mm/dd/yyyy
 - Use rounded cards and soft corners.
 - Use subtle ocean-inspired gradients
 - Include beachy graphics, (waves, sun, footsteps in sand, etc) to make the website more personalized and less stiff
 - Include minimal fitness and activity icons
 - Use soft shadows and subtle borders
 - Make the dashboard visually organized and easy to navigate
 - Make the interface responsive for desktop and mobile
 Do NOT use bright neon colors, dark backgrounds, cluttered layouts, and overly complicated designs!!! 

 Generate the complete HTML, CSS, JavaScript, and Express route code needed to implement this application inside my existing Express project. Explain where each piece of code belongs and do not replace or remove my existing application code.
