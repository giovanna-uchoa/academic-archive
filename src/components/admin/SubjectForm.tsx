import { SubmitEvent, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { cmsApi } from '../../utils/cmsApi';
import { renderSubjectIcon } from '../../utils/iconRenderer';
import type { Subject } from '../../utils/dataTypes';

interface SubjectFormProps {
  subjects: Subject[];
  reload: () => Promise<void>;
  setStatus: (status: string | null) => void;
  setStatusType: (type: 'success' | 'error') => void;
}

const EMPTY_SUBJECT: Subject = {
  id: '',
  title: '',
  description: '',
  overview: '',
  icon: null,
};

function SubjectForm({ subjects, reload, setStatus, setStatusType}: SubjectFormProps) {
  const [subjectForm, setSubjectForm] = useState<Subject>(EMPTY_SUBJECT);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);

  const clearStatus = () => {
    setStatus(null);
  };

  const handleSubjectSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    clearStatus();

    try {
      if (editingSubjectId) {
        await cmsApi.updateSubject(editingSubjectId, subjectForm);
        setStatusType('success');
        setStatus(`Subject "${subjectForm.title}" updated.`);
      } else {
        await cmsApi.createSubject(subjectForm);
        setStatusType('success');
        setStatus(`Subject "${subjectForm.title}" created.`);
      }

      setSubjectForm(EMPTY_SUBJECT);
      setEditingSubjectId(null);
      await reload();
    } catch (err) {
      setStatusType('error');
      setStatus(err instanceof Error ? err.message : 'Subject save failed');
    }
  };

  const handleEditSubject = (subject: Subject) => {
    setSubjectForm(subject);
    setEditingSubjectId(subject.id);
    clearStatus();
  };

  const handleDeleteSubject = async (subjectId: string) => {
    clearStatus();

    try {
      await cmsApi.deleteSubject(subjectId);
      setStatusType('success');
      setStatus('Subject deleted. Associated posts were also removed.');

      if (editingSubjectId === subjectId) {
        setEditingSubjectId(null);
        setSubjectForm(EMPTY_SUBJECT);
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
        <Typography variant="h5">Subjects</Typography>
        <Box component="form" onSubmit={handleSubjectSubmit}>
          <Stack spacing={2}>
            <TextField
              label="ID"
              value={subjectForm.id}
              onChange={event =>
                setSubjectForm(prev => ({ ...prev, id: event.target.value }))
              }
              InputProps={{
                readOnly: !!editingSubjectId,
              }}
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
            <TextField
              label="Description"
              value={subjectForm.description}
              onChange={event =>
                setSubjectForm(prev => ({ ...prev, description: event.target.value }))
              }
              required
            />
            <TextField
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
            <TextField
              multiline
              minRows={5}
              label="Overview (Markdown only)"
              value={subjectForm.overview}
              onChange={event =>
                setSubjectForm(prev => ({ ...prev, overview: event.target.value }))
              }
            />

            <Stack direction="row" spacing={1}>
              <Button type="submit" variant="contained">
                {editingSubjectId ? 'Update Subject' : 'Create Subject'}
              </Button>
              {editingSubjectId && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditingSubjectId(null);
                    setSubjectForm(EMPTY_SUBJECT);
                  }}
                >
                  Cancel
                </Button>
              )}
            </Stack>
          </Stack>
        </Box>

        <Divider />

        <Stack spacing={1.5}>
          {subjects.map(subject => (
            <Paper key={subject.id} variant="outlined" sx={{ p: 2 }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={1}
              >
                <Box>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', color: 'secondary.main' }}>
                      {renderSubjectIcon(subject.icon, {
                        size: 18,
                        fallbackSize: '1rem',
                      })}
                    </Box>  
                   <Typography fontWeight={600}> {subject.title} </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {subject.id}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button size="small" onClick={() => handleEditSubject(subject)}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteSubject(subject.id)}
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
  )
}

export default SubjectForm;