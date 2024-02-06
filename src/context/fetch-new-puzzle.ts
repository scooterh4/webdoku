import { CellData } from "./app-context"

interface DosukuResData {
  newboard: {
    grids: [{ value: number[][]; solution: number[][]; difficulty: string }]
    results: number
    message: string
  }
}

export interface NewPuzzleData {
  puzzle: CellData[][]
  solution: number[][]
}

// Assuming fetchNewPuzzle is an async function that fetches a new puzzle
export async function fetchNewPuzzle(): Promise<NewPuzzleData> {
  let puzzle: CellData[][] = Array.from({ length: 9 }, (_, rowIndex) =>
    Array.from({ length: 9 }, (_, colIndex) => ({
      location: { row: rowIndex, col: colIndex }, // Correctly initialize location here
      value: 0, // This will be overwritten
      prefilled: false,
      isPeer: false,
      isSelected: false,
      hasConflicts: false,
    }))
  )

  let solution: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0))

  try {
    const response = await fetch("https://sudoku-api.vercel.app/api/dosuku")
    const data: DosukuResData = await response.json()

    if (data.newboard.message === "All Ok") {
      const resPuzzle = data.newboard.grids[0].value
      const resSolution = data.newboard.grids[0].solution

      // Update the puzzle
      for (let i = 0; i < resPuzzle.length; i++) {
        for (let j = 0; j < resPuzzle[i].length; j++) {
          puzzle[i][j] = {
            ...puzzle[i][j], // Keep the correctly initialized location
            value: resPuzzle[i][j],
            prefilled: resPuzzle[i][j] !== 0,
            isPeer: false,
            isSelected: false,
            hasConflicts: false,
          }
        }
      }

      // Updating solution
      solution = resSolution
    }
  } catch (error) {
    console.error("Failed to fetch new puzzle:", error)
  }

  return { puzzle, solution }
}
