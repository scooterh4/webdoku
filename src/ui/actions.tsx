import React, { useState } from "react"
import { useMakeNotesContext, useSudokuAPI } from "../context/app-context"
import { Button } from "@mui/base"
import {
  Badge,
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
} from "@mui/material"
import BackspaceIcon from "@mui/icons-material/Backspace"
import EditIcon from "@mui/icons-material/Edit"

export default function Actions() {
  const { getNewGame, eraseSelectedCell, setMakeNotes } = useSudokuAPI()
  const notesStatus = useMakeNotesContext()
  const [showDialog, setShowDialog] = useState<boolean>(false)

  function startNewGame() {
    getNewGame()
    setShowDialog(false)
  }

  function callEraseCell() {
    eraseSelectedCell()
  }

  function callMakeNotes() {
    setMakeNotes()
  }

  return (
    <Box>
      <IconButton onClick={() => callEraseCell()}>
        <BackspaceIcon />
      </IconButton>

      <IconButton onClick={() => callMakeNotes()}>
        <Badge
          badgeContent={notesStatus ? "On" : "Off"}
          color={notesStatus ? "success" : "secondary"}
        >
          <EditIcon />
        </Badge>
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
