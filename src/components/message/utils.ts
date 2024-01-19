let message: string = "";
let messageType: number = 0;

export const getMyMessage = () => {
    return {
        message,
        messageType
    }
}

export const MyMessage = (msg: string, type: number) => {
    message = msg;
    messageType = type;
}

