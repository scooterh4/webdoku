import Board from "./board"
import Actions from "./actions"
import NumericKeypad from "./numeric-keypad"
import { Grid, Typography } from "@mui/material"
import {
  useIsPuzzleFinishedContext,
  useLoadingContext,
} from "../context/app-context"
import NewGameButton from "./new-game-button"

export default function AppLayout() {
  const isPuzzleFinished = useIsPuzzleFinishedContext()
  const isLoading = useLoadingContext()

  return (
    <Grid
      container
      display={"grid"}
      gridAutoRows={"120px"}
      alignItems={"center"}
      rowSpacing={2}
      sx={{
        backgroundColor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Typography
        gridRow={"1"}
        variant={"h1"}
        textAlign={"center"}
        color={"primary"}
      >
        Webdoku
      </Typography>

      <Grid
        container
        maxWidth={"md"}
        justifySelf={"center"}
        gridRow={{ md: "span 5", sm: "span 6", xs: "span 5" }}
        display={"flex"}
      >
        {isPuzzleFinished && !isLoading && (
          <Grid
            item
            xs={12}
            textAlign={"center"}
            marginBottom={{ md: 5, xs: 3 }}
            marginTop={{ md: 0, xs: 10 }}
          >
            <NewGameButton />
          </Grid>
        )}
        <Grid
          container
          item
          justifyContent={{ md: "end", xs: "center" }}
          md={6}
          xs={12}
          marginBottom={{ md: 0, xs: 2 }}
          zIndex={1}
        >
          <Board />
        </Grid>

        <Grid
          container
          item
          justifyContent={"center"}
          alignItems={"center"}
          md={6}
          xs={12}
          zIndex={0}
        >
          <Actions />
          <NumericKeypad />
        </Grid>
      </Grid>
    </Grid>
  )
}
