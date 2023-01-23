import React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { Box } from '@mui/material'
import { Helmet } from 'react-helmet'
import Lobby from './lobby/Lobby'
import Theme from './theme'
import { useSocket } from '../client'
import { useGame, GameStatus } from '../game'

function App (): React.ReactElement {
  const { socket, spawnPlayer, setDirection } = useSocket()
  const gameStatus = useGame(socket, setDirection)

  /**
   * WARNING:
   * Any react UI components displaying over the canvas will capture the mouse events and not propagate it to Phaser.
   * This means that if there are any container components that have a lot of space, mouse events will not get propagated.
   */
  return (
    <ThemeProvider theme={Theme}>
      <Helmet>
        <title>Circles</title>
        <meta name="author" content="github.com/kevo1ution" />
        <meta name="description" content="clone of agar.io" />
        <meta name="keywords" content="io games, agar.io, real-time, battle royale, web games" />
      </Helmet>
      {gameStatus === GameStatus.Lobby && <Lobby spawnPlayer={spawnPlayer} />}
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
