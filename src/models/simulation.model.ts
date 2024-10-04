import mongoose , {Schema , Document, ObjectId} from "mongoose";


interface Waypoint {
    alt: number;
    lat: number;
    lng: number;
    time?:number;
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
    time:{
        type:Number,
        default:0
    }
});

export interface Flight extends Document{
    drone_id:ObjectId,
    mission_name:string,
    waypoints:Waypoint[],
    speed:number,
    mission_start:number,
    mission_end:number,
    distance:number,
    flightId:string
}


const simulationSchema = new  Schema<Flight>({
    drone_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Drone',
        required:[true , "Drone is Required For Execution of Mission"]
    },
    mission_name:{
        type:String,
        required:[true , "Mission Name Missing"]
    },
    waypoints:[{
        type:WaypointSchema,
        required:[true , "Waypoints are Required"],
        default:[]
    }],
    speed:{
        type:Number,
        required:[true , "Speed Of Drone is Needed To Start Mission"],
        default:0
    },
    mission_start:{
        type:Number,
        required:[true , "Mission Start Time is Required"],
        default:(Date.now() / 1000)
    },
    mission_end: {
        type: Number, // Store end time in seconds
        default: null
    },
    distance:{
        type:Number,
        required:true
    },
    flightId:{
        type:String,
        required:[true , "Flight Id Doesn't Found"]
    }
},{timestamps:true})

const FlightLogs = mongoose.model("FlightLog",simulationSchema);
export default FlightLogs;
