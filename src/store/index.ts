import { defineStore } from 'pinia'

export const userStore = defineStore('user', {
    state: () =>{
        return {
            userId: "",
            userName: "",
            userSex: "男",
            userRegistTime: "",
            userIntroduce: "",
            userAccount: "",
            userPassword: "",  
            userAvatar: "",
            accessToken: "",
            refreshToken: "",
            chatToken: "",
            isAutoLogin: false
        }
    },

    actions: {
        setUserInfo (userId: string, accessToken:string, refreshToken:string, chatToken:string, isAutoLogin:boolean) {
            this.userId = userId
            this.accessToken = accessToken
            this.refreshToken = refreshToken
            this.chatToken = chatToken
            this.isAutoLogin = isAutoLogin
        },

        localSetUserInfo (userId: string, accessToken:string, refreshToken:string, chatToken:string, isAutoLogin:boolean) {
            localStorage.setItem("UserId", userId)
            localStorage.setItem("AccessToken", accessToken)
            localStorage.setItem("RefreshToken", refreshToken)
            localStorage.setItem("ChatToken", chatToken)
            localStorage.setItem("IsAutoLogin", isAutoLogin ? "true" : "false")
        },

        updateToken (accessToken:string, refreshToken:string, chatToken:string) {
            localStorage.setItem("AccessToken", accessToken)
            localStorage.setItem("RefreshToken", refreshToken)
            localStorage.setItem("ChatToken", chatToken)

            this.accessToken = accessToken
            this.refreshToken = refreshToken
            this.chatToken = chatToken
        },

        loginOut () {
            localStorage.removeItem("AccessToken")
            localStorage.removeItem("RefreshToken")
            localStorage.removeItem("ChatToken")

            this.accessToken = ""
            this.refreshToken = ""
            this.chatToken = ""
        }
    }
})