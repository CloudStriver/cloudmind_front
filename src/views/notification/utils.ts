import { get, post } from '@/utils/request'
import { ref } from 'vue'

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
}

export const getNotifications = async(type: number) => {
    const notifications = ref<ResponseGetNotification>({
        notifications: []
    })

    const url = ref('')
    if (type === 0) {
        url.value = '/system/getNotifications'
    }
    else {
        url.value = `/system/getNotifications?onlyType=${type}`
    }
    await get(url.value)
    .then((res: any) => {
        notifications.value = {
            notifications: res.notifications
        }
    })
    return notifications.value.notifications
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

export const updateNotifications = () => {
    post('/system/updateNotifications')
}