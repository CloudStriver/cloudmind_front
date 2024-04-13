import { defineStore } from 'pinia'
import {
    StorageAutoLogin,
    StorageAvatarUrl,
    StorageDoGetUser,
    StorageLongToken,
    StorageShortToken,
    StorageUserId
} from "@/utils/consts";

export const useStore = defineStore('user', {
    state: () =>{
        return {
            userId: "",
            userName: "",
            userSex: "男",
            userRegistTime: "",
            userIntroduce: "",
            userAccount: "",
            userPassword: "",  
            userAvatar: "https://cloudmind.top/assets/avatar.png",
            shortToken: "",
            longToken: "",
            fatherId: "",
            fatherIdName: "",
            isAutoLogin: "false",
            pathChange: "false",
            tempFileData: {
                fileId: "",
                userId: "",
                name: "",
                type: "",
                path: "",
                fatherId: "",
                spaceSize: "",
                md5: "",
                isDel: 0,
                description: "",
                updateAt: "",
                createAt: "",
                isChoose: false,
            }
        }
    },

    actions: {
        setUserDetail (name: string, sex: string, description: string, avatar: string) {
            this.userName = name
            this.userSex = sex
            this.userIntroduce = description
            this.userAvatar = avatar
        },
        setFatherId (fatherId: string) {
            this.fatherId = fatherId
        },
        getUserAvatar() {
            if (sessionStorage.getItem(StorageAvatarUrl) !== null) {
                this.userAvatar = sessionStorage.getItem(StorageAvatarUrl) as string
            }
            else if (localStorage.getItem(StorageAvatarUrl) !== null) {
                this.userAvatar = localStorage.getItem(StorageAvatarUrl) as string
            }
            return this.userAvatar
        },
        getUserId () {
            if (sessionStorage.getItem(StorageUserId) !== null) {
                this.userId = sessionStorage.getItem(StorageUserId) as string
            }
            else if (localStorage.getItem(StorageUserId) !== null) {
                this.userId = localStorage.getItem(StorageUserId) as string
            }
            return this.userId
        },

        setUserSession (shortToken: string, longToken: string, userId: string) {
            this.userId = userId
            this.shortToken = shortToken
            this.longToken = longToken
            this.isAutoLogin = "false"

            sessionStorage.setItem(StorageUserId, userId)
            sessionStorage.setItem(StorageShortToken, shortToken)
            sessionStorage.setItem(StorageLongToken, longToken)
            sessionStorage.setItem(StorageAutoLogin, "false")
            sessionStorage.setItem(StorageDoGetUser, "false")
        },
        setUserLocal (shortToken: string, longToken: string, userId: string) {
            this.userId = userId
            this.shortToken = shortToken
            this.longToken = longToken
            this.isAutoLogin = "true"

            localStorage.setItem(StorageUserId, userId)
            localStorage.setItem(StorageShortToken, shortToken)
            localStorage.setItem(StorageLongToken, longToken)
            localStorage.setItem(StorageAutoLogin, "true")
            localStorage.setItem(StorageDoGetUser, "false")
        },
        getUserLongToken () {
            if (sessionStorage.getItem(StorageLongToken) !== null) {
                this.longToken = sessionStorage.getItem(StorageLongToken) as string
            }
            else if (localStorage.getItem(StorageLongToken) !== null) {
                this.longToken = localStorage.getItem(StorageLongToken) as string
            }
            return this.longToken
        },
        getLoginType () {
            if (sessionStorage.getItem(StorageAutoLogin) !== null) {
                return 1
            }
            else if (localStorage.getItem(StorageAutoLogin) !== null) {
                return 2
            }
            else {
                return 0
            }
        },

        loginOut () {
            localStorage.clear()
            sessionStorage.clear()

            this.userId = ""
            this.shortToken = ""
            this.longToken = ""
            this.isAutoLogin = ""
        }
    }
})