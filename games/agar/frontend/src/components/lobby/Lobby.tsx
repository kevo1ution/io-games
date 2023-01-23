import React from 'react'
import { Stack } from '@mui/material'
import EnterGameForm from './EnterGameForm'

interface LobbyProps {
  spawnPlayer?: (nickname: string) => void
}

function Lobby ({ spawnPlayer }: LobbyProps): React.ReactElement {
  return (
    <Stack
      sx={{
        zIndex: 1,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}
      justifyContent="center"
      alignItems="center"
    >
      <EnterGameForm spawnPlayer={spawnPlayer} />
    </Stack>
  )
}

export default Lobby
