import { Grid, Typography } from "@mui/material"

interface Props {
  notes: Set<number>
}

export default function CellNotes({ notes }: Props) {
  return (
    <Grid container style={{ width: "100%", height: "100%" }}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
        <Grid
          item
          xs={4}
          key={number}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            lineHeight="1"
            fontSize="7pt"
            fontWeight="bold"
            color={notes.has(number) ? "black" : "transparent"}
            style={{
              width: "100%",
              textAlign: "center",
              visibility: notes.has(number) ? "visible" : "hidden",
            }} // Use visibility hidden for better accessibility
          >
            {number}
          </Typography>
        </Grid>
      ))}
    </Grid>
  )
}
