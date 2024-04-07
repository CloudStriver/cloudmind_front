import { get } from '@/utils/request'
import { ref } from 'vue'
import {GetNotificationsUrl, NotificationType} from "@/utils/consts";
import {type Notification} from '@/utils/type'

export const getNotificationList = async(select: string) => {
    const notificationList = ref<Notification[]>([])
    const url = ref('')
    if (select === 'all') {
        url.value = GetNotificationsUrl
    }
    else {
        url.value = `${GetNotificationsUrl}?onlyType=${getOnlyType(select)}`
    }
    await get(true, url.value)
    .then((res: any) => {
        notificationList.value = res.notifications.map((notification:any) => ({
            fromName: notification.fromName,
            fromId: notification.fromId,
            toName: notification.toName,
            toId: notification.toId,
            toUserId: notification.toUserId,
            type: notification.type,
            createTime: notification.createTime
        }))
    })
    return notificationList.value
}

const getOnlyType = (select: string) => {
    switch (select) {
        case 'like':
            return NotificationType.Like
        case 'follow':
            return NotificationType.Follow
        case 'collect':
            return NotificationType.Collect
        case 'share':
            return NotificationType.Share
        case 'comment':
            return NotificationType.Comment
    }
}