class ApiResponse{
    private data: any;
    private statusCode:Number;
    private message:string;
    private success:boolean;
    constructor(statusCode:Number , data:any , message:string , success:boolean=true){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = success;
    }
}

export default ApiResponse