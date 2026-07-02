import { type SubmitEvent, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
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
  const [editingTagName, setEditingTagName] = useState<string | null>(null);

  const clearStatus = () => {
    setStatus(null);
  };

  const resetForm = () => {
    setName('');
    setEditingTagName(null);
  };

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    clearStatus();

    if (!editingTagName) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      setStatusType('error');
      setStatus('Tag name cannot be empty.');
      return;
    }

    try {
      const { updatedPostIds } = await cmsApi.renameTag(editingTagName, trimmedName);
      setStatusType('success');
      setStatus(`Tag "${editingTagName}" renamed to "${trimmedName}" on ${updatedPostIds.length} post(s).`);

      resetForm();
      await reload();
    } catch (err) {
      setStatusType('error');
      setStatus(err instanceof Error ? err.message : 'Tag rename failed');
    }
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTagName(tag.name);
    setName(tag.name);
    clearStatus();
  };

  const handleDeleteTag = async (tag: Tag) => {
    clearStatus();

    try {
      const { updatedPostIds } = await cmsApi.removeTag(tag.name);
      setStatusType('success');
      setStatus(`Tag "${tag.name}" removed from ${updatedPostIds.length} post(s).`);

      if (editingTagName === tag.name) {
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
        <Typography variant="body2" color="text.secondary">
          Tags are derived from the posts that use them — there's no standalone tag list to
          create from. Renaming or removing a tag here rewrites every post that carries it.
        </Typography>

        {editingTagName && (
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label={`Rename "${editingTagName}" to`}
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />

              <Stack direction="row" spacing={1}>
                <Button type="submit" variant="contained">
                  Rename Tag
                </Button>
                <Button variant="outlined" onClick={resetForm}>
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}

        <Divider />

        <Stack spacing={1.5}>
          {tags.map((tag) => (
            <Paper key={tag.slug} variant="outlined" sx={{ p: 2 }}>
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
                    Rename
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteTag(tag)}
                  >
                    Remove
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          ))}
          {tags.length === 0 && (
            <Alert severity="info">No tags yet — add tags to a post to see them here.</Alert>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}

export default TagForm;
