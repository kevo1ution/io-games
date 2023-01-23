import React, { useState } from 'react'
import { Stack, Paper, TextField, Button, CircularProgress } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

interface EnterGameFormProps {
  spawnPlayer?: (nickname: string) => void
}

function EnterGameForm ({ spawnPlayer }: EnterGameFormProps): React.ReactElement {
  const [loading, setLoading] = useState(false)
  const [nickname, setNickname] = useState<string>('billie')
  return (
    <Paper sx={{ maxWidth: '300px' }} >
      <Stack
        spacing={2} p={2}
      >
        <TextField
          value={nickname}
          id="nickname-field"
          variant="outlined"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNickname(event.target?.value)
          }}
        />
        <Button
          fullWidth
          variant="contained"
          disabled={loading || (spawnPlayer == null)}
          onClick={(ev) => {
            ev.preventDefault()
            setLoading(true)
            if (spawnPlayer == null) {
              throw new Error('spawnPlayer fn is not defined, is the socket connected yet?')
            } else {
              spawnPlayer(nickname)
            }
          }}
        >
          {loading
            ? <CircularProgress size={24} />
            : <PlayArrowIcon
                fontSize="large"
              />}
        </Button>
      </Stack>
    </Paper>
  )
}

export default EnterGameForm
