import asyncHandler from '../utils/asyncHandler.js';
import APiError from '../utils/ApiError.js';

import {User} from "../models/user.model.js";

import uploadOnCloudinary from "../utils/cloudinary.js";

import ApiResponse from "../utils/APiResponse.js";


const registerUser = asyncHandler(async(req,res) => {
    // take user information
    // check any required fields are empty or not
    // Also chaeck otehr fields 
    //we are taking 

   const {userName,fullName,email,password} = req.body;

   if([userName,fullName,email,password].some((fields)=>
        fields ?.trim() === ""
   )){
        throw new APiError(400,"All fields are required");
   }

   const existedUser =  await User.findOne({
    $or: [{userName},{email}]
   })

   if(existedUser){
    throw new APiError(409,"User with userName or email already exists");
   }

console.log("req.files" ,req.files);

   const avatarLoacalPath = req.files?.avatar[0]?.path; //avatar  
   const coverImageLocalPath = req.files?.coverImage[0]?.path; //cover

   if(!avatarLoacalPath){
    throw new APiError(400,"Avatar is required");
   }

   const avatar = await uploadOnCloudinary(avatarLoacalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

   if(!avatar){
    throw new APiError(400,"Avatar is required");
   }

  const user = await User.create({
    userName:userName.toLowerCase(),
    email,
    fullName,
    avatar: avatar.url, 
    coverImage : coverImage?.url || "",
    password,

   })

   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)

   if(!createdUser){    
     throw new APiError(500,"Something went wrong while creating a new user")     
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )




});

export {
registerUser
};