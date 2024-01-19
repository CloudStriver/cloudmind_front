import { MyMessage } from './message/utils'

export const successMsg = (msg :string) => {
    MyMessage(msg, 1)
}

export const errorMsg = (msg :string) => {
    MyMessage(msg, -1)
}

export const warningMsg = (msg :string) => {
    MyMessage(msg, 0)
}
