# BizTrackmate-Public
Webanwendung für Kleinstunternehmen

Naming Conventions:
- branch names: feature/#"issue number"-"ticket-header"
- CSS/SCSS classes: kebab-case
- methods/variables: camelCase
- test files (only create them under test folder in specific place -> mirrored src folder): .spec.ts
- classes/interfaces/components/files (only .vue)/pages: UpperCase
- other files (.css / .scss / .ts): lowerCase

If you want to run it, follow these steps:
- clone the repo
  `git clone https://github.com/Murtl/BizTrackMate-Public.git`
- go into backend folder
  `cd backend`
- run npm install
  `npm install`
- run npm run dev (start localhost to look at it)
  `npm run dev`
- go into frontend folder
  `cd frontend`
- run npm install
  `npm install`
- run npm run dev (start localhost to look at it)
  `npm run dev`

Please note that you need to replace the placeholders in the following files with your firebase project information to run the project yourself:
- frontend/src/firebase.ts
- backend/src/firebase-service-account.json
- backend/config/test.ts


