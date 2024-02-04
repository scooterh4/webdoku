import React from "react"
import Cell from "./cell"
import { useLoadingContext, usePuzzleContext } from "../context/app-context"
import { Grid } from "@mui/material"

const Board: React.FC = () => {
  const puzzle = usePuzzleContext()
  const loading = useLoadingContext()

  return loading ? (
    <div>Loading...</div>
  ) : (
    <div>
      {puzzle.map((row, rowIndex) => (
        <Grid container direction="row" display={"flex"}>
          {row.map((cellData, colIndex) => (
            <Cell key={`${rowIndex}-${colIndex}`} cellData={cellData} />
          ))}
        </Grid>
      ))}
    </div>
  )
}

export default Board
