import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export interface User extends Document {
    username: string,
    email: string,
    password: string,
    drones: mongoose.Types.ObjectId[],
    missions: mongoose.Types.ObjectId[],
    refreshToken: string
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "User name is Required Field "],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is Required Field "],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is Required Field "],
    },
    drones: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Drone"
    }],
    missions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mission"
    }],
    refreshToken: {
        type: String
    }
}, { timestamps: true })




UserSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

UserSchema.methods.isPasswordCorrect = async function(password:string):Promise<boolean>{
    const user = this as User; 
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
}

UserSchema.methods.generateAccessToken = async function() {
    const user = this as User;
    const secret:any = process.env.ACCESS_TOKEN_SECRET
    return jwt.sign(
        {
            _id: user._id,
            username: user.username,
        },
        secret,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}

UserSchema.methods.generateRefreshToken = async function(){
    const user = this as User;
    return jwt.sign(
        {
            _id:this._id,
            username: this.username
        },
        process.env.REFRESH_TOKEN_SECRET || "cwiiwhnecenec",
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



export const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model("User",UserSchema));
export default UserModel;

