import {successMsg} from '@/utils/message';
import {get, post} from '@/utils/request'
import {ref} from 'vue'
import {turnTime} from "@/utils/utils";
import {
    AskDownloadFileUrl,
    CompletelyRemoveFileUrl,
    CreateFileUrl,
    DeleteFileUrl,
    GetPrivateFilesUrl,
    GetRecycleBinFilesUrl,
    MoveFileUrl
} from "@/utils/consts";

//------------------------------------------------------------interface

// 文件信息
interface File {
    fileId: string;
    userId: string;
    name: string;
    type: string;
    path: string;
    fatherId: string;
    spaceSize: string;
    isDel: number;
    zone: string;
    subZone: string;
    description: string;
    updateAt: string;
    createAt: string;
    isChoose: boolean;
}

//搜索/查看用户文件列表的参数
export interface requestPrivateFilesList {
    id?: string;
    name?: string;
    onlyType?: string[];
    onlyCategory?: number;
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
    files: File[],
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
    category: number;
}

//------------------------------------------------------------request

//请求下载文件
export const postAskDownloadFile = (fileIds: string[], filesName: string[]) => {
    post(true, AskDownloadFileUrl, { fileIds })
    .then((res: any) => {
        const len = res.urls.length
        for(let i = 0; i < len; i++) {
            downloadFile(res.urls[i], filesName[i])
            console.log(res.urls[i]);
        }
    })
}
const downloadFile = (url: string, fileName: string) => {
    //创建a标签并模拟点击，实现下载
    const link = document.createElement('a')
    fetch(url).then(res => res.blob()).then(blob => { 
        link.href = URL.createObjectURL(blob)
        link.download = fileName; 
        document.body.appendChild(link)
        link.click()
        window.URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
    })
}

// 请求彻底删除文件
export const postCleanOutFile = async(fileIdList: string[]) :Promise<void> => {
    await post(false, CompletelyRemoveFileUrl, {
        fileIds: fileIdList
    })
        .then(() => {
            successMsg('成功彻底删除')
        })
}

//请求删除文件
export const postDeleteFile = async(fileIds: string[]):Promise<void> => {
    await post(true, DeleteFileUrl, {
        fileIds,
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
    await get(true, GetRecycleBinFilesUrl + generateGetRequestURL(params))
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
    await post(true, MoveFileUrl, { fileId, fatherId })
}

//请求创建文件
export const postCreateFile = async(data: requestCreateFile):Promise<any> => {
    const fileId = ref<string>("")
    await post(true, CreateFileUrl, data)
    .then((res: any) => {
        fileId.value = res.id
        data.name = res.name
    })
    return {
        fileId: fileId.value,
        name: data.name
    
    }
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
    await get( true,GetPrivateFilesUrl + generateGetRequestURL(params))
    .then ((res: any) => {
        filesList.value = {
            files: res.files.map((file: any) => ({
                fileId: file.id,
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
export const generateGetRequestURL = (params: any) => {
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
    return location.href.split('/').pop() as string
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

// 通过类型推断出分类
export const getCategory = (type: String): number => {
    if (type.startsWith('image/')) {
        return 2; // 图片类型
    } else if (type.startsWith('video/')) {
        return 3; // 视频类型
    } else if (type.startsWith('audio/')) {
        return 4; // 音乐类型
    } else {
        return 1; // 其他类型
    }
}

