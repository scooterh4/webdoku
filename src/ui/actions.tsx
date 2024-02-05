import React, { useState } from "react"
import { useSudokuAPI } from "../context/app-context"
import { Button } from "@mui/base"
import {
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
} from "@mui/material"
import BackspaceIcon from "@mui/icons-material/Backspace"

export default function Actions() {
  const { getNewGame, eraseSelectedCell } = useSudokuAPI()
  const [showDialog, setShowDialog] = useState<boolean>(false)

  function startNewGame() {
    getNewGame()
    setShowDialog(false)
  }

  function callEraseCell() {
    eraseSelectedCell()
  }

  return (
    <Box>
      <IconButton onClick={() => callEraseCell()}>
        <BackspaceIcon />
      </IconButton>

      <Button onClick={() => setShowDialog(true)}>New game</Button>
      <Dialog open={showDialog}>
        <DialogTitle>Are you sure you want to start a new game?</DialogTitle>
        <DialogActions>
          <Button onClick={startNewGame}>Yes</Button>
          <Button onClick={() => setShowDialog(false)}>No</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
