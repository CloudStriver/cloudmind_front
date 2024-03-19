import { get } from './request'

export const getAllNotificationCount = async(fn: () => void): Promise<number> => {
    let total: number = 0
    await get('/system/getNotificationCount')
    .then((res: any) => {
        total = res.total
        fn()
    })
    return total 
}
export const getTypeNotificationCount = async(type: number, fn: () => {}): Promise<number> => {
    let total: number = 0
    const url = `/system/getNotificationCount?type=${type}`
    await get(url)
    .then((res: any) => {
        total = res
        fn()
    })
    return total
}

export const turnTime = (time: number) => {
    const date = new Date(time); 
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');  
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}