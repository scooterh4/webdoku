import { CellData, CellLocation, State } from "./app-context"
import { NewPuzzleData } from "./fetch-new-puzzle"

export type Actions =
  | { type: "selectCell"; location: CellLocation }
  | { type: "setNewGame"; data: NewPuzzleData }
  | { type: "setLoading"; loading: boolean }
  | { type: "keyboardButtonClicked"; value: number }
  | { type: "eraseSelectedCell" }
  | { type: "setMakeNotes" }

export const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case "selectCell":
      // Create a deep copy of the puzzle to ensure changes create a new reference
      const newPuzzle = state.puzzle.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isSelectedCell =
            rowIndex === action.location.row && colIndex === action.location.col
          const isPeer =
            rowIndex === action.location.row ||
            colIndex === action.location.col ||
            (Math.floor(rowIndex / 3) === Math.floor(action.location.row / 3) &&
              Math.floor(colIndex / 3) === Math.floor(action.location.col / 3))
          const isPrev = cell.isPeer || cell.isSelected

          if (isSelectedCell) {
            // Update isSelected for the selected cell
            return { ...cell, isSelected: true } // Toggle or set true as needed
          }
          if (isPeer) {
            return { ...cell, isSelected: false, isPeer: true }
          }
          if (isPrev) {
            return { ...cell, isSelected: false, isPeer: false }
          }

          return cell // Return other cells as-is
        })
      )

      return {
        ...state,
        selectedCell: action.location,
        puzzle: newPuzzle,
      }

    case "setNewGame":
      return {
        ...state,
        puzzle: action.data.puzzle,
        solution: action.data.solution,
        selectedCell: null, // Reset selection with new game
      }

    case "setLoading":
      return {
        ...state,
        loading: action.loading,
      }

    case "keyboardButtonClicked": {
      const { selectedCell, puzzle, makeNotes } = state
      if (!selectedCell || puzzle[selectedCell.row][selectedCell.col].prefilled)
        return state // No cell selected, or its already a given cell, so nothing to update

      const updatedPuzzle: CellData[][] = puzzle.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          // Determine if the cell is a peer (same row, column, or 3x3 grid)
          const isInSameRowOrCol =
            rowIndex === selectedCell.row || colIndex === selectedCell.col
          const isInSameGrid =
            Math.floor(rowIndex / 3) === Math.floor(selectedCell.row / 3) &&
            Math.floor(colIndex / 3) === Math.floor(selectedCell.col / 3)

          const isPeer = isInSameRowOrCol || isInSameGrid

          // Update the selected cell
          if (
            rowIndex === selectedCell.row &&
            colIndex === selectedCell.col &&
            !cell.prefilled
          ) {
            if (makeNotes) {
              let notes =
                cell.value instanceof Set ? cell.value : new Set<number>()
              notes.has(action.value)
                ? notes.delete(action.value)
                : notes.add(action.value)
              return {
                ...cell,
                value: notes,
                isPeer: false, // Reset peer and conflict flags if needed
                hasConflicts: false,
              }
            } else {
              // Direct value input (not making notes)
              return {
                ...cell,
                value: action.value,
                isPeer: false,
                hasConflicts: false, // Reset flags
              }
            }
          }

          // Flag conflicts only if not making notes and there's a definitive value input
          if (isPeer && !makeNotes) {
            let hasConflicts =
              typeof cell.value === "number" && cell.value === action.value
            return { ...cell, hasConflicts: hasConflicts }
          }

          return cell // Return other cells as-is
        })
      )

      return {
        ...state,
        puzzle: updatedPuzzle,
      }
    }

    case "eraseSelectedCell":
      const newPuzz = state.puzzle.map((row) =>
        row.map((cell) => {
          if (cell.isSelected && !cell.prefilled) {
            return { ...cell, value: 0 } // Set value to zero
          }
          return cell // Return other cells as-is
        })
      )

      return {
        ...state,
        puzzle: newPuzz,
      }

    case "setMakeNotes":
      const notes = !state.makeNotes
      console.log("switch makeNotes to ", notes)
      return {
        ...state,
        makeNotes: notes,
      }

    default:
      return state
  }
}
