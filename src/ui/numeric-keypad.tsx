import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import {
  useIsPuzzleFinishedContext,
  useSudokuAPI,
} from "../context/app-context"
import { Typography } from "@mui/material"

export default function NumericKeypad() {
  const isPuzzleFinished = useIsPuzzleFinishedContext()
  const { keyboardButtonClicked } = useSudokuAPI()

  // Function to handle button click, passing the number back
  const handleButtonClick = (number: number) => {
    keyboardButtonClicked(number)
  }

  return (
    <Grid
      container
      spacing={1}
      rowSpacing={0}
      width={{ md: 350, sm: 450, xs: 320 }}
      height={200}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
        <Grid item xs={4} key={number}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => handleButtonClick(number)}
            disabled={isPuzzleFinished}
            sx={{
              border: 2,
              height: "100%",
            }}
          >
            <Typography variant="h3">{number}</Typography>
          </Button>
        </Grid>
      ))}
    </Grid>
  )
}
