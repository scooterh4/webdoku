import { CellLocation, State } from "./app-context"
import { NewPuzzleData } from "./fetch-new-puzzle"

export type Actions =
  | { type: "selectCell"; location: CellLocation }
  | { type: "setNewGame"; data: NewPuzzleData }
  | { type: "setLoading"; loading: boolean }
  | { type: "keyboardButtonClicked"; value: number }
  | { type: "eraseSelectedCell" }
  | { type: "setMakeNotes" }
  | { type: "setShowConflicts"; value: boolean }
  | { type: "checkSelectedCell" }
  | { type: "revealSelectedCell" }
  | { type: "checkPuzzle" }
  | { type: "revealPuzzle" }
  | { type: "resetPuzzle" }

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
      if (
        !selectedCell ||
        puzzle[selectedCell.row][selectedCell.col].prefilled
      ) {
        return state // Early return if no cell is selected or if it's prefilled.
      }

      // Directly clone the puzzle to ensure top-level immutability
      let updatedPuzzle = [...puzzle]

      // Determine peers before updating any cell to minimize updates
      const peersToUpdate: CellLocation[] = []
      for (let rowIndex = 0; rowIndex < puzzle.length; rowIndex++) {
        for (let colIndex = 0; colIndex < puzzle[rowIndex].length; colIndex++) {
          const isInSameRowOrCol =
            rowIndex === selectedCell.row || colIndex === selectedCell.col
          const isInSameGrid =
            Math.floor(rowIndex / 3) === Math.floor(selectedCell.row / 3) &&
            Math.floor(colIndex / 3) === Math.floor(selectedCell.col / 3)
          const isPeer = isInSameRowOrCol || isInSameGrid

          if (isPeer) {
            // Check if the cell's conflict status will change based on the new value
            const cell = puzzle[rowIndex][colIndex]
            const hasConflict =
              !makeNotes &&
              typeof action.value === "number" &&
              cell.value === action.value
            const hadConflict = cell.conflicts.some(
              (conflict) =>
                conflict.row === selectedCell.row &&
                conflict.col === selectedCell.col
            )

            if (hasConflict !== hadConflict) {
              // If the conflict status changes
              peersToUpdate.push({ row: rowIndex, col: colIndex })
            }
          }
        }
      }

      let selectedCellNewConflicts: CellLocation[] = []

      // Update the selected cell and any peers with changing conflict status
      updatedPuzzle = updatedPuzzle.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (rowIndex === selectedCell.row && colIndex === selectedCell.col) {
            // Handle the selected cell update
            const newValue = makeNotes
              ? (cell.value instanceof Set
                  ? cell.value
                  : new Set<number>()
                ).add(action.value)
              : action.value
            return {
              ...cell,
              value: newValue,
              isCorrect: undefined,
            } // Reset conflicts if not making notes
          } else if (
            peersToUpdate.some(
              (peer) => peer.row === rowIndex && peer.col === colIndex
            )
          ) {
            // Handle peer updates for changing conflict status
            const newConflicts = cell.conflicts.filter(
              (conflict) =>
                conflict.row !== selectedCell.row ||
                conflict.col !== selectedCell.col
            )
            if (!makeNotes && cell.value === action.value) {
              selectedCellNewConflicts.push(cell.location)
              newConflicts.push(selectedCell) // Add selected cell to conflicts if it now conflicts
            }
            return { ...cell, conflicts: newConflicts, isCorrect: undefined }
          }

          if (typeof cell.isCorrect === "boolean") {
            return { ...cell, isCorrect: undefined }
          }

          return cell // Return unchanged cells as-is to avoid unnecessary updates
        })
      )

      updatedPuzzle[selectedCell.row][selectedCell.col].conflicts =
        selectedCellNewConflicts

      return {
        ...state,
        puzzle: updatedPuzzle,
        revealCell: null,
      }
    }

    case "eraseSelectedCell":
      const { selectedCell, puzzle } = state

      // Ensure we have a selected cell and it's not prefilled
      if (
        !selectedCell ||
        puzzle[selectedCell.row][selectedCell.col].prefilled
      ) {
        return state // Return the current state if there's no selected cell or it's prefilled
      }

      // Create a new puzzle array with the selected cell's value set to 0
      const newPuzz = puzzle.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (rowIndex === selectedCell.row && colIndex === selectedCell.col) {
            return {
              ...cell,
              value: 0,
              isCorrect: undefined,
              conflicts: [], // cells with a value of zero do not have conflicts
            } // Reset cell properties as needed
          }

          // Need to make the isPeer logic into its own function
          const isInSameRowOrCol =
            rowIndex === selectedCell.row || colIndex === selectedCell.col
          const isInSameGrid =
            Math.floor(rowIndex / 3) === Math.floor(selectedCell.row / 3) &&
            Math.floor(colIndex / 3) === Math.floor(selectedCell.col / 3)
          const isPeer = isInSameRowOrCol || isInSameGrid

          // Check if the cell is a peer and had conflicts
          if (isPeer && cell.conflicts.length > 0) {
            // update formerly conflicting cells
            const newConflicts = cell.conflicts.filter(
              (conflict) =>
                conflict.row !== selectedCell.row ||
                conflict.col !== selectedCell.col
            )
            return { ...cell, conflicts: newConflicts }
          }

          return cell
        })
      )

      return {
        ...state,
        puzzle: newPuzz,
      }

    case "setMakeNotes":
      const notes = !state.makeNotes
      return {
        ...state,
        makeNotes: notes,
      }

    case "setShowConflicts":
      return { ...state, showConflicts: action.value }

    case "checkSelectedCell":
      if (!state.selectedCell) return state

      const cellAnswer =
        state.solution[state.selectedCell.row][state.selectedCell.col]

      const anotherPuzzle = state.puzzle.map((row) =>
        row.map((cell) => {
          if (cell.location === state.selectedCell) {
            return { ...cell, isCorrect: cell.value === cellAnswer }
          }

          return cell
        })
      )

      return { ...state, puzzle: anotherPuzzle }

    case "revealSelectedCell":
      const cellOfInterest = state.selectedCell
      if (!cellOfInterest) {
        return state
      }

      const currPuzzle = state.puzzle
      const revealCellValue =
        state.solution[cellOfInterest.row][cellOfInterest.col]

      const updatedPuzzle = currPuzzle.map((row) =>
        row.map((cell) => {
          if (cell.location === cellOfInterest) {
            return { ...cell, value: revealCellValue }
          }

          return cell
        })
      )

      return {
        ...state,
        puzzle: updatedPuzzle,
        revealCell: cellOfInterest,
      }

    case "checkPuzzle":
      const solution = state.solution

      const checkedPuzzle = state.puzzle.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const solutionValue = solution[rowIndex][colIndex]

          if (
            typeof cell.value === "number" &&
            cell.value > 0 &&
            !cell.prefilled &&
            cell.value !== solutionValue
          ) {
            return { ...cell, isCorrect: false }
          }

          return cell // unfilled cells return as before
        })
      )

      return { ...state, puzzle: checkedPuzzle }

    case "revealPuzzle":
      const sol = state.solution

      const revealedPuzzle = state.puzzle.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const correctCellValue = cell.value === sol[rowIndex][colIndex]

          if (cell.prefilled || correctCellValue) {
            return { ...cell, isSelected: false, isPeer: false }
          }

          return { ...cell, value: sol[rowIndex][colIndex], isCorrect: true }
        })
      )

      return { ...state, puzzle: revealedPuzzle }

    case "resetPuzzle":
      const resetPuzzle = state.puzzle.map((row) =>
        row.map((cell) => {
          if (!cell.prefilled) {
            return {
              ...cell,
              value: 0,
              conflicts: [],
              isPeer: false,
              isCorrect: undefined,
              isSelected: false,
            }
          }
          return {
            ...cell,
            conflicts: [],
            isPeer: false,
            isCorrect: undefined,
            isSelected: false,
          }
        })
      )

      return { ...state, puzzle: resetPuzzle, selectedCell: null }

    default:
      return state
  }
}
