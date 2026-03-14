import { SubmitEvent, useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { cmsApi } from '../../utils/cmsApi';
import type { Post, Subject } from '../../utils/dataTypes';
import { normalizePostDate } from '../../utils/contentTaxonomy';

interface PostFormProps {
  posts: Post[];
  subjects: Subject[];
  reload: () => Promise<void>;
  setStatus: (status: string | null) => void;
  setStatusType: (type: 'success' | 'error') => void;
}

interface PostFormState {
  title: string;
  excerpt: string;
  content: string;
  date: string;
  timeSpent: string;
  subjectId: string;
  tagsInput: string;
}

const EMPTY_POST = {
  title: '',
  excerpt: '',
  content: '',
  date: '',
  timeSpent: '',
  subjectId: '',
  tagsInput: '',
} satisfies PostFormState;

function parseTagsInput(value: string): string[] {
  return value
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);
}

function PostForm({ posts, subjects, reload, setStatus, setStatusType}: PostFormProps) {
  const [postForm, setPostForm] = useState(EMPTY_POST);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);

  const subjectById = useMemo(() => {
    return new Map(subjects.map(subject => [subject.id, subject]));
  }, [subjects]);

  const clearStatus = () => {
    setStatus(null);
  };
  
  const handlePostSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    clearStatus();

    const normalizedDate = normalizePostDate(postForm.date);
    if (!normalizedDate) {
      setStatusType('error');
      setStatus('Invalid date. Use yyyy/mm/dd.');
      return;
    }

    const payload: Omit<Post, 'id'> = {
      title: postForm.title,
      excerpt: postForm.excerpt,
      content: postForm.content,
      date: normalizedDate,
      timeSpent: postForm.timeSpent,
      subjectId: postForm.subjectId,
      tags: parseTagsInput(postForm.tagsInput),
    };

    try {
      if (editingPostId) {
        await cmsApi.updatePost(editingPostId, payload);
        setStatusType('success');
        setStatus(`Post "${postForm.title}" updated.`);
      } else {
        await cmsApi.createPost(payload);
        setStatusType('success');
        setStatus(`Post "${postForm.title}" created.`);
      }

      setEditingPostId(null);
      setPostForm(EMPTY_POST);
      await reload();
    } catch (err) {
      setStatusType('error');
      setStatus(err instanceof Error ? err.message : 'Post save failed');
    }
  };

  const handleEditPost = (post: Post) => {
    setEditingPostId(post.id);
    setPostForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      date: normalizePostDate(post.date) ?? post.date,
      timeSpent: post.timeSpent,
      subjectId: post.subjectId,
      tagsInput: (post.tags ?? []).join(', '),
    });
    clearStatus();
  };

  const handleDeletePost = async (postId: number) => {
    clearStatus();

    try {
      await cmsApi.deletePost(postId);
      setStatusType('success');
      setStatus('Post deleted.');

      if (editingPostId === postId) {
        setEditingPostId(null);
        setPostForm(EMPTY_POST);
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
        <Typography variant="h5">Posts</Typography>

        <Box component="form" onSubmit={handlePostSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Title"
              value={postForm.title}
              onChange={event =>
                setPostForm(prev => ({ ...prev, title: event.target.value }))
              }
              required
            />
            <TextField
              label="Excerpt"
              value={postForm.excerpt}
              onChange={event =>
                setPostForm(prev => ({ ...prev, excerpt: event.target.value }))
              }
              required
            />
            <TextField
              select
              label="Subject"
              value={postForm.subjectId}
              onChange={event =>
                setPostForm(prev => ({ ...prev, subjectId: event.target.value }))
              }
              required
            >
              {subjects.map(subject => (
                <MenuItem key={subject.id} value={subject.id}>
                  {subject.title}
                </MenuItem>
              ))}
            </TextField>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Date"
                value={postForm.date}
                onChange={event =>
                  setPostForm(prev => ({ ...prev, date: event.target.value }))
                }
                placeholder="yyyy/mm/dd"
                helperText="Use yyyy/mm/dd"
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '\\d{4}/\\d{2}/\\d{2}',
                }}
                required
              />
              <TextField
                fullWidth
                label="Time Spent"
                value={postForm.timeSpent}
                onChange={event =>
                  setPostForm(prev => ({ ...prev, timeSpent: event.target.value }))
                }
              />
            </Stack>
            <TextField
              label="Tags (comma separated)"
              value={postForm.tagsInput}
              onChange={event =>
                setPostForm(prev => ({ ...prev, tagsInput: event.target.value }))
              }
              helperText="Example: ai, machine-learning, portfolio"
            />
            <TextField
              multiline
              minRows={8}
              label="Content (Markdown only)"
              value={postForm.content}
              onChange={event =>
                setPostForm(prev => ({ ...prev, content: event.target.value }))
              }
              required
            />

            <Stack direction="row" spacing={1}>
              <Button type="submit" variant="contained">
                {editingPostId ? 'Update Post' : 'Create Post'}
              </Button>
              {editingPostId && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditingPostId(null);
                    setPostForm(EMPTY_POST);
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
          {posts.map(post => (
            <Paper key={post.id} variant="outlined" sx={{ p: 2 }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={1}
              >
                <Box>
                  <Typography fontWeight={600}>{post.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    #{post.id} · {subjectById.get(post.subjectId)?.title || post.subjectId}
                  </Typography>
                  {(post.tags?.length ?? 0) > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Tags: {(post.tags ?? []).join(', ')}
                    </Typography>
                  )}
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button size="small" onClick={() => handleEditPost(post)}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeletePost(post.id)}
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

export default PostForm;