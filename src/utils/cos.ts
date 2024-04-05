import COS from 'cos-js-sdk-v5'
import { post } from './request'
import {AskUploadFileUrl} from "@/utils/consts";

/*
创建cos(全局唯一的，用来上传文件的) ->
用户需要上传文件->  cos.UploadFile(options,密钥)
-> getAuthorization(options, callback) -> 获取临时密钥
-> callback()将密钥传回UploadFile -> 上传文件
*/
// 有两个bucket 
// 私人的bucket 用来存储用户的文件
// 私人的bucket:
// const Bucket = 'cloudmind-file-1318210890'
// const Region = 'ap-shanghai'
// 公共的bucket 用来存储用户头像/帖子标题图片等
// const Bucket = 'cloudmind-1318210890'
// const Region = 'ap-guangzhou'

const Bucket = 'cloudmind-file-1318210890'
const Region = 'ap-shanghai'
const cos = new COS({
    getAuthorization: (options: any, callback: any) => {
        // users/md5.suffix  从该字符传中提取md5和suffix
        const name = options.Key.split('/')[1]
        // options.Key = users/md5.suffix 
         post(false, AskUploadFileUrl, {
            name,
            fileSize: options.SliceSize
        })
        .then((res: any) => {
            callback({
                TmpSecretId: res.tmpSecretId,
                TmpSecretKey: res.tmpSecretKey,
                StartTime: res.startTime, // 时间戳，单位秒，如：1580000000
                ExpiredTime: res.expiredTime, // 时间戳，单位秒，如：1580000000
                ScopeLimit: true, // 细粒度控制权限需要设为 true，会限制密钥只在相同请求时重复使用
                SecurityToken: res.sessionToken, // 如果使用临时密钥，需要把 sessionToken 传给 SecurityToken
            })
        })
    }
})

export const cosUploadFile = (file: any, md5: string, suffix: string, callback: Function) => {
    cos.uploadFile({
        Bucket,
        Region,
        Key: `users/${md5}${suffix}`,
        Body: file,
        SliceSize: file.size,
        onProgress: (progressData: any) => {
            console.log(progressData.percent)
        },
        onFileFinish: function (err) {   /* 非必须 */
            if(!err) {
                callback()
            }
        },
    }, (err: any, data: any) => {
        console.log(err || data);
    })
}

// export let cosUploadProgress = {
//     set cosUploadProgress(value: number) {
//         this.cosUploadProgress = value
//     },
//     get cosUploadProgress() {
//         return this.cosUploadProgress
//     }
// } 