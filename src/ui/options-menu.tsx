import React from "react"
import LinearScaleIcon from "@mui/icons-material/LinearScale"
import { IconButton, Menu, MenuItem } from "@mui/material"
import { useSudokuAPI } from "../context/app-context"

export default function OptionsMenu() {
  const { checkSelectedCell, revealSelectedCell } = useSudokuAPI()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
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

  return (
    <>
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
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
        }}
      >
        <MenuItem onClick={onCheckCell}>Check cell</MenuItem>
        <MenuItem onClick={onRevealCell}>Reveal cell</MenuItem>
        <MenuItem onClick={handleClose}>Check puzzle</MenuItem>
        <MenuItem onClick={handleClose}>Reveal puzzle</MenuItem>
        <MenuItem onClick={handleClose}>Reset puzzle</MenuItem>
      </Menu>
    </>
  )
}
