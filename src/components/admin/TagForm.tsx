import { type SubmitEvent, useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import { FileText } from 'lucide-react';
import { cmsApi } from '../../utils/cmsApi';
import type { Tag, TagSummary } from '../../utils/dataTypes';
import ConfirmDialog from './ConfirmDialog';
import AdminListItem from './AdminListItem';
import { useAdminCrudForm } from './useAdminCrudForm';

interface TagFormProps {
  tags: Tag[];
  tagSummary: TagSummary[];
  reload: () => Promise<void>;
  setStatus: (status: string | null) => void;
  setStatusType: (type: 'success' | 'error') => void;
  initialEditValue?: string | null;
  onEditComplete?: () => void;
  registerDirty?: (dirty: boolean) => void;
}

function TagForm({
  tags,
  tagSummary,
  reload,
  setStatus,
  setStatusType,
  initialEditValue,
  onEditComplete,
  registerDirty,
}: TagFormProps) {
  const [editingTagName, setEditingTagName] = useState<string | null>(null);
  const [confirmDeleteTag, setConfirmDeleteTag] = useState<Tag | null>(null);
  const {
    form: name,
    setForm: setName,
    isSubmitting,
    formRef,
    resetForm,
    loadForm,
    runAction,
  } = useAdminCrudForm<string>({ initialValue: '', registerDirty });

  const totalPostsBySlug = useMemo(
    () => new Map(tagSummary.map(summary => [summary.slug, summary.totalPosts])),
    [tagSummary]
  );

  const orderedTags = useMemo(() => {
    return [...tags].sort((a, b) => (totalPostsBySlug.get(b.slug) ?? 0) - (totalPostsBySlug.get(a.slug) ?? 0));
  }, [tags, totalPostsBySlug]);

  useEffect(() => {
    if (initialEditValue) {
      const tag = tags.find(item => item.slug === initialEditValue);
      if (tag) handleEditTag(tag);
    }
  }, [initialEditValue, tags]);

  const resetFormState = () => {
    setEditingTagName(null);
    resetForm();
  };

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    if (!editingTagName) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      setStatusType('error');
      setStatus('Tag name cannot be empty.');
      return;
    }

    const result = await runAction(() => cmsApi.renameTag(editingTagName, trimmedName), {
      onSuccess: ({ updatedPostIds }) =>
        `Tag "${editingTagName}" renamed to "${trimmedName}" on ${updatedPostIds.length} post(s).`,
      resetOnSuccess: resetFormState,
      fallbackErrorMessage: 'Tag rename failed',
      setStatus,
      setStatusType,
      reload,
    });

    if (result) onEditComplete?.();
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTagName(tag.name);
    loadForm(tag.name);
    setStatus(null);
  };

  const handleDeleteTag = async (tag: Tag) => {
    const wasEditing = editingTagName === tag.name;

    const result = await runAction(() => cmsApi.removeTag(tag.name), {
      onSuccess: ({ updatedPostIds }) => `Tag "${tag.name}" removed from ${updatedPostIds.length} post(s).`,
      resetOnSuccess: wasEditing ? resetFormState : undefined,
      fallbackErrorMessage: 'Delete failed',
      setStatus,
      setStatusType,
      reload,
    });

    if (result && wasEditing) onEditComplete?.();
  };

  const handleCancel = () => {
    resetFormState();
    onEditComplete?.();
  };

  return (
    <Paper ref={formRef} sx={{ p: 3 }}>
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
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {isSubmitting && <CircularProgress size={16} sx={{ mr: 1 }} />}
                  Rename Tag
                </Button>
                <Button variant="outlined" disabled={isSubmitting} onClick={handleCancel}>
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}

        <Divider />

        <Stack spacing={1.5}>
          {orderedTags.map((tag) => (
            <AdminListItem
              key={tag.slug}
              eyebrow={`slug: ${tag.slug}`}
              title={tag.name}
              meta={
                <Chip
                  icon={<FileText size={14} />}
                  label={`${totalPostsBySlug.get(tag.slug) ?? 0} posts`}
                  size="small"
                  sx={{ mt: 0.5, width: 'fit-content' }}
                />
              }
              actions={
                <>
                  <Button size="small" disabled={isSubmitting} onClick={() => handleEditTag(tag)}>
                    Rename
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    disabled={isSubmitting}
                    onClick={() => setConfirmDeleteTag(tag)}
                  >
                    Remove
                  </Button>
                </>
              }
            />
          ))}
          {tags.length === 0 && (
            <Alert severity="info">No tags yet — add tags to a post to see them here.</Alert>
          )}
        </Stack>

        <ConfirmDialog
          open={confirmDeleteTag !== null}
          title="Remove tag?"
          description={`This will remove "${confirmDeleteTag?.name}" from every post that uses it. This cannot be undone.`}
          confirmLabel="Remove"
          onConfirm={() => {
            const tag = confirmDeleteTag;
            setConfirmDeleteTag(null);
            if (tag) handleDeleteTag(tag);
          }}
          onCancel={() => setConfirmDeleteTag(null)}
        />
      </Stack>
    </Paper>
  );
}

export default TagForm;
