import {
  useIsPuzzleFinishedContext,
  useMakeNotesContext,
  useSudokuAPI,
} from "../context/app-context"
import { Badge, Box, IconButton } from "@mui/material"
import BackspaceIcon from "@mui/icons-material/Backspace"
import EditIcon from "@mui/icons-material/Edit"
import OptionsMenu from "./options-menu"
import NewGameButton from "./new-game-button"
// import SettingsButton from "./settings-button"

export default function Actions() {
  const { eraseSelectedCell, setMakeNotes } = useSudokuAPI()
  const notesStatus = useMakeNotesContext()
  const isPuzzleFinished = useIsPuzzleFinishedContext()

  function callEraseCell() {
    eraseSelectedCell()
  }

  function callMakeNotes() {
    setMakeNotes()
  }

  return (
    <Box>
      <IconButton onClick={() => callEraseCell()} disabled={isPuzzleFinished}>
        <BackspaceIcon />
      </IconButton>

      <IconButton onClick={() => callMakeNotes()} disabled={isPuzzleFinished}>
        <Badge
          badgeContent={notesStatus ? "On" : "Off"}
          color={notesStatus ? "success" : "secondary"}
        >
          <EditIcon />
        </Badge>
      </IconButton>

      <OptionsMenu disabled={isPuzzleFinished} />

      {/* <SettingsButton /> */}

      {!isPuzzleFinished && <NewGameButton />}
    </Box>
  )
}
