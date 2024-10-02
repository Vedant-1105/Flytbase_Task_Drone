class ApiResponse{
    private data: any;
    private statusCode:Number;
    private message:string;
    private success:boolean;
    constructor(statusCode:Number , data:void , message:string , success:boolean){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = success;
    }
}