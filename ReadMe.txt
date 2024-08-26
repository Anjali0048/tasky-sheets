Step 1 : npm init -y

Step 2 : Install Packages
    npm i bcrypt dotenv ejs express express-validator jsonwebtoken mongoose node-schedule nodemailer twilio

Step 3 : Create file called app.js

Step 4 : 
    --> Add "type" : "module" to package.json 
    --> Remove "test" from "scripts" and add dev & prod settings like below
    "dev": "nodemon app.js",
    "prod" : "pm2 start app.js --name yourdomain.com"

Step 5 :
    Setup all the routers as per the system

Step 6 :
    Add body-parser middleware to app

Step 7 :
    Database configurations

Step 8 :  Create TasksModel 

Step 9 : Write all the REST APIs using the models

Step 10 : Validation Middleware 
