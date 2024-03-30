import { useStore  } from "@/store/index"
import {get, post} from "@/utils/request"
import { ref } from "vue"

const store = useStore()

//获取个人信息
export const getUserDetail = async() => {
    const detail = ref({
        name: '',
        sex: '',
        description: '',
        avatar: '',
        tags: [],
        fullName: '',
        idCard: '',
    })
    await get('/content/getUserDetail')
    .then((res: any) => {
        detail.value.name = res.name
        detail.value.sex = res.sex === 1 ? '男' : '女'
        detail.value.fullName = res.fullName === '' ? '未填写' : res.fullName
        detail.value.idCard = res.idCard === '' ? '未填写' : res.idCard
        detail.value.description = res.description === '' ? '未填写' : res.description
        detail.value.avatar = res.url
        detail.value.tags = res.tags
        if (store.getLoginType() === 1) {
            sessionStorage.setItem("avatarUrl", detail.value.avatar)
        }
        else {
            localStorage.setItem("avatarUrl", detail.value.avatar)
        }
        store.setUserDetail(detail.value.name, detail.value.sex, detail.value.description, detail.value.avatar)
    })
    return detail.value
}

//获取用户信息
export const getUserInfo = async (userId: string) => {
    const detail = ref({
        name: '',
        sex: '',
        description: '',
        avatar: '',
        tags: [],
        followed: false,
        followedCount: 0,
        followCount: 0,
        createTime: 0,
    })
    await get('/content/getUser?userId=' + userId)
        .then((res: any) => {
            detail.value.name = res.name
            detail.value.sex = res.sex === 1 ? '男' : '女'
            detail.value.description = res.description === '' ? '未填写' : res.description
            detail.value.avatar = res.url
            detail.value.tags = res.tags === '' ? [] : res.tags
            detail.value.followCount = res.followCount
            detail.value.followedCount = res.followedCount
            detail.value.followed = res.followed
            detail.value.createTime = res.createTime
        })
    return detail.value
}
export const updateUser = async (name?: String, fullName?:String, url?:String, sex?:number, idCard?:String,description?:String) => {
    await post('/content/updateUser', {
        name: name,
        fullName: fullName,
        url: url,
        sex: sex,
        idCard: idCard,
        description: description
    });
}