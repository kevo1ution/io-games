import React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { Box, Stack } from '@mui/material'
import { Helmet } from 'react-helmet'
import EnterGameForm from './EnterGameForm'
import Theme from './theme'
import { useSocket } from '../client'
import { useGame, GameStatus } from '../game'

function App (): React.ReactElement {
  const { socket, spawnPlayer } = useSocket()
  const gameStatus = useGame(socket)

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
        {gameStatus === GameStatus.Lobby && <EnterGameForm spawnPlayer={spawnPlayer} />}
      </Stack>
      <Box
        sx={{
          zIndex: 0,
          position: 'absolute'
        }}
        id="mainSceneParent" className="App"
      />
    </ThemeProvider>
  )
}

export default App
