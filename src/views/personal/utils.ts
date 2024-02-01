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
export interface responseCreateFiles {
    file: {
        fileId: string,
        userId: string,
        name: string,
        type: string,
        path: string,
        fatherId: string,
        spaceSize: string,
        md5: string,
        isDel: boolean,
        updateAt: number,
        url: string,
        createAt: number,
    }
}

const fileMap = new Map<string, string>()

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
        onlyFileType?: number
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
    const filesList = ref<responseCreateFiles[]>([])
    post('/content/getPrivateFiles', data.value)
    .then((res: any) => {
        for (let i = 0; i < res.files.length; i ++) {
            res.files[i].createAt = getFileTime(res.files[i].createAt)
            res.files[i].updateAt = getFileTime(res.files[i].updateAt)
            res.files[i].spaceSize = getFileSize(res.files[i].spaceSize)
            fileMap.set(res.files[i].fileId, res.files[i].name)     
            res.files[i].path = getFilePath(res.files[i].path)       
            filesList.value.push(res.files[i])
        }
    })
    console.log(filesList.value);
    
    return filesList.value
}

const store = useStore()
export const getFatherIdFromHerf = () => {
    if (store.fatherId === "") {
        const urls = window.location.href.split('/')
        const fatherId = urls[urls.length - 1]
        store.setFatherId(fatherId)
        return fatherId
    }
}

const getFileTime = (time: number): string => {
    const date = new Date(time); 
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');  
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
}
const getFileSize = (bits: number): string => {
    const bytes = bits / 8; // 将位转换为字节
    if (bytes >= 1024 * 1024) {
        return (bytes / (1024 * 1024)).toFixed(2) + " MB"; // 转换为兆字节
    } else if (bytes >= 1024) {
        return (bytes / 1024).toFixed(2) + " KB"; // 转换为千字节
    } else {
        return bytes.toFixed(2) + " bytes"; // 使用字节
    }
}
const getFilePath = (path: string): string => {
    const paths = path.split('/')
    paths[0] = 'CloudMind'
    for (let i = 1; i < paths.length - 1; i ++) {
        paths[i] = fileMap.get(paths[i]) as string
    }
    paths[paths.length - 1] = fileMap.get(paths[paths.length - 1]) as string
    return paths.join('/')
}

