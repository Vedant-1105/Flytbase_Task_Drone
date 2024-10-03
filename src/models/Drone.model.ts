import mongoose , {Schema ,Document} from "mongoose";
import UserModel from "./User.model";


export interface Drone extends Document {
    name: string,
    drone_type: string,
    make_name: string,
    createdBy: mongoose.Types.ObjectId,
    isBusy:boolean
}

const DroneSchema:Schema<Drone> = new Schema(
    {
        name:{
            type:String,
            required:[true , "Done Name Is Required"]
        },
        drone_type:{
            type:String,
            required:[true , "Drone Type Is Required"]
        },
        make_name:{
            type:String,
            required:[true , "Make Name Is Required"]
        },
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:[true , "User ID Is Required"]
        },
        isBusy:{
            type:Boolean,
            default:false
        }
    },{timestamps:true}
)


DroneSchema.pre("save" , async function(next){
    const drone:Drone = this;
    if(!drone.isNew){
        console.log("Drone Already Registred ")
        return;
    }
    const user = await UserModel.findById(drone.createdBy);
    if(!user){
        console.log("user Not Found While Creating Drone")
        return;
    }
    if(drone._id && drone){
        const droneId = drone._id as mongoose.Schema.Types.ObjectId;
        user.drones.push(droneId)
        await user.save();
    }
    next();
})


export const DroneModel = (mongoose.models.Drone as mongoose.Model<Drone>) || (mongoose.model("Drone",DroneSchema));
export default DroneModel;