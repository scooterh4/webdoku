import React from "react"
import { ToastContainer } from "react-toastify"
import AppLayout from "./ui/app-layout"
import { Container } from "@mui/material"

function App() {
  return (
    <Container maxWidth={"md"}>
      <ToastContainer position="top-center" theme="colored" />
      <AppLayout />
    </Container>
  )
}

export default App
