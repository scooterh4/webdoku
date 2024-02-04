import React from "react"
import { SudokuProvider } from "./context/app-context"
import Board from "./ui/board"

function App() {
  return (
    <SudokuProvider>
      <Board />
    </SudokuProvider>
  )
}

export default App
