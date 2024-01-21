export const debounce = (fn: Function, delay: Number) => {
    let timer: NodeJS.Timeout | null = null
    return (...args: any[]) => {
        if (timer) {
            clearTimeout(timer as NodeJS.Timeout)
        }
        timer = setTimeout(() => {
            fn(...args)
        }, delay as number)
    }
}

export const throttle = (fn: Function, delay: number) => {
    let oldTime = Date.now()
    return (...args: any[]) => {
        const newTime = Date.now()
        if (newTime - oldTime >= delay) {
            fn(...args)
            oldTime = newTime
        }
    }
}