import mongoose , {Schema ,Document, ObjectId} from "mongoose";
import UserModel from "./User.model";

interface Waypoint {
    alt: number;
    lat: number;
    lng: number;
}
// (path, grid/survey, )
enum MissionCategory {
    path = 'path',
    survey = 'survey',
    corridor = 'corridor',
}

export interface Mission extends Document{
    name:string,
    initial_speed:Number,
    initial_alt:Number,
    wayPoints:Waypoint[],
    category: MissionCategory,
    drone:mongoose.Types.ObjectId,
    createdby:mongoose.Types.ObjectId
}
const WaypointSchema = new Schema<Waypoint>({
    alt: {
      type: Number,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
});

const MissionSchema:Schema<Mission> = new Schema(
    {
        name:{
            type:String,
            required:[true , "Mission Name is Required"]
        },
        initial_speed:{
            type:Number,
            required:[true , "Initial Speed is Required"],
            default:0
        },
        initial_alt:{
            type:Number,
            required:[true , "Initial Altitude is Required"],
            default:0
        },
        wayPoints:[{
            type:WaypointSchema,
            required:[true , "Waypoints are Required"],
            default:[]
        }],
        drone:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Drone',
            required:[true , "At Least a Drone is Required"],
        },
        category: {
            type: String,
            enum: Object.values(MissionCategory),
            required: [true, "Mission Category is Required"]
        },
        createdby:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:[true , "User ID Is Required"]
        },
    },{timestamps:true}
)



MissionSchema.pre("save",async function(next){
    const mission:Mission = this ;
    try {
        if(!mission.isNew){
            console.log("Mission is new ");
            return;
        }
        const user = await UserModel.findById(mission.createdby);
        if(!user){
            console.log("user Not found");
            return;
        }
        console.log(mission._id);
        if(mission._id){
            const missionId = mission._id as mongoose.Schema.Types.ObjectId;
            user.missions.push(missionId);
            await user.save({validateBeforeSave:false});
        }
        next();
    } catch (error) {
        console.log("Error While Saving Mission to Error",error);
    }

})

export const MisssionModel = (mongoose.models.Misssion as mongoose.Model<Mission>) || (mongoose.model("Mission",MissionSchema));
export default MisssionModel;