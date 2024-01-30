import { useStore } from '@/store/index'
import { post } from '@/utils/request'
import { ref } from 'vue'

//创建文件接口
export interface createFiles {
    file: {
        name: string,
        type: number, //1:音频 2:视频 3:图片 4:文档 5:幻灯片 6:压缩包 7:表格 8:pdf 9:文件夹 10:文件 11:代码 12:其他
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
        }
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
    const filesList = ref<any>([])
    post('/content/getPrivateFiles', data.value)
    .then((res: any) => {
        for (let i = 0; i < res.files.length; i ++) {
            filesList.value.push(res.files[i])
        }
    })
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

export const getTypeFromSuffix = (suffix: string) => {
    const type = suffix.split('.').pop()
    switch (type) {
        case 'mp3':
        case 'wav':
        case 'ogg':
        case 'acc':
        case 'ape':
        case 'flac':
            return 1
        case 'mp4':
        case 'avi':
        case 'mov':
        case 'mkv':
        case 'flv':
        case 'rmvb':
            return 2
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'webp':
            return 3
        case 'doc':
        case 'docx':
            return 4
        case 'ppt':
        case 'pptx':
            return 5
        case 'zip':
        case 'rar':
            return 6
        case 'xls':
        case 'xlsx':
            return 7
        case 'pdf':
            return 8
        case 'folder':
            return 9
        case 'file':
            return 10
        case 'code':
            return 11
        default:
            return 12
    }
}
