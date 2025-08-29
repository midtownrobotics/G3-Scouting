[↩️ Return to the docs home.](./docs.md)

# Scheduling Page

---

This page is only available to users with the ADMIN permission.
<br>This page has not been optimized for mobile use.

## Day Selector

Use this to tell the scheduler which days your competition will take place. You can also assign roles for before a competition starts or after it ends.

- A single day cannot extend beyond 12:30PM or start before 12:00AM.
- You cannot add multiple timeframes for the same date.
- The time in the top box must come before the time in the bottom box.
- You ***cannot*** currently change a timeframe once it is created. You must delete it, which will reset the schedule for that day.
- When inputting time, both the starting and ending time will have blocks. So if it starts at 1PM and ends at 5PM, there will be blocks from 1:00-1:30, 1:30-2:00, ... 4:30-5:00, and 5:00-5:30.

## Assignment Creator

Use this to create assignments to be used in your schedule.

Properties:
- Name
    - Can have spaces and capital letters
    - Will be displayed to users
- Color
    - Not recommended to be very bright "highlighter" colors.
    - Not recommended to make multiple assignments a similar color.
    - Note that the color on the schedule may not exactly match the color users see as colors are filtered to look better in different UIs.
- Type
    - **Assigned**: This will assign users a team to scout. Should only be used when they will be using locked forms ([see form maker docs](./formMaker.md)). Most of the time locked forms are only for quantitative scouting.
    - **Break**: Will not assign users to anything.
    - **Other**: An alias for "Break". Should be used for non-locked forms, usually pit or qualitative scouting, or anything else.
    - **Pit**: Similar to "Other" but will show users with these assignments on the Pit Monitor.

## Scheduling Table

This is where you link your assignments, times, and users.

- Each "time" listed in the 2nd row is actually a 30min block. So if the time says 05:00 PM, the block your scheduling for is from 5:00-5:30.
- You can select the assignment by clicking the ⭘ icon under an assignment, or using the number keys 1 through 9.
- Putting your cursor near the left or right edge of the table will slowly scroll it in that direction.
- Deleting an assignment will make all cells with that assignment go blank.
- You can drag over a range of cells to assign all of them.
- You need an assignment in every cell for every user.
- Zooming out (Ctrl - or Cmd -) can make it easier to see all cells.