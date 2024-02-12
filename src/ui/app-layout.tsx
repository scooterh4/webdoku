import Board from "./board"
import Actions from "./actions"
import NumericKeypad from "./numeric-keypad"
import { Grid, Typography } from "@mui/material"
import { useIsPuzzleFinishedContext } from "../context/app-context"
import NewGameButton from "./new-game-button"

export default function AppLayout() {
  const isPuzzleFinished = useIsPuzzleFinishedContext()

  console.log("isPuzzleFinished in app-layout", isPuzzleFinished)
  return (
    <Grid
      container
      direction={"row"}
      alignItems={"center"}
      minHeight={"75vh"}
      rowSpacing={2}
    >
      <Grid item xs={12}>
        <Typography variant="h1" textAlign={"center"}>
          Webdoku
        </Typography>
      </Grid>
      {isPuzzleFinished && (
        <Grid item xs={12} textAlign={"center"} marginBottom={2}>
          <NewGameButton />
        </Grid>
      )}
      <Grid item md={8} xs={12}>
        <Board />
      </Grid>
      <Grid item md={4} xs={12}>
        <Actions />
        <NumericKeypad />
      </Grid>
    </Grid>
  )
}
