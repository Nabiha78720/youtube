

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
// import credentials from "./credentials.json" assert {type: "json"};

// import ("./credentials.json", {type:"json"});
// let express = require("express");
// let cors = require("cors");
// let multer = require("multer");

// let connectDB = require("./Database/ConnectDB");
// let dotenv = require("dotenv");
// let fs = require("fs");
// let path= require("path");
// let timeout = require("connect-timeout");
// let youtube = require("youtube-api");
// let open = require("open");

// let credentials= require("./credentials.json");


const credentials = {
    "web": {
        "client_id": "242409723072-2rul1li0cn9qbs96nt39prsvanjopooo.apps.googleusercontent.com",
        "project_id": "my-project-370812",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_secret": "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",
        "redirect_uris": [
            "http://localhost:4000/oauth2callback"
        ],
        "javascript_origins": [
            "http://localhost:4000"
        ]
    }
}

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
        console.log(req.body);
        console.log(req.file);
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
        console.log("request processed");


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
