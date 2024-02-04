import React, { useState } from "react"
import { useSudokuAPI } from "../context/app-context"
import { Button } from "@mui/base"
import { Dialog, DialogActions, DialogTitle } from "@mui/material"

export default function Actions() {
  const { getNewGame } = useSudokuAPI()
  const [showDialog, setShowDialog] = useState<boolean>(false)

  function startNewGame() {
    getNewGame()
    setShowDialog(false)
  }

  return (
    <>
      <Button onClick={() => setShowDialog(true)}>Get new game</Button>
      <Dialog open={showDialog}>
        <DialogTitle>Are you sure you want to start a new game?</DialogTitle>
        <DialogActions>
          <Button onClick={startNewGame}>Yes</Button>
          <Button onClick={() => setShowDialog(false)}>No</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
