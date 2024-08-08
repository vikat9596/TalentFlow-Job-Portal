import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js"
import {User} from "../models/userSchema.js";
import {v2 as cloudinary} from "cloudinary";
import {sendToken} from "../utils/jwtToken.js"

import crypto from "crypto";
import nodemailer from "nodemailer";

export const register = catchAsyncErrors(async(req,res,next)=> {
    try {
        const {name,email,phone,address,password,role,firstNiche,secondNiche,thirdNiche,coverLetter} = req.body;

        if(!name || !email || !phone || !address || !password || !role){
            return next(new ErrorHandler("All Fields are required", 400));
        }
        if(role ==="Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)){
            return next(new ErrorHandler("Please provide your preffered niches.", 400));
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return next(new ErrorHandler("Email is already registered", 400));
        }

        const userData ={
            name,
            email,
            phone,
            address,
            password,
            role, 
            niches:{
                firstNiche,secondNiche,thirdNiche},
            coverLetter
        };
        if(req.files && req.files.resume){
            const {resume} = req.files;
            if(resume){
                try {
                    const cloudinaryResponse = await cloudinary.uploader.upload(resume.tempFilePath, {folder: "Job_Seekers_Resume"})
                    if(!cloudinaryResponse || cloudinaryResponse.error){
                        return next(new ErrorHandler("Failed to upload resume to cloud."), 500);
                    }
                    userData.resume = {
                        public_id: cloudinaryResponse.public_id,
                        url:cloudinaryResponse.secure_url
                    }
                } catch (error) {
                    return next(new ErrorHandler("Failed to upload resume",500))
                }
            }
        }
        const user =await User.create(userData);
        sendToken(user,201,res,"User Registered")
        // res.status(201).json({
        //     success:true,
        //     message:"User Registered"
        // })

    } catch (error) {
        next(error);
    }
})

export const login = catchAsyncErrors(async(req,res,next) => {
    const {role,email,password} =req.body;
    if(!role || !email || !password){
        return next(new ErrorHandler("Email, Password and role is required", 400));
    }

    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid Email or Password",400))
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password",400))
    }
    if(user.role !== role){
        return next(new ErrorHandler("Invalid User Role",400))
    }
    sendToken(user,200,res,"User logged in Successfully")

});

export const logout = catchAsyncErrors(async(req,res,next)=> {
    res.status(200).cookie("token","",{
        expire: new Date(Date.now()),
        httpOnly: true,
    }).json({
        success:true,
        message:"Logged out Successfully"
    })
})

export const getUser = catchAsyncErrors(async(req,res,next) =>{
    const user = req.user;
    res.status(200).json({
        success:true,
        user,
    })
});

export const updateProfile = catchAsyncErrors(async(req,res,next) => {
    const newUserData ={
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        coverLetter: req.body.coverLetter,
        niches:{
            firstNiche: req.body.firstNiche,
            secondNiche: req.body.secondNiche,
            thirdNiche: req.body.thirdNiche,
        }
    }

    const {firstNiche,secondNiche,thirdNiche} = newUserData.niches;

    if(req.user.role ==="Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)){
        return next(new ErrorHandler("Please provide your all job niches", 400));
    }
    if(req.files){
        const resume= req.files.resume;
        if(resume){
            const currentResumeId = req.user.public_id;
            if(currentResumeId){
                await cloudinary.uploader.destroy(currentResumeId);
            }
            const newReume = await cloudinary.uploader.upload(resume.tempFilePath, {
                folder:"Job_Seekers_Resume"
            });
            newUserData.resume= {
                public_id: newReume.public_id,
                url: newReume.secure_url,
            }
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify: false
    });
    res.status(200).json({
        success:true,
        user,
        message:"Profile Updated"
    })
});

export const updatePassword = catchAsyncErrors(async(req,res,next) =>{
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is incorrect",400));

    }
    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("new password and confirm password do not match ",400));
    } 

    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res, "Password Updated Successfully.");

})


//more functions



// Other existing imports...

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    
    // Set token and expiration
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

    await user.save();

    const transporter = nodemailer.createTransport({
        service: 'Gmail', // e.g. use 'Gmail' or any other email provider
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. 
    Please make a PUT request to: \n\n ${resetUrl}`;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password Reset",
        text: message,
    });

    res.status(200).json({
        success: true,
        message: "Email sent to " + user.email,
    });
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetToken = req.params.token;
    const user = await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ErrorHandler("Reset Token is invalid or has expired", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords do not match", 400));
    }

    user.password = req.body.newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    
    sendToken(user, 200, res, "Password has been reset successfully.");
});
