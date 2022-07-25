const express = require("express");
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const mongoose = require("mongoose"); 
const app = express();

const UserModel = require("./models/User")
const mongoURI = 'mongodb://localhost:27017/session';

mongoose
    .connect(mongoURI , {
        useNewUrlParser:true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })
    .then((res) => {
        console.log("MongoDB connected")
    });

const store = new MongoDBSession({
    url: mongoURI ,
    collection: "my session",
})

app.set("view engine" , "ejs") ;
app.use(express.urlencoded({ extended: true })) ;

app.use(
    session({
        secret: "Hey that a cookie ",
        resave: false , 
        saveOninitialized: false,
        store: store ,
    })
)
app.get("/" , (req , res ) => {
    res.render("./landing.ejs")

})
app.get("/login" , (req , res ) => {
    res.render("./login.ejs")
});

app.post("/login" , async (req , res ) => {
    const { email , password } = req.body ; 

    const user = await UserModel.findOne({email}) ; 

    if(!user) {
        return res.redirect("./login.ejs");
    }
});

app.get("/register" , (req , res ) => {
    res.render("/register.ejs")
});

app.post("/register" , async (req , res ) => {
    const { username , emial , password } = reg.body

    let user = await UserModel.findOne({email}) ;

    if(user){
        return res.redirect("/register")
    }
    const hashpassword = await bcrypt.hash(password , 12 );

    user = new UserModel({
        username , 
        email ,
        password: hashpassword
    });

    await user.save();

    res.redirect('./login')
});

app.get("/dashboard" , (req , res ) => {
    res.render("/dashboard")
});

app.listen(5600 , console.log("server runnung on port 5600"));