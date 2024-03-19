import { successMsg } from '@/utils/message';
import { get, post } from '@/utils/request'
import { ref } from 'vue'

//------------------------------------------------------------interface

//搜索/查看用户文件列表的参数
export interface requestPrivateFilesList {
    id?: string;
    name?: string;
    onlyType?: string[];
    lastToken?: string;
    allFieldsKey?: string;

    limit: number;
    offset: number;
    sortType?: number;
    backward: boolean;
    onlyFatherId?: string;
}

//搜索/查看用户文件列表的返回
export interface responsePrivateFilesList {
    files: [
        {
            fileId: string,
            userId: string,
            name: string,
            type: string,
            path: string
            fatherId: string,
            spaceSize: string,
            isDel: number,
            zone: string,
            subZone: string,
            description: string,
            updateAt: string,
            createAt: string,
        }
    ],
    total: number,
    token: string,
    fatherIdPath: string,
    fatherNamePath: string
}

//查看回收站的返回
export interface responseRecycleFilesList {
    files: [
        {
            fileId: string,
            userId: string,
            name: string,
            type: string,
            path: string
            fatherId: string,
            spaceSize: string,
            isDel: number,
            zone: string,
            subZone: string,
            description: string,
            updateAt: string,
            createAt: string,
            isChoose: boolean
        }
    ],
    total: number,
    token: string,
}


//进入文件夹时的文件类型
export interface fileData {
    fileId: string,
    userId: string,
    name: string,
    type: string,
    path: string
    fatherId: string,
    spaceSize: string,
    isDel: number,
    zone: string,
    subZone: string,
    description: string,
    updateAt: string,
    createAt: string,
}

//创建文件的参数
export interface requestCreateFile {
    fatherId: string;
    md5: string;
    name: string;
    spaceSize: number;
    type: string;
}

//------------------------------------------------------------request

//请求下载文件
export const postAskDownloadFile = (fileIds: string[], filesName: string[]) => {
    post('/content/askDownloadFile', { fileIds })
    .then((res: any) => {
        const len = res.urls.length
        for(let i = 0; i < len; i++) {
            downloadFile(res.urls[i], filesName[i])
            console.log(res.urls[i]);
        }
    })
}
const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
//请求删除文件
export const postDeleteFile = async(fileId: string):Promise<void> => {
    await post('/content/deleteFile', { 
        fileId,
        deleteType: 2
    })
    .then(() => {
        successMsg('成功移动至回收站')
    })
}

//查看回收站文件列表的请求URL
export const getRecycleFilesList = async(params: requestPrivateFilesList): Promise<responseRecycleFilesList> => {
    const filesList = ref<responseRecycleFilesList>({
        files: [
            {
                fileId: "",
                userId: "",
                name: "",
                type: "",
                path: "",
                fatherId: "",
                spaceSize: "",
                isDel: 0,
                zone: "",
                subZone: "",
                description: "",
                updateAt: "",
                createAt: "",
                isChoose: false 
            }
        ],
        total: 0,
        token: "",
    })
    const url = '/content/getRecycleBinFiles' + generateGetRequestURL(params)
    await get(url)
    .then ((res: any) => {
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
                createAt: turnTime(file.createAt),
                spaceSize: getFileSize(file.spaceSize),
            })),
            total: res.total,
            token: res.token,
        }
    })
    return filesList.value
}

//请求移动文件
export const postMoveFile = async(fileId: string, fatherId: string):Promise<void> => {
    await post('/content/moveFile', { fileId, fatherId })
}

//请求创建文件
export const postCreateFile = async(data: requestCreateFile):Promise<string> => {
    const fileId = ref<string>("")
    await post('/content/createFile', data)
    .then((res: any) => {
        fileId.value = res.fileId
    })
    return fileId.value
}

//请求搜索/查看用户文件列表
export const getPrivateFilesList = async(params: requestPrivateFilesList): Promise<responsePrivateFilesList> => {
    const filesList = ref<responsePrivateFilesList>({
        files: [
            {
                fileId: "",
                userId: "",
                name: "",
                type: "",
                path: "",
                fatherId: "",
                spaceSize: "",
                isDel: 0,
                zone: "",
                subZone: "",
                description: "",
                updateAt: "",
                createAt: "",
            }
        ],
        total: 0,
        token: "",
        fatherIdPath: "",
        fatherNamePath: "",
    })
    const url = '/content/getPrivateFiles' + generateGetRequestURL(params)
    await get(url)
    .then ((res: any) => {
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
                createAt: turnTime(file.createAt),
                spaceSize: getFileSize(file.spaceSize),
            })),
            total: res.total,
            token: res.token,
            fatherIdPath: res.fatherIdPath,
            fatherNamePath: res.fatherNamePath
        }
    })
    return filesList.value
}

//------------------------------------------------------------function

//生成搜索/查看用户文件列表的请求URL
const generateGetRequestURL = (params: any) => {
    let query = "?"
    const key = Object.keys(params)
    key.forEach((item) => {
        query += (item + "=" + params[item] + "&")
    })
    return query
}

//在个人空间中，根据路由获取父文件id：fatherId
//当处于根目录时，fatherId = userId
export const getPersonalFatherId = ():string => {
    const fatherId = location.href.split('/').pop() as string
    return fatherId       
}

//时间戳转换为 YY-MM-DD HH:MM的形式
export const turnTime = (time: number) => {
    const date = new Date(time); 
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');  
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

//转换文件默认的大小
export const getFileSize = (bits: number): string => {
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