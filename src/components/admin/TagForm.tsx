import { type SubmitEvent, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { cmsApi } from '../../utils/cmsApi';
import type { Tag } from '../../utils/dataTypes';

interface TagFormProps {
  tags: Tag[];
  reload: () => Promise<void>;
  setStatus: (status: string | null) => void;
  setStatusType: (type: 'success' | 'error') => void;
}

function TagForm({ tags, reload, setStatus, setStatusType }: TagFormProps) {
  const [name, setName] = useState('');
  const [editingTagId, setEditingTagId] = useState<number | null>(null);

  const clearStatus = () => {
    setStatus(null);
  };

  const resetForm = () => {
    setName('');
    setEditingTagId(null);
  };

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    clearStatus();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setStatusType('error');
      setStatus('Tag name cannot be empty.');
      return;
    }

    try {
      if (editingTagId) {
        await cmsApi.updateTag(editingTagId, trimmedName);
        setStatusType('success');
        setStatus(`Tag "${trimmedName}" updated.`);
      } else {
        await cmsApi.createTag(trimmedName);
        setStatusType('success');
        setStatus(`Tag "${trimmedName}" created.`);
      }

      resetForm();
      await reload();
    } catch (err) {
      setStatusType('error');
      setStatus(err instanceof Error ? err.message : 'Tag save failed');
    }
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTagId(tag.id);
    setName(tag.name);
    clearStatus();
  };

  const handleDeleteTag = async (tagId: number) => {
    clearStatus();

    try {
      await cmsApi.deleteTag(tagId);
      setStatusType('success');
      setStatus('Tag deleted.');

      if (editingTagId === tagId) {
        resetForm();
      }

      await reload();
    } catch (err) {
      setStatusType('error');
      setStatus(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h5">Tags</Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Tag Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              helperText="Examples: ai, machine-learning, data-viz"
            />

            <Stack direction="row" spacing={1}>
              <Button type="submit" variant="contained">
                {editingTagId ? 'Update Tag' : 'Create Tag'}
              </Button>
              {editingTagId && (
                <Button variant="outlined" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </Stack>
          </Stack>
        </Box>

        <Divider />

        <Stack spacing={1.5}>
          {tags.map((tag) => (
            <Paper key={tag.id} variant="outlined" sx={{ p: 2 }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={1}
              >
                <Box>
                  <Typography fontWeight={600}>{tag.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    slug: {tag.slug}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  <Button size="small" onClick={() => handleEditTag(tag)}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteTag(tag.id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}

export default TagForm;
