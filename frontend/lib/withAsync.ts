import { toastSuccess, toastError } from './toast'

export async function withAsync<T>(fn: () => Promise<T>, ok: string) {
  try {
    const data = await fn()
    toastSuccess(ok)
    return data
  } catch (e: any) {
    toastError(e.message ?? 'Unexpected error')
    throw e
  }
}
