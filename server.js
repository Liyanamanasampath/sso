const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
dotenv.config();
const { dbConnect } = require('./config/dbConnect');
const AuthRoute = require('./routes/auth'); 
const OauthRoute = require('./routes/oauth'); 
const app = express();
dbConnect();
app.use(bodyParser.json()); 
app.use('/api/auth',AuthRoute);
app.use('/api/oauth',OauthRoute)


app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            status: err.status || 500,
            message: err.message || 'Internal Server Error dfdf',
            stack: err.stack,
        },
    });
});

const PORT = process.env.PORT  || 3000
app.listen(PORT , ()=>{
    console.log(`server listning ${PORT}`)
})