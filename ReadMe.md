# Task Manager
A Small server that manages creation, update and reporting the completed tasks

## Installation 
To get started, clone the repository, configure your environment variables and secrets, then install the necessary dependencies:

```bash
git clone <repository-url>
cd <repository-directory>
npm install
npm start
for testing use:
npm test
for formatting with  prettier use:
npm run format
```

## Guide through the RESTAPI 
You have couple of resources that you will consistently use:

```bash
To create a task use POST http://localhost:{yourport}/task and add :
    body:{
    "title": "your title",
    "description": "your descirption",
    "dueData": some date,
    "priority": any number between one and zero, one being top priority and zero non,
    "assignedMembers":[{"username":"yourusername","firstName":"yourfirstname","lastName":"yourlastname"}]
  }

Or you can create multiple tasks by POST http://localhost:{yourport}/tasks and add :
    body:[same object as before]

For getting task details use GET http://localhost:{yourport}/tasks/:taskId

for updating a task use PUT http://localhost:{yourport}/tasks/:taskId and add: 
    body :[{userId:"youruserId",userContribution:"yourUserContribution"}]

for completion report use GET http://localhost:{yourport}/task/report?completionDate=eitherZeroOrOne&member=eitherZeroOrOne

for time and  count report use GET http://localhost:{yourport}/task/report/timeandcount

```