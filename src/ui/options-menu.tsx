import React, { useState } from "react"
import LinearScaleIcon from "@mui/icons-material/LinearScale"
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material"
import { useSudokuAPI } from "../context/app-context"

interface props {
  disabled: boolean
}

export default function OptionsMenu({ disabled }: props) {
  const {
    checkSelectedCell,
    revealSelectedCell,
    checkPuzzle,
    revealPuzzle,
    resetPuzzle,
  } = useSudokuAPI()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const { getNewGame } = useSudokuAPI()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const onCheckCell = () => {
    checkSelectedCell()
    setAnchorEl(null)
  }

  const onRevealCell = () => {
    revealSelectedCell()
    setAnchorEl(null)
  }

  const onCheckPuzzle = () => {
    checkPuzzle()
    setAnchorEl(null)
  }

  const onRevealPuzzle = () => {
    revealPuzzle()
    setAnchorEl(null)
  }

  const onResetPuzzle = () => {
    resetPuzzle()
    setAnchorEl(null)
  }

  const onStartNewGame = () => {
    getNewGame()
    setShowDialog(false)
  }

  return (
    <>
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        disabled={disabled}
      >
        <LinearScaleIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
          sx: { backgroundColor: "white" },
        }}
      >
        <MenuItem onClick={onCheckCell}>Check cell</MenuItem>
        <MenuItem onClick={onRevealCell}>Reveal cell</MenuItem>
        <MenuItem onClick={onCheckPuzzle}>Check puzzle</MenuItem>
        <MenuItem onClick={onRevealPuzzle}>Reveal puzzle</MenuItem>
        <MenuItem onClick={onResetPuzzle}>Reset puzzle</MenuItem>
        <MenuItem onClick={() => setShowDialog(true)}>New game</MenuItem>
      </Menu>
      <Dialog open={showDialog}>
        <DialogTitle>Are you sure you want to start a new game?</DialogTitle>
        <DialogActions>
          <Button onClick={onStartNewGame}>Yes</Button>
          <Button onClick={() => setShowDialog(false)}>No</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
