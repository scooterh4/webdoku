import { ToastContainer } from "react-toastify"
import AppLayout from "./ui/app-layout"
import { ThemeProvider, createTheme } from "@mui/material"
import { SudokuProvider } from "./context/app-context"

const theme = createTheme({
  typography: {
    fontFamily: "Inter, arial, sans-serif",
    h1: {
      fontWeight: 600,
      fontSize: "4rem",
    },
    h2: {
      fontSize: "3rem",
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 500,
    },
    h4: {
      fontSize: "1rem",
      fontWeight: 300,
    },
    button: {
      letterSpacing: ".5px",
      color: "#4F60AE",
    },
    subtitle2: {
      color: "#888888",
    },
  },
  palette: {
    primary: {
      main: "#4F60AE",
    },
    secondary: {
      main: "#AE4F60",
    },
    success: {
      main: "#60AE4F",
      contrastText: "#ffffff",
    },
    background: {
      paper: "#EAE0D5",
      default: "#EAE0D5",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="top-center" theme="colored" />
      <SudokuProvider>
        <AppLayout />
      </SudokuProvider>
    </ThemeProvider>
  )
}

export default App
