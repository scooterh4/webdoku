import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react"
import { reducer } from "./reducer"
import { fetchNewPuzzle } from "./fetch-new-puzzle"

export type CellLocation = { row: number; col: number }

export interface CellData {
  location: CellLocation
  value: number | Set<number> // Number or notes
  prefilled: boolean
  isPeer: boolean
  isSameValueAsSelect: boolean
  isSelected: boolean
  conflicts: CellLocation[]
  isCorrect: boolean | undefined
}

export type State = {
  puzzle: CellData[][]
  solution: number[][]
  selectedCell: CellLocation | null
  loading: boolean
  makeNotes: boolean
  // showConflicts: boolean
  revealCell: CellLocation | null
}

type API = {
  selectCell: (location: CellLocation) => void
  getNewGame: () => void
  keyboardButtonClicked: (number: number) => void
  eraseSelectedCell: () => void
  setMakeNotes: () => void
  // setShowConflicts: (value: boolean) => void
  checkSelectedCell: () => void
  revealSelectedCell: () => void
  checkPuzzle: () => void
  revealPuzzle: () => void
  resetPuzzle: () => void
}

const PuzzleContext = createContext<State["puzzle"]>({} as State["puzzle"])
const SolutionContext = createContext<State["solution"]>(
  {} as State["solution"]
)
const SelectedCellContext = createContext<State["selectedCell"]>(null)
const LoadingContext = createContext<State["loading"]>(false)
const MakeNotesContext = createContext<State["makeNotes"]>(false)
// const ShowConflictsContext = createContext<State["showConflicts"]>(true)
const RevealCellContext = createContext<State["revealCell"]>(null)
const APIContext = createContext<API>({} as API)

export const SudokuProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, {
    puzzle: [],
    solution: [],
    selectedCell: null,
    loading: true,
    makeNotes: false,
    // showConflicts: true,
    revealCell: null,
  })

  useEffect(() => {
    const fetchAndSetPuzzle = async () => {
      console.log("fetching a new puzzle")

      try {
        dispatch({ type: "setLoading", loading: true }) // Ensure loading is true

        await fetchNewPuzzle().then((data) => {
          dispatch({ type: "setNewGame", data })
        })
      } catch (error) {
        console.error("Error fetching new puzzle:", error)
        // Handle error appropriately
      } finally {
        console.log("Setting loading to false")
        dispatch({ type: "setLoading", loading: false })
      }
    }

    fetchAndSetPuzzle()
  }, [])

  const api = useMemo(() => {
    const selectCell = (location: CellLocation) => {
      dispatch({ type: "selectCell", location })
    }

    const getNewGame = async () => {
      dispatch({ type: "setLoading", loading: true })
      // Fetch new game data
      await fetchNewPuzzle()
        .then((data) => {
          dispatch({ type: "setNewGame", data })
        })
        .finally(() => {
          dispatch({ type: "setLoading", loading: false })
        })
    }

    const keyboardButtonClicked = (number: number) => {
      dispatch({ type: "keyboardButtonClicked", value: number })
    }

    const eraseSelectedCell = () => {
      dispatch({ type: "eraseSelectedCell" })
    }

    const setMakeNotes = () => {
      dispatch({ type: "setMakeNotes" })
    }

    // const setShowConflicts = (value: boolean) => {
    //   dispatch({ type: "setShowConflicts", value })
    // }

    const checkSelectedCell = () => {
      dispatch({ type: "checkSelectedCell" })
    }

    const revealSelectedCell = () => {
      dispatch({ type: "revealSelectedCell" })
    }

    const checkPuzzle = () => {
      dispatch({ type: "checkPuzzle" })
    }

    const revealPuzzle = () => {
      dispatch({ type: "revealPuzzle" })
    }

    const resetPuzzle = () => {
      dispatch({ type: "resetPuzzle" })
    }

    return {
      selectCell,
      getNewGame,
      keyboardButtonClicked,
      eraseSelectedCell,
      setMakeNotes,
      // setShowConflicts,
      checkSelectedCell,
      revealSelectedCell,
      checkPuzzle,
      revealPuzzle,
      resetPuzzle,
    }
  }, [])

  return (
    <APIContext.Provider value={api}>
      <LoadingContext.Provider value={state.loading}>
        <PuzzleContext.Provider value={state.puzzle}>
          <SelectedCellContext.Provider value={state.selectedCell}>
            <MakeNotesContext.Provider value={state.makeNotes}>
              {/* <ShowConflictsContext.Provider value={state.showConflicts}> */}
              <RevealCellContext.Provider value={state.revealCell}>
                {children}
              </RevealCellContext.Provider>
              {/* </ShowConflictsContext.Provider> */}
            </MakeNotesContext.Provider>
          </SelectedCellContext.Provider>
        </PuzzleContext.Provider>
      </LoadingContext.Provider>
    </APIContext.Provider>
  )
}

export const useSudokuAPI = () => useContext(APIContext)
export const usePuzzleContext = () => useContext(PuzzleContext)
export const useSolutionContext = () => useContext(SolutionContext)
export const useSelectedCellContext = () => useContext(SelectedCellContext)
export const useLoadingContext = () => useContext(LoadingContext)
export const useMakeNotesContext = () => useContext(MakeNotesContext)
// export const useShowConflictsContext = () => useContext(ShowConflictsContext)
export const useRevealCellContext = () => useContext(RevealCellContext)
