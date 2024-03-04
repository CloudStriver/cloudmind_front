import { useStore } from '@/store/index'
import { get } from '@/utils/request'
import { ref } from 'vue'
import { turnTime } from '@/utils/public'

//创建文件接口
export interface createFiles {
    name: string,
    type: string,
    fatherId: string,
    spaceSize: number,
    md5?: string, //创建文件夹时不填，创建文件时要填
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
    allFieldsKey?: string,
    name?: string,
    id?: string,
    sortType: number,
    onlyFatherId: string,
    onlyType?: string[],
    limit: number,
    lastToken?: string,
    backward: boolean,
    offset: number,
}

//搜索、查询用户文件列表api
export const getPrivateFiles = async(id: string) => {
    const data = ref<getPrivateFiles>({
        sortType: 3,
        onlyFatherId: id,
        limit: 100,
        backward: true,
        offset: 0
    })
    const filesList = ref<responseGetPrivateFiles>({
        files: [],
        fatherNamePath: '',
        fatherIdPath: ''
    })
    const params = new URLSearchParams(data.value as any).toString()
    const url = `/content/getPrivateFiles?${params}`
    await get(url)
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
                updateAt: turnTime(file.updateAt),
                spaceSize: getFileSize(file.spaceSize),
                createAt: turnTime(file.createAt)
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
        sortType: 3,
        onlyFatherId: id,
        limit: 100,
        backward: true,
        offset: 0,
        onlyType: ['文件夹']
    })
    const params = new URLSearchParams(data.value as any).toString()
    const url = `/content/getPrivateFiles?${params}`
    const foldersList = ref<any>([])
    get(url)
    .then((res: any) => {
        for (let i = 0; i < res.files.length; i ++) {
            foldersList.value.push(res.files[i])
        }
    })
    return foldersList.value
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

