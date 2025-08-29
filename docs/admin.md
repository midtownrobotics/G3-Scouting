[↩️ Return to the docs home.](./home.md)

# Admin Page

---

This page is only available to users with the ADMIN permission.
<br>This page has not been optimized for mobile use.

## Users

Fields:

- **ID**: number
    - **Not settable**, only for display.
- **Username**: string
    - The users display name, also used for logging in. 
    - Spaces and special characters are allowed but not recommended.
- **Password**: string
    - The users password will not be displayed after user creation, but is still changeable.
- **Permission**: enum
    - SCOUT: No access to **Data**, **Lead**, **Admin**, **Form Maker**, or **Scheduler**
    - DATA: Same as SCOUT, but access to **Data** page.
    - LEAD: Same as DATA, but access to **Lead** page.
    - ADMIN: Access to all pages.
- **Reliable**: boolean
    - Planned to be used to tell which scouts should have a second account added to their station. 
    - Not used currently
- **Red Alliance**: boolean
    - Whether the scout should scout the red alliance (true) or blue alliance (false).
    - Only settable after user creation.
- **Slack Linked**: boolean
    - Whether the scout has linked their slack account to receive notifications.
    - **Not settable**, only for display.

## Settings

### Slack

The Scout-o-matic uses Slack integration to send users schedule reminders and updates.
Note that each user will have to link their slack account, there is currently no way to do this for them. See the [Settings docs](./settings.md).

You will first need to create a slack bot and add it to your project. Once you add the bot to a Slack, you will get an OAuth code starting in "xoxb-" This is your Slack OAuth token.
//TODO: Add more in-depth instructions.

### Other

- **Team Number**
    - Your team number! Only integers will save in this field.
- **TBA Token**
    - Your The Blue Alliance API key. Can be obtained from your <a href="https://www.thebluealliance.com/account" target="_blank">TBA Account Page</a>
 in the *Read API Keys* section.
- **Nexus Token**
    - Your Nexus API key. Can be obtained from the <a href="https://frc.nexus/en/api" target="_blank">Nexus API Page</a> in the *Pull* section.
- **Event Key**
    - The event key for your current event. Can be obtained by going to your event page on <a href="https://www.thebluealliance.com/events/" target="_blank">TBA</a> and looking in the URL after "/event/".
    - EX: For <a href="https://www.thebluealliance.com/event/2025gagai" target="_blank">https://www.thebluealliance.com/event/2025gagai</a>, the code is "2025gagai".