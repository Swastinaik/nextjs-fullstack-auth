import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";


connect()


export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {email} = reqBody

        console.log(reqBody);

        //check if user already exists
        const user = await User.findOne({email})
    console.log("user ", user);
        if(!user){
            return NextResponse.json({error: "User dosen't exists for forget password "}, {status: 400})
        }

        //hash password
        //const salt = await bcryptjs.genSalt(10)
        //const hashedPassword = await bcryptjs.hash(password, salt)

        /*const newUser = new User({
            username,
            email,
            password: hashedPassword
        })*/
        //console.log("new user ", newUser);
        //const savedUser = await newUser.save()
        //console.log("user saved succesfullty into database ",savedUser);

        //send verification email

        await sendEmail({email, emailType: "RESET", userId: user._id})

        return NextResponse.json({
            message: "Check the email to change the password",

        })
        
        


    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})

    }
}