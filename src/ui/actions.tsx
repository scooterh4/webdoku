import {
  useIsPuzzleFinishedContext,
  useMakeNotesContext,
  useSudokuAPI,
} from "../context/app-context"
import { Badge, Grid, IconButton } from "@mui/material"
import BackspaceIcon from "@mui/icons-material/Backspace"
import EditIcon from "@mui/icons-material/Edit"
import OptionsMenu from "./options-menu"
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
    <Grid
      container
      justifyContent={"center"}
      height={{ md: "10px", xs: "140px" }}
      marginBottom={{ md: 0, sm: 5 }}
      spacing={{ md: 7, sm: 13.5, xs: 8.5 }}
    >
      <Grid item>
        <IconButton
          size={"large"}
          onClick={() => callEraseCell()}
          disabled={isPuzzleFinished}
        >
          <BackspaceIcon />
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton
          size={"large"}
          onClick={() => callMakeNotes()}
          disabled={isPuzzleFinished}
        >
          <Badge
            badgeContent={notesStatus ? "On" : "Off"}
            color={notesStatus ? "success" : "secondary"}
          >
            <EditIcon />
          </Badge>
        </IconButton>
      </Grid>
      <Grid item>
        <OptionsMenu disabled={isPuzzleFinished} />
      </Grid>

      {/* <SettingsButton /> */}
      {/* <Grid item>{!isPuzzleFinished && <NewGameButton />}</Grid> */}
    </Grid>
  )
}
