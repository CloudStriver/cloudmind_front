import { useStore } from '@/store/index'
import { post } from '@/utils/request'
import { ref } from 'vue'

//创建文件接口
export interface createFiles {
    file: {
        name: string,
        url: string,
        type: string,
        fatherId: string,
        spaceSize: number,
        md5?: string, //创建文件夹时不填，创建文件时要填
    }
}

//搜索、查询用户文件列表接口
export interface getPrivateFiles {
    //搜索填
    searchOptions?: {
        allFieldsKey?: string, 
        multiFieldsKey: {
            name?: string,
            id?: string,
        },
        sortType?: number, //1:按创建时间升序排序 2:按创建时间降序排序 3按修改时间升序排序 4:按修改时间降序排序 5:按文件大小升序排序 6:按文件大小降序排序
    },
    filterOptions: {
        onlyFatherId: string,
        onlyType?: string[]
    },
    paginationOptions?: {
        limit?: number,
        lastToken?: string,
        backward?: boolean,
        offset?: number,
    }
}

//搜索、查询用户文件列表api
export const getPrivateFiles = (id: string) => {
    const data = ref<getPrivateFiles>({
        filterOptions: {
            onlyFatherId: id,
        },
        paginationOptions: { 
            limit: 40,
        }
    })
    const filesList = ref<any>([])
    post('/content/getPrivateFiles', data.value)
    .then((res: any) => {
        for (let i = 0; i < res.files.length; i ++) {
            res.files[i].createAt = getFileTime(res.files[i].createAt)
            res.files[i].updateAt = getFileTime(res.files[i].updateAt)
            res.files[i].spaceSize = getFileSize(res.files[i].spaceSize)
            res.files[i].path = res.fatherPath + "/" + res.files[i].name
            filesList.value.push(res.files[i])
        }
    })
    return filesList.value
}

//获取文件夹名列表
export const getFolderList = (id: string) => {
    const data = ref<getPrivateFiles>({
        filterOptions: {
            onlyFatherId: id,
            onlyType: ['文件夹']
        },
        paginationOptions: { 
            limit: 40,
        }
    })
    const foldersList = ref<any>([])
    post('/content/getPrivateFiles', data.value)
    .then((res: any) => {
        for (let i = 0; i < res.files.length; i ++) {
            foldersList.value.push(res.files[i])
        }
    })
    console.log(foldersList.value);
    
    return foldersList.value
}

//从url中获取fatherId
const store = useStore()
export const getFatherIdFromHerf = () => {
    if (store.fatherId === "") {
        const urls = window.location.href.split('/')
        const fatherId = urls[urls.length - 1]
        store.setFatherId(fatherId)
        return fatherId
    }
    else {
        return store.fatherId
    }
}

//时间戳转换
const getFileTime = (time: number): string => {
    const date = new Date(time); 
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');  
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
}

//文件大小转换
const getFileSize = (bits: number): string => {
    if (bits < 0) return '0B';
    else if (bits < 1024) {
        return bits + 'B'
    } 
    else if (bits < (1024*1024)) {
        const temp = bits / 1024
        return temp.toFixed(2)  + 'KB';
    } 
    else if (bits < (1024*1024*1024)) {
        const temp = bits / (1024*1024);
        return temp.toFixed(2) + 'MB';
    } 
    else {
        const temp = bits / (1024*1024*1024);
        return temp.toFixed(2) + 'GB';
    }
}

