import React, { useEffect } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { Box, Stack } from '@mui/material'
import { Helmet } from 'react-helmet'
import setupGame from '../game'
import EnterGameForm from './EnterGameForm'
import Theme from './theme'

function App (): React.ReactElement {
  useEffect(() => {
    const game = setupGame('mainSceneParent')
    return () => {
      game.destroy(true)
    }
  }, [])
  return (
    <ThemeProvider theme={Theme}>
      <Helmet>
        <title>Circles</title>
        <meta name="author" content="github.com/kevo1ution" />
        <meta name="description" content="clone of agar.io" />
        <meta name="keywords" content="io games, agar.io, real-time, battle royale, web games" />
      </Helmet>
      <Stack
        id="uiLayer"
        sx={{
          zIndex: 1,
          height: '100vh',
          width: '100vw',
          position: 'absolute'
        }}
        alignItems="center"
        justifyContent="center"
      >
        <EnterGameForm />
      </Stack>
      <Box
        sx={{
          zIndex: 0,
          height: '100vh',
          width: '100vw',
          position: 'absolute'
        }}
        id="mainSceneParent" className="App"
      />
    </ThemeProvider>
  )
}

export default App
