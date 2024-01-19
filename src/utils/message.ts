import { ElMessage } from "element-plus";

export const infoMsg = (message: string) => {
    ElMessage(message)
  }
export const successMsg = (message: string) => {
  ElMessage({
    message: message,
    type: 'success',
  })
}
export const warning = (message: string) => {
  ElMessage({
    message: message,
    type: 'warning',
  })
}
export const errorMsg = (message: string) => {
  ElMessage.error(message)
}