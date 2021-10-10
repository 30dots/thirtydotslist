import axios from "axios"

export const jsdelivr = 'https://cdn.jsdelivr.net/gh/'

const apiClient = axios.create({
  baseURL: jsdelivr,
})

export async function fetchRawUrl(url) {
  return apiClient.get(url)
}
