import axios from "axios"

export const githubUrl = 'https://raw.githubusercontent.com/'

const apiClient = axios.create({
  baseURL: githubUrl,
})

export async function fetchRawUrl(url) {
  return apiClient.get(url)
}
