import React from "react"
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import { useSudokuAPI } from "../context/app-context"

export default function NumericKeypad() {
  const { keyboardButtonClicked } = useSudokuAPI()

  // Function to handle button click, passing the number back
  const handleButtonClick = (number: number) => {
    keyboardButtonClicked(number)
  }

  return (
    <Grid container marginTop={2} spacing={1}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
        <Grid item xs={4} key={number}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => handleButtonClick(number)}
          >
            {number}
          </Button>
        </Grid>
      ))}
    </Grid>
  )
}
