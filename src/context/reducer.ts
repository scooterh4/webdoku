import { toast } from "react-toastify"
import { CellLocation, State } from "./app-context"
import { NewPuzzleData } from "./fetch-new-puzzle"

export type Actions =
  | { type: "selectCell"; location: CellLocation }
  | { type: "setNewGame"; data: NewPuzzleData }
  | { type: "setLoading"; loading: boolean }
  | { type: "keyboardButtonClicked"; value: number }
  | { type: "eraseSelectedCell" }
  | { type: "setMakeNotes" }
  // | { type: "setShowConflicts"; value: boolean }
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
          const isSameValueAsSelect =
            typeof cell.value === "number" &&
            cell.value > 0 &&
            cell.value ===
              state.puzzle[action.location.row][action.location.col].value
          const isPrev =
            cell.isPeer || cell.isSelected || cell.isSameValueAsSelect

          if (isSelectedCell) {
            // Update isSelected for the selected cell
            return { ...cell, isSelected: true } // Toggle or set true as needed
          }
          if (isPeer || isSameValueAsSelect) {
            return {
              ...cell,
              isSelected: false,
              isPeer: isPeer,
              isSameValueAsSelect: isSameValueAsSelect,
            }
          }
          if (isPrev) {
            return {
              ...cell,
              isSelected: false,
              isPeer: false,
              isSameValueAsSelect: false,
            }
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
      let isPuzzleFilledIn = true // asume the puzzle is completely filled in, and set it to false if otherwise

      // Update the selected cell and any peers with changing conflict status
      updatedPuzzle = updatedPuzzle.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          // Handle the selected cell update
          if (rowIndex === selectedCell.row && colIndex === selectedCell.col) {
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
          }

          isPuzzleFilledIn = isPuzzleFilledIn
            ? typeof cell.value === "number" && cell.value > 0
            : false

          if (
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

          if (cell.value === action.value && !makeNotes) {
            return { ...cell, isCorrect: undefined, isSameValueAsSelect: true }
          }

          if (typeof cell.isCorrect === "boolean" || cell.isSameValueAsSelect) {
            return { ...cell, isCorrect: undefined, isSameValueAsSelect: false }
          }

          return cell // Return unchanged cells as-is to avoid unnecessary updates
        })
      )

      updatedPuzzle[selectedCell.row][selectedCell.col].conflicts =
        selectedCellNewConflicts

      // when the user fills the puzzle
      if (isPuzzleFilledIn) {
        console.log("puzzle is filled")

        // need to check if there are no conflicts
        let isCorrect = false
        for (let row = 0; row < updatedPuzzle.length; row++) {
          for (let col = 0; col < updatedPuzzle[0].length; col++) {
            console.log("check cell for finished puzzle")
            if (updatedPuzzle[row][col].value !== state.solution[row][col]) {
              break
            } else if (
              row === 8 &&
              col === 8 &&
              updatedPuzzle[row][col].value === state.solution[row][col]
            ) {
              isCorrect = true
            }
          }
        }

        console.log("isCorrect value", isCorrect)
        // the puzzle is finished and correct
        if (isCorrect) {
          const successPuzzle = updatedPuzzle.map((row) =>
            row.map((cell) => {
              if (cell.isPeer || cell.isSameValueAsSelect || cell.isSelected) {
                return {
                  ...cell,
                  isPeer: false,
                  isSameValueAsSelect: false,
                  isSelected: false,
                }
              }
              return cell
            })
          )

          toast.success(`You did it!!! Congrats`, {
            toastId: "finishedPuzzle",
          })

          return {
            ...state,
            puzzle: successPuzzle,
            revealCell: null,
          }
        }
      }

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
        puzzle[selectedCell.row][selectedCell.col].prefilled ||
        puzzle[selectedCell.row][selectedCell.col].value === 0
      ) {
        return state // Return the current state if there's no selected cell or it's prefilled
      }

      const erasedCellOldValue =
        puzzle[selectedCell.row][selectedCell.col].value

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

          if (
            typeof erasedCellOldValue === "number" &&
            cell.value === erasedCellOldValue
          ) {
            return { ...cell, isPeer: false, isSameValueAsSelect: false }
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

    // case "setShowConflicts":
    //   return { ...state, showConflicts: action.value }

    case "checkSelectedCell":
      if (!state.selectedCell) return state
      if (
        typeof state.puzzle[state.selectedCell.row][state.selectedCell.col]
          .value !== "number"
      ) {
        toast.warning("Cannot check notes", { toastId: "checkNotesError" })
        return state
      }
      if (
        state.puzzle[state.selectedCell.row][state.selectedCell.col].value ===
          0 ||
        typeof state.puzzle[state.selectedCell.row][state.selectedCell.col]
          .value !== "number"
      ) {
        toast.warning("No value to check", { toastId: "noValue" })
        return state
      }

      const cellAnswer =
        state.solution[state.selectedCell.row][state.selectedCell.col]

      const anotherPuzzle = state.puzzle.map((row) =>
        row.map((cell) => {
          if (cell.location === state.selectedCell) {
            cell.value === cellAnswer
              ? toast.success("Lookin good", { toastId: "goodCell" })
              : toast.error("Uh oh", { toastId: "badCell" })
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

      toast.success("There ya go", { toastId: "revealCell" })

      return {
        ...state,
        puzzle: updatedPuzzle,
        revealCell: cellOfInterest,
      }

    case "checkPuzzle":
      const solution = state.solution
      let cellErrors = false

      const checkedPuzzle = state.puzzle.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const solutionValue = solution[rowIndex][colIndex]

          if (
            typeof cell.value === "number" &&
            cell.value > 0 &&
            !cell.prefilled &&
            cell.value !== solutionValue
          ) {
            cellErrors = true
            return { ...cell, isCorrect: false }
          }

          return cell // unfilled cells return as before
        })
      )

      cellErrors
        ? toast.error("Oopsies!", { toastId: "puzzleCheckError" })
        : toast.success("So far so good", { toastId: "puzzleCheckGood" })

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

      toast.info("Better luck next time", { toastId: "revealPuzzle" })
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

      toast.info("A fresh start", { toastId: "resetPuzzle" })
      return { ...state, puzzle: resetPuzzle, selectedCell: null }

    default:
      return state
  }
}
