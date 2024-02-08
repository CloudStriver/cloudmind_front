import { defineStore } from 'pinia'

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
            isAutoLogin: false
        }
    },

    actions: {
        setUserDetail (name: string, sex: string, description: string, avatar: string) {
            this.userName = name
            this.userSex = sex
            this.userIntroduce = description
            this.userAvatar = avatar
        },
        getUserId () {
            if (this.userId == "") {
                this.userId = localStorage.getItem("UserId") || ""
            }
            return this.userId 
        },
        setFatherId (fatherId: string) {
            this.fatherId = fatherId
        },
        
        setUserInfo (userId: string, shortToken:string, longToken:string, chatToken:string, isAutoLogin:boolean) {
            this.userId = userId
            this.shortToken = shortToken
            this.longToken = longToken
            this.isAutoLogin = isAutoLogin
        },

        localSetUserInfo (userId: string, shortToken:string, longToken:string, chatToken:string, isAutoLogin:boolean) {
            localStorage.setItem("UserId", userId)
            localStorage.setItem("ShortToken", shortToken)
            localStorage.setItem("LongToken", longToken)
            localStorage.setItem("ChatToken", chatToken)
            localStorage.setItem("IsAutoLogin", isAutoLogin ? "true" : "false")
        },

        updateToken (shortToken:string, longToken:string, chatToken:string) {
            localStorage.setItem("ShortToken", shortToken)
            localStorage.setItem("LongToken", longToken)
            localStorage.setItem("ChatToken", chatToken)

            this.shortToken = shortToken
            this.longToken = longToken
        },

        loginOut () {
            localStorage.removeItem("UserId")
            localStorage.removeItem("ShortToken")
            localStorage.removeItem("LongToken")

            this.userId = ""
            this.shortToken = ""
            this.longToken = ""
        }
    }
})