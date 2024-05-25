const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
let meds = require("./router/medicine")
let user = require("./router/user")
const session = require("express-session")
let Medicines = require("./models/medicine")
const flash = require('connect-flash');
require('dotenv').config();



const paginate = require("express-paginate")
const app = express()

mongoose.connect(process.env.MONGO);
let db = mongoose.connection;

db.on('error', function (err) {
    console.log(err);
});
db.once('open', function () {
    console.log("Connected to mongodb");
})

app.set('view engine', 'pug');

app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(paginate.middleware(5,50))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use(function(req, res, next) {
    if (!req.session.username && (req.path !== '/user/login' && req.path !== '/user/signup')) {
        res.redirect('/user/login');
    } else {
        next();
    }
});
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use("/medicine", meds)
app.use("/user", user)


app.get("/", async function(req, res){
    let searchQuery = {};
    if (req.query.search) {
        searchQuery = { title: { $regex: new RegExp(req.query.search, 'i') } };
    }

    const [medicines, itemCount] = await Promise.all([
        Medicines.find(searchQuery).limit(req.query.limit).skip(req.skip),
        Medicines.countDocuments(searchQuery)
    ]);

    const pageCount = Math.ceil(itemCount / req.query.limit);

    res.render("listing", {
        title: "Medical Store",
        medicines: medicines,
        pageCount,
        itemCount,
        pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
    });
});





app.listen(3000, function(){
    console.log("Server listening to port 3000")
})