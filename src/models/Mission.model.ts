import mongoose , {Schema ,Document} from "mongoose";

interface Waypoint {
    alt: number;
    lat: number;
    lng: number;
}

export interface Mission extends Document{
    name:string,
    initial_speed:Number,
    initial_alt:Number,
    wayPoints:Waypoint[],
    drone:mongoose.Types.ObjectId
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
        }
    },{timestamps:true}
)

export const MisssionModel = (mongoose.models.Misssion as mongoose.Model<Mission>) || (mongoose.model("Misssion",MissionSchema));
export default MisssionModel;