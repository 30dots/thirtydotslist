import React from "react"
import { Helmet } from "react-helmet"
import MainLayout from "@/layouts/Main"
import List from "@/components/List"

const Page = () => {
  return (
    <MainLayout>
      <Helmet />
      <List />
    </MainLayout>
  )
}

export default Page
