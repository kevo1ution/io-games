import React, { useEffect } from 'react'
import { setNickname } from '../client'
import { Box } from '@mui/material'
import setupGame from '../game'

function App (): React.ReactElement {
  useEffect(() => {
    const game = setupGame('mainSceneParent')
    return () => {
      game.destroy(true)
    }
  }, [])
  return (
    <>
      <Box
        sx={{
          zIndex: 1,
          height: '100vh',
          width: '100vw',
          position: 'absolute'
        }}
        id="uiLayer"
      />
      <Box
        sx={{
          zIndex: 0,
          height: '100vh',
          width: '100vw',
          position: 'absolute'
        }}
        id="mainSceneParent" className="App"
      />
    </>
  )
}

export default App
