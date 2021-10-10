import axios from "axios"

const apiClient = axios.create({
  baseURL: "/",
})

export async function fetchRawUrl(url) {
  return apiClient.get(url)
}