export const judgeEmail = (email: string):boolean => {
    const expression = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    const objExp = new RegExp(expression)
    return objExp.test(email)
}