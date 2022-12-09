

import express from "express";
import cors from "cors";
import multer from "multer";
// import router from "./Routes/routes.js";
import connectDB from "./Database/ConnectDB.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import timeout from "connect-timeout";

import youtube from "youtube-api";
import open from "open";

import credentials from "./credentials.json" assert {type: "json"};





const oAuth = youtube.authenticate({
    type: "oauth",
    client_id: credentials.web.client_id,
    client_secret: credentials.web.client_secret,
    redirect_uri: credentials.web.redirect_uris[0]
});




const __dirname = path.resolve();
dotenv.config();
const urlDB =
    "mongodb://localhost:27017/Dummy";
const app = express();
app.use(timeout("60000s"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./build"));

connectDB(urlDB);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "upload");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + Math.random() + "-" + file.originalname);
    },
});
const upload = multer({ storage: storage });
app.use("/upload", express.static("./upload"));
// .......start route update of profile pic.........
app.post("/uploadvideo", upload.single("videoFile"), async (req, res) => {
    try {
        console.log(re.body);
        if(req.file){
            const filename = req.file.filename;
            const {title,description} = req.body;
         
            open(oAuth.generateAuthUrl({
                access_type: "offline",
                scope: "https://www.googleapis.com/auth/youtube.upload",
                state: JSON.stringify({
                    filename,title,description 
                })
            }))
        }


    } catch (error) {
        res.status(500).json({
            status: "error",
            success: false,
            message: "Server error or routesis not match !",
        })
    }
});

app.get("/oauth2callback", (req,res)=>{
    console.log("route called");
    res.redirect("http://localhost:3000/success");
    const {filename,title,description} = JSON.parse(req.query.state);

    oAuth.getToken(req.query.code,(err,token)=>{
        if(err){
            console.log(err);
            return
        }
        oAuth.setCredentials(token);
        youtube.video.insert({
             resource:{
                snippet:{title,description},
                status:{privacyStatus:"private"}
             },
             part:"snippet,status",
             media:{
                body:fs.createReadStream(filename)
             }
        },(err,data)=>{
            console.log("done");
            process.exit();
        })
    })
})

// app.use(router);

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ status: false, data: error });
});

app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "./build/index.html"), function (err) {
        if (err) {
            res.status(500).send(err);
        }
    });
});

app.listen(process.env.PORT || 4000, function () {
    console.log("Server Start at live");
});
