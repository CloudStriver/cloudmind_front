import COS from 'cos-js-sdk-v5'
import { post } from './request'

const Bucket = 'cloudmind-1318210890'
const Region = 'ap-guangzhou'
const cos = new COS({
    getAuthorization: (options: any, callback: any) => {
        const name = options.Key.split('/')[1]
         post(true, '/auth/askUploadAvatar', {
            name,
            avatarSize: options.SliceSize
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

export const cosUploadImage = (file: any, md5: string, suffix: string, onUploadComplete: () => void) => {
    cos.uploadFile({
        Bucket,
        Region,
        Key: `users/${md5}${suffix}`,
        Body: file,
        SliceSize: file.size,
        onProgress: (progressData: any) => {
            if (progressData.percent === 1) {
                onUploadComplete();
            }
            console.log(progressData);
        }
    }, (err: any, data: any) => {
        console.log(err || data);
    })
}