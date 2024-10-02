import mongoose , {Schema ,Document} from "mongoose";


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


export const DroneModel = (mongoose.models.Drone as mongoose.Model<Drone>) || (mongoose.model("Drone",DroneSchema));
export default DroneModel;