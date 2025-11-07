export type ResponsePagi<T = any> = {
    statusCode: number;
    message: string;
    data: {
        pageNumber: number;
        pageSize: number;
        totalRecord: number;
        totalPages: number;
        items: T[];
    };
}

export type ResponseNoPagi<T = any> = {
    statusCode: number;
    message: string;
    data: T;
}