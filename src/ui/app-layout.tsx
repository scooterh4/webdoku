import React from "react"
import Board from "./board"
import Actions from "./actions"
import NumericKeypad from "./numeric-keypad"
import { Grid, Typography } from "@mui/material"
import { SudokuProvider } from "../context/app-context"

export default function AppLayout() {
  return (
    <SudokuProvider>
      <Grid
        container
        direction={"row"}
        alignItems={"center"}
        minHeight={"75vh"}
      >
        <Grid item xs={12}>
          <Typography variant="h2" textAlign={"center"}>
            Webdoku
          </Typography>
        </Grid>
        <Grid item md={8} xs={12}>
          <Board />
        </Grid>
        <Grid item md={4} xs={12}>
          <Actions />
          <NumericKeypad />
        </Grid>
      </Grid>
    </SudokuProvider>
  )
}
