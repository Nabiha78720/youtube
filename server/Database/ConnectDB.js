import mongoose from 'mongoose';
// let mongoose = require("mongoose");

const connectDB=async(url)=>{
    try{
       await mongoose.connect(url,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
          console.log("successfully connect DB");

    }catch(error){
        console.log(error);
    }
}

export default connectDB;