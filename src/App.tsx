import React from "react"
import { SudokuProvider } from "./context/app-context"
import Board from "./ui/board"
import Actions from "./ui/actions"
import { ToastContainer } from "react-toastify"
import NumericKeypad from "./ui/numeric-keypad"
import { Grid } from "@mui/material"

function App() {
  return (
    <>
      <ToastContainer position="top-center" />
      <SudokuProvider>
        <Grid container direction={"row"}>
          <Grid item md={6} xs={12}>
            <Board />
          </Grid>
          <Grid item md={6} xs={12}>
            <Actions />
            <NumericKeypad />
          </Grid>
        </Grid>
      </SudokuProvider>
    </>
  )
}

export default App
