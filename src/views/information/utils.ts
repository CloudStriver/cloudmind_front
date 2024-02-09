import { useStore  } from "@/store/index"
import { get } from "@/utils/request"
import { ref } from "vue"

const store = useStore()

export const getUserDetail = async() => {
    if (sessionStorage.getItem('LongToken') === null && localStorage.getItem('LongToken') === null) {
        return 
    }
    
    const detail = ref({
        name: '',
        sex: '',
        fullName: '',
        idCard: '',
        description: '',
        avatar: ''
    })
    await get('/content/getUserDetail')
    .then((res: any) => {
        detail.value.name = res.name,
        detail.value.sex = res.sex === 1 ? '男' : '女',
        detail.value.fullName = res.fullName === '' ? '未填写' : res.fullName,
        detail.value.idCard = res.idCard === '' ? '未填写' : res.idCard,
        detail.value.description = res.description === '' ? '未填写' : res.description,
        detail.value.avatar = res.url  === '' ? 'https://cloudmind.top/assets/avatar.png' : res.url
        store.setUserDetail(detail.value.name, detail.value.sex, detail.value.description, detail.value.avatar)
    })
    return detail.value
}