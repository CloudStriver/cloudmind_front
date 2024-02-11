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
        setFatherId (fatherId: string) {
            this.fatherId = fatherId
        },
        getUserId () {
            if (sessionStorage.getItem("UserId") !== null) {
                this.userId = sessionStorage.getItem("UserId") as string
            }
            else if (localStorage.getItem("UserId") !== null) {
                this.userId = localStorage.getItem("UserId") as string
            }
            return this.userId
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