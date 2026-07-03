import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MarkdownContent from '../MarkdownContent';

interface MarkdownEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minRows?: number;
  required?: boolean;
  helperText?: string;
}

function MarkdownEditor({ label, value, onChange, minRows = 4, required, helperText }: MarkdownEditorProps) {
  const [mode, setMode] = useState<'write' | 'preview'>('write');

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="caption" color="text.secondary">
          {label}{required ? ' *' : ''}
        </Typography>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={mode}
          onChange={(_event, next) => next && setMode(next)}
          aria-label="Editor mode"
        >
          <ToggleButton value="write" aria-label="Write mode">Write</ToggleButton>
          <ToggleButton value="preview" aria-label="Preview mode">Preview</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {mode === 'write' ? (
        <TextField
          multiline
          minRows={minRows}
          fullWidth
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          helperText={helperText}
        />
      ) : (
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            p: 2,
            minHeight: `${minRows * 1.4375}em`,
            overflow: 'auto',
          }}
        >
          <MarkdownContent content={value || '*Nothing to preview yet.*'} />
        </Box>
      )}
    </Stack>
  );
}

export default MarkdownEditor;
