import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

interface MarkdownContentProps {
  content: string;
}

function MarkdownContent({ content }: MarkdownContentProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        '& ul, & ol': {
          pl: 2,
          mb: 1.5,
        },
        '& li': {
          mb: 0.5,
        },
        '& pre': {
          backgroundColor: theme.palette.mode === 'light' ? '#f4ede4' : '#2a1f1a',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '0.5rem',
          p: 2,
          overflow: 'auto',
          mb: 1.5,
        },
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
            h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
            <Typography variant="h5" sx={{ mt: 3, mb: 1.5, color: theme.palette.primary.main }} {...props}>
                {props.children}
            </Typography>
            ),
            h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
            <Typography variant="h6" sx={{ mt: 2.5, mb: 1 }} {...props}>
                {props.children}
            </Typography>
            ),
            p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
            <Typography sx={{ mb: 1.5, lineHeight: 1.6 }} {...props}>
                {props.children}
            </Typography>
            ),
            code: (props: React.HTMLAttributes<HTMLElement>) => (
            <Box
                component="code"
                sx={{
                backgroundColor: theme.palette.mode === 'light' ? '#f4ede4' : '#2a1f1a',
                px: 0.5,
                py: 0.25,
                borderRadius: '4px',
                fontFamily: 'monospace',
                }}
                {...props}
            >
                {props.children}
            </Box>
            ),
            a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
            <Link
                href={props.href}
                target={props.href?.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                {...props}
            >
                {props.children}
            </Link>
            ),
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
}

export default MarkdownContent;