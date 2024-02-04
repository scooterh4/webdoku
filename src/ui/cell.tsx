import React from "react"
import { CellData, useSudokuAPI } from "../context/app-context"
import { Box, Typography } from "@mui/material"

interface CellProps {
  cellData: CellData
}

const Cell: React.FC<CellProps> = React.memo(({ cellData }) => {
  const { selectCell } = useSudokuAPI()

  const handleClick = () => {
    selectCell(cellData.location)
  }

  const displayValue = cellData
    ? typeof cellData.value === "number"
      ? cellData.value.toString()
      : Array.from(cellData.value).join(", ")
    : "0"

  if (cellData.isSelected) {
    console.log("this cell is selected", cellData)
  }
  console.log("cell render")

  return (
    <Box
      onClick={handleClick}
      border={1}
      padding={2}
      style={{
        cursor: "pointer",
        backgroundColor: cellData.isSelected
          ? "lightblue"
          : cellData.prefilled
          ? "lightgray"
          : "transparent",
      }}
    >
      <Typography color={displayValue === "0" ? "transparent" : "black"}>
        {displayValue}
      </Typography>
    </Box>
  )
})

export default Cell
