import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { request } from './request'

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => request('/user/{id}', 'get', { id }),
  })
}
