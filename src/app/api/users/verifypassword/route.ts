import {connect} from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";


connect()


export async function POST(request: NextRequest){

    try {
        const reqBody = await request.json()
        const {token, Password} = reqBody
        console.log(token);
        console.log("password ", Password)
        const user = await User.findOne({forgotPasswordToken: token, forgotPasswordTokenExpiry: {$gt: Date.now()}});

        if (!user) {
            return NextResponse.json({error: "Invalid token"}, {status: 400})
        }
        console.log(user);

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(Password, salt)
        user.password = hashedPassword
        user.isVerfied = true;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;
        await user.save();
        
        return NextResponse.json({
            message: "password changed successfully",
            success: true
        })


    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }

}