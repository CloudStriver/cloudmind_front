import { get } from '@/utils/request'

export interface ResponseGetNotification {
    notifications: Array<{
        fromName: string
        fromId: string
        toName: string
        toId: string
        toType: number
        type: number
        createTime: number
    }>
    token: string
}

export const getNotifications = () => {
    const url = '/system/getNotifications'
    get(url)
    .then((res: any) => {
        console.log(res)
    })
}

export const getNotificationsCount = async() => {
    const url = '/system/getNotificationCount'
    let count = 0
    await get(url)
    .then((res: any) => {
        count = res.total
    })

    return count
}