const express=require("express");
const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
//Here WanderLust is our database used for  our Project


main()
    .then(()=>{
    console.log("connected to db"); 
    })
    .catch((err)=>{
        console.log(err);
    });


async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB=async () =>{
    await Listing.deleteMany({});
    //map function creates a new array make changes in new array and then return it
    initdata.data=initdata.data.map((obj)=>({
    ...obj,
    owner:'66c095a88723eec0ba548f95',
    }));
    await Listing.insertMany(initdata.data);
    console.log("data was intialized");
};

initDB();