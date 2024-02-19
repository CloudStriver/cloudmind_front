export const judgeEmail = (email: string):boolean => {
    const expression = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    const objExp = new RegExp(expression)
    return objExp.test(email)
}

export const judgePassword = (password: string):boolean => {
    const expression = /^(?=.*[A-Za-z])(?=.*\d).{8,20}$/ 
    const objExp = new RegExp(expression)
    return objExp.test(password)
}

export const judgeHasLogin = () => {
    if (localStorage.getItem('LongToken') || sessionStorage.getItem('LongToken')) {
        return true
    }
    else {
        return false
    }
}