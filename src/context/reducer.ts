import { CellLocation, State } from "./app-context"
import { NewPuzzleData } from "./fetch-new-puzzle"

export type Actions =
  | { type: "selectCell"; location: CellLocation }
  | { type: "setNewGame"; data: NewPuzzleData }
  | { type: "setLoading"; loading: boolean }
  | { type: "keyboardButtonClicked"; value: number }
  | { type: "eraseSelectedCell" }

export const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case "selectCell":
      // Create a deep copy of the puzzle to ensure changes create a new reference
      const newPuzzle = state.puzzle.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (
            (rowIndex === action.location.row &&
              colIndex === action.location.col) ||
            cell.isSelected
          ) {
            // Update isSelected for the selected cell
            return { ...cell, isSelected: !cell.isSelected } // Toggle or set true as needed
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

    case "keyboardButtonClicked":
      const puzzle = state.puzzle.map((row) =>
        row.map((cell) => {
          // cannot change prefilled cells
          if (cell.isSelected && !cell.prefilled) {
            return { ...cell, value: action.value }
          }
          return cell // Return other cells as-is
        })
      )

      return {
        ...state,
        puzzle: puzzle,
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

    default:
      return state
  }
}
