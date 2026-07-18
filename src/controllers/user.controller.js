import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const register = asyncHandler(async(req,res)=>{
    const {fullname,email,password,username} = req.body;

    if(
        [fullname,email,password,username].some(field => field.trim() === "")
    ){
        throw new ApiError(400,"All fields are required")
    }

    const existingUser = await User.findOne({
        $or:[
            {email}, {username}
        ]
    });

    if(!existingUser){
        throw new ApiError(409,"User already exists")
    }

    const avatarLocalFilePath = req.files?.avatar[0]?.path;
    const coverImageLocalFilePath = req.files?.coverImage[0]?.path;

    if(!avatarLocalFilePath){
        throw new ApiError(400,"Avatar file is required")
    }

    if(!coverImageLocalFilePath){
        throw new ApiError(400,"CoverImage file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalFilePath)

    const coverImage = await uploadOnCloudinary(coverImageLocalFilePath)

    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }

    if(!coverImage){
        throw new ApiError(400,"CoverImage file is required")
    }

    const user = await User.create({
        fullName,
        email,
        username:username.toLowerCase(),
        password,
        avatar: avatar.secure_url,
        coverImage: coverImage.secure_url,
    });

     const createdUser = await User.findById(user._id)
     .select("-password refreshToken")

     if(!createdUser){
        throw new ApiError(400,"Something went wrong while creating user")
     }

     return res.status(201).json(
        new ApiResponse(200,createdUser,"User created successfully")
     )

})

export {register}