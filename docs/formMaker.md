[↩️ Return to the docs home.](./docs.md)

# Form Management

---

This page is only available to users with the ADMIN permission.
<br>The form creation part of this page has not been optimized for mobile, however the form management part has been.

## Management

There are four buttons you can use to manage your forms:
- Editing (Pencil Icon)
    - This allows you to edit a form, and will bring up the form creation tool. See the editing section below.
- Deploying (Cloud Icon)
    - Only deployed forms can be seen on the Forms page by scouts.
- Locking (Lock Icon)
    - Locked forms will auto fill match and team numbers but can only be accessed if scouts are currently on an Assignment with the "Assigned" type. [See the scheduling docs.](./scheduling.md)
- Deleting (Trash Icon)
    - Permanently deletes a form.
    - Only non-deployed forms can be deleted.

## Creation

When you create a form, you will need a unique name, a description, and a form type:

- Team Based
    - Team based forms will have a match number and a team number input. If the form is locked, both of these fields will auto-fill.
- Alliance Based
    - Alliance based forms will have a match number and alliance input. Each team will have a section, and all added components are repeated three times (once for each team). Data will not be grouped by alliance, but rather submitted individually for each team.
- Team Data
    - Team data forms are purely for recording information about teams. They do not pertain to a specific match. This is perfect for a pit scouting form or a drive team notes form.

## Editing

You can create and rearrange components in any way you see fit. There are two types of components:

#### Data Components

These components just give the users information or break up questions.

1. Section Break
2. Information

#### Questions

These components get user input. All question components need a *Datapoint*, this is how you will interpret the data. For example if the question is "How many L3 did they score in auto?" the *Datapoint* would be something like "AutoL3".

1. Multiple Choice
2. Short Response
3. Number - Can be used with data validation, see below.

#### Data Validation

Data validation lets you determine the accuracy of data scouts are entering using The Blue Alliance. We total the datapoint values entered per alliance per match and compare to what TBA reports. We then give the alliance of scouts a score for that match. This means we can only accurately score matches that have all three stations scouted. The score considered "acceptable" (for filtering) can be entered while viewing data. Validation can currently only be used for Number questions.

Note that *{$A}* is replaced with either "red" or "blue" based on the alliance.

The path can be any JSON path in The Blue Alliance *match* return type **as long as the path will return a number**. You wil likely have to play around with TBA to find the current data structure for this years game, as their API docs are heavily outdated.

Some examples include (as of Aug 29th 2025):

- score_breakdown.*{$A}*.teleopReef.trough
    - L1 Teleop Score
- score_breakdown.*{$A}*.teleopReef.tba_botRowCount
    - L2 Teleop Score
- score_breakdown.*{$A}*.autoReef.tba_midRowCount
    - L3 Auto Score