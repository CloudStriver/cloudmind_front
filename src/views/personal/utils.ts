import { useStore } from '@/store/index'

export interface createFiles {
    file: {
        userId: string,
        name: string,
        type: number, //Type_null = 0; Type_audio = 1; Type_video = 2; Type_photo = 3; Type_word = 4; Type_ppt = 5; Type_zip = 6; Type_excel = 7; Type_pdf = 8; Type_folder = 9; Type_file = 10; Type_code = 11; Type_unknown = 12;
        fatherId: string,
        spaceSize: number,
        md5?: string, //创建文件夹时不填，创建文件时要填
        isDel: number, //(默认为1）1:未删除 2:软删除 3:彻底删除
    }
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
