import React from "react"
import {
  CellData,
  CellLocation,
  // useShowConflictsContext,
  useSudokuAPI,
} from "../context/app-context"
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material"
import CellNotes from "./cell-notes"

interface CellProps {
  cellData: CellData
  revealCell: boolean
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

const Cell: React.FC<CellProps> = React.memo(({ cellData, revealCell }) => {
  const { selectCell } = useSudokuAPI()
  // const showConflicts = useShowConflictsContext()
  const cellBorder = getCellBorder(cellData.location)
  const theme = useTheme()
  const xsScreen = useMediaQuery(theme.breakpoints.only("xs"))

  const handleClick = () => {
    selectCell(cellData.location)
  }

  const displayValue = cellData ? (
    typeof cellData.value === "number" ? (
      <Typography
        // color={cellData.prefilled ? "black" : "darkmagenta"}
        visibility={cellData.value === 0 ? "hidden" : "visible"}
        fontSize={"24pt"}
        fontWeight={cellData.prefilled ? "bold" : "normal"}
      >
        {cellData.value}
      </Typography>
    ) : (
      <CellNotes notes={cellData.value} />
    )
  ) : (
    <Typography visibility={"hidden"}>0</Typography>
  )

  const isConflict = cellData.conflicts.length > 0
  //&& showConflicts

  const backgroundColor =
    revealCell || cellData.isCorrect
      ? "#8BC57E"
      : isConflict ||
        (typeof cellData.isCorrect === "boolean" && !cellData.isCorrect)
      ? "#C57E8B"
      : cellData.isSelected
      ? "gold"
      : cellData.isSameValueAsSelect
      ? "#7E8BC5"
      : cellData.isPeer
      ? "#CED3E9"
      : cellData.prefilled
      ? "lightgray"
      : "transparent"

  console.log("cell render")

  return (
    <Box
      onClick={handleClick}
      borderLeft={cellBorder.left}
      borderRight={cellBorder.right}
      borderTop={cellBorder.top}
      borderBottom={cellBorder.bottom}
      width={xsScreen ? 30 : 45}
      height={xsScreen ? 35 : 45}
      display="flex"
      justifyContent="center"
      alignItems="center"
      style={{
        cursor: "pointer",
        backgroundColor: backgroundColor,
      }}
    >
      {displayValue}
    </Box>
  )
})

export default Cell
