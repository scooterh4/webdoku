import React from "react"
import { SudokuProvider } from "./context/app-context"
import Board from "./ui/board"
import Actions from "./ui/actions"
import { ToastContainer } from "react-toastify"

function App() {
  return (
    <>
      <ToastContainer position="top-center" />
      <SudokuProvider>
        <Board />
        <Actions />
      </SudokuProvider>
    </>
  )
}

export default App
