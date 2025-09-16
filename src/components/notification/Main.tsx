import { Backdrop, Modal } from '@mui/material';
import React from 'react'

const Main = () => {
  return (
    <Modal
      open={true}
      onClose={() => { }}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(4px)",
          },
        },
      }}
      disableEscapeKeyDown
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
        <div>hello</div>
    </Modal>
  )
}

export default Main
