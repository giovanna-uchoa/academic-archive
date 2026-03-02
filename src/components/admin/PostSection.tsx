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
import type { Post, Subject } from '../../types/content';

interface PostSectionProps {
  posts: Post[];
  subjects: Subject[];
  token: string;
  requireToken: () => boolean;
  reload: () => Promise<void>;
  setStatus: (status: string | null) => void;
  setStatusType: (type: 'success' | 'error') => void;
}

const EMPTY_POST = {
  title: '',
  excerpt: '',
  content: '',
  date: '',
  timeSpent: '',
  subjectId: '',
};

export function PostSection({ posts, subjects, token, requireToken, reload, setStatus, setStatusType}: PostSectionProps) {
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

    if (!requireToken()) {
      return;
    }

    try {
      if (editingPostId) {
        await cmsApi.updatePost(token, editingPostId, postForm);
        setStatusType('success');
        setStatus(`Post "${postForm.title}" updated.`);
      } else {
        await cmsApi.createPost(token, postForm);
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
      date: post.date,
      timeSpent: post.timeSpent,
      subjectId: post.subjectId,
    });
    clearStatus();
  };

  const handleDeletePost = async (postId: number) => {
    clearStatus();

    if (!requireToken()) {
      return;
    }

    try {
      await cmsApi.deletePost(token, postId);
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
              multiline
              minRows={8}
              label="Content (Markdown or HTML)"
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