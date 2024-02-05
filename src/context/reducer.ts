import { CellLocation, State } from "./app-context"
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
            rowIndex === action.location.row || colIndex === action.location.col
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

    case "keyboardButtonClicked":
      const puzzle = state.puzzle.map((row) =>
        row.map((cell) => {
          // cannot change prefilled cells
          if (cell.isSelected && !cell.prefilled) {
            if (state.makeNotes) {
              let notes =
                cell.value instanceof Set ? cell.value : new Set<number>()

              console.log("notes", notes)

              if (notes.has(action.value)) {
                notes.delete(action.value)

                console.log("notes after action", notes)

                return { ...cell, value: notes }
              } else {
                notes.add(action.value)

                console.log("notes after action", notes)

                return { ...cell, value: notes }
              }
            } else {
              return { ...cell, value: action.value }
            }
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
