import { SubmitEvent, useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { LibraryBig } from 'lucide-react';
import { cmsApi } from '../../utils/cmsApi';
import { renderSubjectIcon } from '../../utils/iconRenderer';
import type { Post, Subject } from '../../utils/dataTypes';
import { buildCategorySummary } from '../../utils/contentTaxonomy';
import MarkdownEditor from './MarkdownEditor';
import ConfirmDialog from './ConfirmDialog';
import AdminListItem from './AdminListItem';
import { useDirtyGuard } from './useDirtyGuard';

interface SubjectFormProps {
  subjects: Subject[];
  posts: Post[];
  reload: () => Promise<void>;
  setStatus: (status: string | null) => void;
  setStatusType: (type: 'success' | 'error') => void;
  initialEditId?: string | null;
  onEditComplete?: () => void;
  registerDirty?: (dirty: boolean) => void;
}

const EMPTY_SUBJECT: Subject = {
  id: '',
  title: '',
  description: '',
  overview: '',
  icon: null,
  blogEnabled: true,
  blogSectionTitle: 'Articles & Experiments',
};

const ID_PATTERN = /^[a-z0-9-]+$/;

function SectionLabel({ children }: { children: string }) {
  return (
    <Typography variant="subtitle2" color="text.secondary" sx={{ letterSpacing: 0.5 }}>
      {children}
    </Typography>
  );
}

function SubjectForm({
  subjects,
  posts,
  reload,
  setStatus,
  setStatusType,
  initialEditId,
  onEditComplete,
  registerDirty,
}: SubjectFormProps) {
  const [subjectForm, setSubjectForm] = useState<Subject>(EMPTY_SUBJECT);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const { setBaseline } = useDirtyGuard(subjectForm, registerDirty);

  const categorySummary = useMemo(() => buildCategorySummary(subjects, posts), [subjects, posts]);
  const postCountById = useMemo(
    () => new Map(categorySummary.map(category => [category.id, category.totalPosts])),
    [categorySummary]
  );

  useEffect(() => {
    if (initialEditId) {
      const subject = subjects.find(item => item.id === initialEditId);
      if (subject) handleEditSubject(subject);
    }
  }, [initialEditId, subjects]);

  const clearStatus = () => {
    setStatus(null);
  };

  const resetForm = () => {
    setEditingSubjectId(null);
    setSubjectForm(EMPTY_SUBJECT);
    setBaseline(EMPTY_SUBJECT);
  };

  const idError =
    !editingSubjectId && subjectForm.id && !ID_PATTERN.test(subjectForm.id)
      ? 'Lowercase letters, numbers, and hyphens only.'
      : null;

  const handleSubjectSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    clearStatus();

    if (idError) {
      setStatusType('error');
      setStatus(idError);
      return;
    }

    setIsSubmitting(true);

    try {
      const wasEditing = editingSubjectId !== null;

      if (editingSubjectId) {
        await cmsApi.updateSubject(editingSubjectId, subjectForm);
        setStatusType('success');
        setStatus(`Subject "${subjectForm.title}" updated.`);
      } else {
        await cmsApi.createSubject(subjectForm);
        setStatusType('success');
        setStatus(`Subject "${subjectForm.title}" created.`);
      }

      resetForm();
      await reload();
      if (wasEditing) onEditComplete?.();
    } catch (err) {
      setStatusType('error');
      setStatus(err instanceof Error ? err.message : 'Subject save failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubject = (subject: Subject) => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setSubjectForm(subject);
    setEditingSubjectId(subject.id);
    setBaseline(subject);
    clearStatus();
  };

  const handleDeleteSubject = async (subjectId: string) => {
    clearStatus();
    setIsSubmitting(true);

    try {
      await cmsApi.deleteSubject(subjectId);
      setStatusType('success');
      setStatus('Subject deleted. Associated posts were also removed.');

      const wasEditing = editingSubjectId === subjectId;
      if (wasEditing) {
        resetForm();
      }

      await reload();
      if (wasEditing) onEditComplete?.();
    } catch (err) {
      setStatusType('error');
      setStatus(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onEditComplete?.();
  };

  const confirmDeleteCount = confirmDeleteId ? postCountById.get(confirmDeleteId) ?? 0 : 0;

  return (
    <Paper ref={formRef} sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h5">Subjects</Typography>
        <Box component="form" onSubmit={handleSubjectSubmit}>
          <Stack spacing={3}>
            <Stack spacing={2}>
              <SectionLabel>Identity</SectionLabel>
              <TextField
                label="ID"
                value={subjectForm.id}
                onChange={event =>
                  setSubjectForm(prev => ({ ...prev, id: event.target.value }))
                }
                InputProps={{
                  readOnly: !!editingSubjectId,
                }}
                error={Boolean(idError)}
                helperText={idError ?? 'Becomes the file path — lowercase letters, numbers, hyphens only. Cannot be changed later.'}
                required
              />
              <TextField
                label="Title"
                value={subjectForm.title}
                onChange={event =>
                  setSubjectForm(prev => ({ ...prev, title: event.target.value }))
                }
                required
              />
              <Stack direction="row" spacing={1.5} alignItems="center">
                <TextField
                  fullWidth
                  label="Icon"
                  value={subjectForm.icon ?? ''}
                  onChange={event =>
                    setSubjectForm(prev => ({
                      ...prev,
                      icon: event.target.value.trim() ? event.target.value : null,
                    }))
                  }
                  helperText="Use emoji or lucide icon name (e.g. BookOpen or lucide:book-open)."
                />
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 44,
                    height: 44,
                    flexShrink: 0,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    color: 'secondary.main',
                  }}
                >
                  {renderSubjectIcon(subjectForm.icon, { size: 22, fallbackSize: '1.2rem' })}
                </Box>
              </Stack>
            </Stack>

            <Stack spacing={2}>
              <SectionLabel>Content</SectionLabel>
              <MarkdownEditor
                label="Description (Markdown supported)"
                value={subjectForm.description}
                onChange={value =>
                  setSubjectForm(prev => ({ ...prev, description: value }))
                }
                minRows={3}
                required
              />
              <MarkdownEditor
                label="Overview (Markdown only)"
                value={subjectForm.overview}
                onChange={value =>
                  setSubjectForm(prev => ({ ...prev, overview: value }))
                }
                minRows={5}
              />
            </Stack>

            <Stack spacing={2}>
              <SectionLabel>Blog display</SectionLabel>
              <FormControlLabel
                control={(
                  <Switch
                    checked={subjectForm.blogEnabled}
                    onChange={event =>
                      setSubjectForm(prev => ({ ...prev, blogEnabled: event.target.checked }))
                    }
                  />
                )}
                label="Show blog posts in this subject"
              />
              <TextField
                label="Blog section title"
                value={subjectForm.blogSectionTitle}
                onChange={event =>
                  setSubjectForm(prev => ({ ...prev, blogSectionTitle: event.target.value }))
                }
                helperText="If empty, defaults to Articles & Experiments."
              />
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting && <CircularProgress size={16} sx={{ mr: 1 }} />}
                {editingSubjectId ? 'Update Subject' : 'Create Subject'}
              </Button>
              {editingSubjectId && (
                <Button variant="outlined" disabled={isSubmitting} onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </Stack>
          </Stack>
        </Box>

        <Divider />

        <Stack spacing={1.5}>
          {subjects.map(subject => (
            <AdminListItem
              key={subject.id}
              eyebrow={subject.id.toUpperCase()}
              icon={
                subject.icon && (
                  <Box sx={{ display: 'flex', color: 'secondary.main' }}>
                    {renderSubjectIcon(subject.icon, { size: 18, fallbackSize: '1rem' })}
                  </Box>
                )
              }
              title={subject.title}
              meta={
                <Chip
                  icon={<LibraryBig size={14} />}
                  label={`${postCountById.get(subject.id) ?? 0} posts`}
                  size="small"
                  sx={{ mt: 0.5, width: 'fit-content' }}
                />
              }
              actions={
                <>
                  <Button size="small" disabled={isSubmitting} onClick={() => handleEditSubject(subject)}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    disabled={isSubmitting}
                    onClick={() => setConfirmDeleteId(subject.id)}
                  >
                    Delete
                  </Button>
                </>
              }
            />
          ))}
          {subjects.length === 0 && (
            <Alert severity="info">No subjects yet — create your first subject above.</Alert>
          )}
        </Stack>

        <ConfirmDialog
          open={confirmDeleteId !== null}
          title="Delete subject?"
          description={`This will permanently delete "${confirmDeleteId}" and cascade-delete ${confirmDeleteCount} post(s) assigned to it. This cannot be undone.`}
          onConfirm={() => {
            const id = confirmDeleteId;
            setConfirmDeleteId(null);
            if (id) handleDeleteSubject(id);
          }}
          onCancel={() => setConfirmDeleteId(null)}
        />
      </Stack>
    </Paper>
  )
}

export default SubjectForm;
