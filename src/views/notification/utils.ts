import { get } from '@/utils/request'
import { ref } from 'vue'
import { GetNotificationsUrl} from "@/utils/consts";

export interface ResponseGetNotification {
    notifications: Array<{
        fromName: string
        fromId: string
        toName: string
        toId: string
        toUserId: string
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
        url.value = GetNotificationsUrl
    }
    else {
        url.value = `${GetNotificationsUrl}?onlyType=${type}`
    }
    await get(true, url.value)
    .then((res: any) => {
        notifications.value = {
            notifications: res.notifications
        }
    })
    console.log(notifications.value.notifications);
    
    return notifications.value.notifications
}
