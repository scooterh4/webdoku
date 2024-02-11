// import SettingsIcon from "@mui/icons-material/Settings"
// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   FormControlLabel,
//   IconButton,
//   Switch,
// } from "@mui/material"
// import { useState } from "react"
// import { useShowConflictsContext, useSudokuAPI } from "../context/app-context"

export default function SettingsButton() {
  // const showConflicts = useShowConflictsContext()
  // const { setShowConflicts } = useSudokuAPI()

  // const [openSettings, setOpenSettings] = useState<boolean>(false)
  // const [conflictsSwitch, setConflictsSwitch] = useState<boolean>(showConflicts)

  // function showSettings() {
  //   setOpenSettings(true)
  // }

  // function handleConflictsSwitchChange() {
  //   setConflictsSwitch(!conflictsSwitch)
  // }

  // function closeSettings() {
  //   setOpenSettings(false)
  //   setShowConflicts(conflictsSwitch)
  // }

  return (
    <>
      {/* <IconButton onClick={showSettings}>
        <SettingsIcon />
      </IconButton>

      <Dialog open={openSettings}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <FormControlLabel
            sx={{ mt: 1 }}
            control={
              <Switch
                checked={conflictsSwitch}
                onChange={handleConflictsSwitchChange}
              />
            }
            label="Show conflicts"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSettings}>Ok</Button>
        </DialogActions>
      </Dialog> */}
    </>
  )
}
