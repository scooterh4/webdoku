import { ToastContainer } from "react-toastify"
import AppLayout from "./ui/app-layout"
import { Container } from "@mui/material"
import { SudokuProvider } from "./context/app-context"

function App() {
  return (
    <Container maxWidth={"md"}>
      <ToastContainer position="top-center" theme="colored" />
      <SudokuProvider>
        <AppLayout />
      </SudokuProvider>
    </Container>
  )
}

export default App
