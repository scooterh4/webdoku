import React from "react"
import { CellData, useSudokuAPI } from "../context/app-context"
import { Box, Typography } from "@mui/material"
import CellNotes from "./cell-notes"

interface CellProps {
  cellData: CellData
}

const Cell: React.FC<CellProps> = React.memo(({ cellData }) => {
  const { selectCell } = useSudokuAPI()

  const handleClick = () => {
    selectCell(cellData.location)
  }

  const displayValue = cellData ? (
    typeof cellData.value === "number" ? (
      <Typography
        color={cellData.value === 0 ? "transparent" : "black"}
        visibility={cellData.value === 0 ? "hidden" : "visible"}
      >
        {cellData.value}
      </Typography>
    ) : (
      <CellNotes notes={cellData.value} />
    )
  ) : (
    <Typography visibility={"hidden"}>0</Typography>
  )

  return (
    <Box
      onClick={handleClick}
      border={1}
      padding={0}
      width={40}
      height={40}
      display="flex"
      justifyContent="center"
      alignItems="center"
      style={{
        cursor: "pointer",
        backgroundColor: cellData.isSelected
          ? "lightblue"
          : cellData.prefilled
          ? "lightgray"
          : "transparent",
      }}
    >
      {displayValue}
    </Box>
  )
})

export default Cell
