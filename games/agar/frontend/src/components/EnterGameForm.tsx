import React, { useState } from 'react'
import { Stack, Paper, TextField, Button, CircularProgress } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { setNickname } from '../client'

function EnterGameForm (): React.ReactElement {
  const [loading, setLoading] = useState(false)
  const [nicknameFieldValue, setNicknameFieldValue] = useState<string>('billie')
  return (
    <Paper sx={{ maxWidth: '300px' }} >
      <Stack
        spacing={2} p={2}
      >
        <TextField
          value={nicknameFieldValue}
          id="nickname-field"
          variant="outlined"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNicknameFieldValue(event.target?.value)
          }}
        />
        <Button
          fullWidth
          variant="contained"
          disabled={loading}
          onClick={(ev) => {
            ev.preventDefault()
            setNickname(nicknameFieldValue)
            setLoading(false)
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
