class ApiError extends Error {
    public statusCode: number;
    public data: any; 
    public success: boolean;
    public errors: any[]; 

    constructor(
        statusCode: number,
        message: string = "Something Went Wrong",
        success: boolean = false,
        errors: any[] = [],
        stack?: string
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.success = success;
        this.errors = errors;
        this.message = message;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    toJSON() {
        return {
            statusCode: this.statusCode,
            data: this.data,
            success: this.success,
            errors: this.errors,
            message: this.message
        };
    }
}


export {ApiError}