export class ApiResponse {
    public data: any = null;
    public message: string | null = null;
    public success: boolean | null = null;

    constructor(data?: any, message?: string, success: boolean = false) {
        this.data = data;
        this.message = message;
        this.success = success;
    }

    public setData(data: any) {
        this.data = data;
    }

    public setMessage(message: string) {
        this.message = message;
    }

    public setSuccess(success: boolean) {
        this.success = success;
    }
}