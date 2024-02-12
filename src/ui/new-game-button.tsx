import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material"
import { useState } from "react"
import {
  useIsPuzzleFinishedContext,
  useSudokuAPI,
} from "../context/app-context"

export default function NewGameButton() {
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const { getNewGame } = useSudokuAPI()
  const isPuzzleFinished = useIsPuzzleFinishedContext()
  const buttonText = isPuzzleFinished ? "Start a new game" : "New game"

  function startNewGame() {
    getNewGame()
    setShowDialog(false)
  }

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        variant={isPuzzleFinished ? "contained" : "text"}
        size={isPuzzleFinished ? "large" : "small"}
      >
        {buttonText}
      </Button>
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
