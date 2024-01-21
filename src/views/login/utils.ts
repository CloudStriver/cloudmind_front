export const judgeEmail = (email: string):boolean => {
    const expression = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    const objExp = new RegExp(expression)
    return objExp.test(email)
}

export const judgePassword = (password: string):boolean => {
    const expression = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/
    const objExp = new RegExp(expression)
    return objExp.test(password)
}
