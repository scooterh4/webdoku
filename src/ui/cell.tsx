import React from "react"
import {
  CellData,
  CellLocation,
  useShowConflictsContext,
  useSudokuAPI,
} from "../context/app-context"
import { Box, Typography } from "@mui/material"
import CellNotes from "./cell-notes"

interface CellProps {
  cellData: CellData
}

function getCellBorder(location: CellLocation) {
  const isTopRow = location.row === 0
  const isBottomRow = location.row === 8
  const isLeftColumn = location.col === 0
  const isRightColumn = location.col === 8

  const top = isTopRow ? 5 : location.row % 3 === 0 ? 4.75 : 0.25
  const bottom = isBottomRow ? 5 : 0.25
  const left = isLeftColumn ? 5 : location.col % 3 === 0 ? 4.75 : 0.25
  const right = isRightColumn ? 5 : 0.25

  return { left, right, top, bottom }
}

const Cell: React.FC<CellProps> = React.memo(({ cellData }) => {
  const { selectCell } = useSudokuAPI()
  const cellBorder = getCellBorder(cellData.location)
  const showConflicts = useShowConflictsContext()

  const handleClick = () => {
    selectCell(cellData.location)
  }

  const displayValue = cellData ? (
    typeof cellData.value === "number" ? (
      <Typography
        color={cellData.value === 0 ? "transparent" : "black"}
        visibility={cellData.value === 0 ? "hidden" : "visible"}
        fontSize={"24pt"}
      >
        {cellData.value}
      </Typography>
    ) : (
      <CellNotes notes={cellData.value} />
    )
  ) : (
    <Typography visibility={"hidden"}>0</Typography>
  )

  console.log("cell render")

  return (
    <Box
      onClick={handleClick}
      borderLeft={cellBorder.left}
      borderRight={cellBorder.right}
      borderTop={cellBorder.top}
      borderBottom={cellBorder.bottom}
      width={40}
      height={40}
      display="flex"
      justifyContent="center"
      alignItems="center"
      style={{
        cursor: "pointer",
        backgroundColor:
          cellData.hasConflicts && showConflicts
            ? "lightsalmon"
            : cellData.isSelected
            ? "gold"
            : cellData.isPeer
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
