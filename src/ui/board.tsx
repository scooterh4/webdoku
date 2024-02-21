import React from "react"
import Cell from "./cell"
import {
  useLoadingContext,
  usePuzzleContext,
  useRevealCellContext,
} from "../context/app-context"
import { Grid } from "@mui/material"

const Board: React.FC = () => {
  const puzzle = usePuzzleContext()
  const loading = useLoadingContext()
  const revealCell = useRevealCellContext()

  return loading ? (
    <div>Loading...</div>
  ) : (
    <div>
      {puzzle.map((row, rowIndex) => (
        <Grid
          key={`row-${rowIndex}`}
          container
          direction="row"
          // maxWidth={350}
          // minWidth={250}
          display={"flex"}
        >
          {row.map((cellData, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              cellData={cellData}
              revealCell={
                revealCell
                  ? cellData.location.row === revealCell.row &&
                    cellData.location.col === revealCell.col
                  : false
              }
            />
          ))}
        </Grid>
      ))}
    </div>
  )
}

export default Board
