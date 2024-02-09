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
            isAutoLogin: "false"
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
                if (localStorage.getItem('LongToken') || sessionStorage.getItem('LongToken')) {
                    this.userId = localStorage.getItem("UserId") || ""
                }
            }
            return this.userId 
        },
        setFatherId (fatherId: string) {
            this.fatherId = fatherId
        },

        setUserSession (shortToken: string, longToken: string, userId: string) {
            this.userId = userId
            this.shortToken = shortToken
            this.longToken = longToken
            this.isAutoLogin = "false"

            sessionStorage.setItem("UserId", userId)
            sessionStorage.setItem("ShortToken", shortToken)
            sessionStorage.setItem("LongToken", longToken)
            sessionStorage.setItem("isAutoLogin", "false")
        },
        setUserLocal (shortToken: string, longToken: string, userId: string) {
            this.userId = userId
            this.shortToken = shortToken
            this.longToken = longToken
            this.isAutoLogin = "true"

            localStorage.setItem("UserId", userId)
            localStorage.setItem("ShortToken", shortToken)
            localStorage.setItem("LongToken", longToken)
            localStorage.setItem("isAutoLogin", "true")
        },

        loginOut () {
            localStorage.removeItem("UserId")
            localStorage.removeItem("ShortToken")
            localStorage.removeItem("LongToken")
            sessionStorage.removeItem("UserId")
            sessionStorage.removeItem("ShortToken")
            sessionStorage.removeItem("LongToken")
            localStorage.removeItem("isAutoLogin")
            sessionStorage.removeItem("isAutoLogin")

            this.userId = ""
            this.shortToken = ""
            this.longToken = ""
            this.isAutoLogin = ""
        }
    }
})