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

export interface responseGetPrivateFiles {
    files: {
        fileId: string,
        userId: string,
        name: string,
        type: string,
        path: string,
        fatherId: string,
        spaceSize: string,
        md5: string,
        isDel: number,
        zone: string,
        subZone: string,
        description: string,
        updateAt: string,
        createAt: string,
    }[],
    fatherNamePath: string,
    fatherIdPath: string,
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
export const getPrivateFiles = async(id: string) => {
    const data = ref<getPrivateFiles>({
        filterOptions: {
            onlyFatherId: id,
        },
        paginationOptions: { 
            limit: 40,
        }
    })
    const filesList = ref<responseGetPrivateFiles>({
        files: [],
        fatherNamePath: '',
        fatherIdPath: ''
    })
    await post('/content/getPrivateFiles', data.value)
    .then((res: any) => {
        filesList.value = {
            files: res.files.map((file: any) => ({
                fileId: file.fileId,
                userId: file.userId,
                name: file.name,
                type: file.type,
                path: `${res.fatherNamePath}/${file.name}`,
                fatherId: file.fatherId,
                md5: file.md5,
                updateAt: getFileTime(file.updateAt),
                spaceSize: getFileSize(file.spaceSize),
                createAt: getFileTime(file.createAt)
            })),
            fatherNamePath: res.fatherNamePath,
            fatherIdPath: res.fatherIdPath
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

