import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Link,
  Button,
  TextField,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  IconButton,
  Divider,
  useTheme,
  Snackbar,
  Alert
} from '@mui/material';
import { ContentCopy, Link as LinkIcon, History as HistoryIcon, ClearAll } from '@mui/icons-material';
import { shortenUrl, getShortLink } from '../api/urlApi.js';
import { Header } from '../components/layout/Header.jsx';

function Home() {
  const theme = useTheme();

  // State from old hook
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [shortenedUrl, setShortenedUrl] = useState(null);
  const [originalUrl, setOriginalUrl] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('url_history_react');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!originalUrl) return;

    setLoading(true);
    setError(null);

    try {
      const response = await shortenUrl(originalUrl);
      const shortLink = getShortLink(response.shortCode);
      setShortenedUrl(shortLink);

      const newEntry = { ...response, shortLink };
      const updatedHistory = [newEntry, ...history.filter(h => h.originalUrl !== originalUrl)].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem('url_history_react', JSON.stringify(updatedHistory));
      setOriginalUrl('');
    } catch (err) {
      setError('Không thể rút gọn URL. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setSnackbarOpen(true);
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('url_history_react');
  };

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="md">
        <Header />

        {/* URL Form Section */}
        <Paper sx={{ p: 4, mb: 4, borderRadius: 4 }}>
          <form onSubmit={handleShorten}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                fullWidth
                placeholder="Dán link của bạn vào đây..."
                variant="outlined"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                error={!!error}
                helperText={error}
                InputProps={{
                  startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
              <button
                type="submit"
                disabled={loading || !originalUrl}
                style={{
                  backgroundColor: '#6366f1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0 32px',
                  height: '56px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  flexShrink: 0
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Rút gọn URL'}
              </button>
            </Box>
          </form>
        </Paper>

        {/* Success Result */}
        {shortenedUrl && (
          <Box sx={{ animation: 'fadeIn 0.5s ease', mb: 6 }}>
            <Paper sx={{
              p: 3,
              borderRadius: 4,
              border: `1px solid ${theme.palette.primary.main}4d`,
              background: `${theme.palette.primary.main}08`
            }}>
              <Typography variant="subtitle2" gutterBottom color="primary">
                Link rút gọn của bạn:
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                <Link
                  href={shortenedUrl}
                  target="_blank"
                  underline="none"
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'secondary.light',
                    wordBreak: 'break-all'
                  }}
                >
                  {shortenedUrl}
                </Link>
                <Button
                  startIcon={<ContentCopy />}
                  variant="outlined"
                  onClick={() => copyToClipboard(shortenedUrl)}
                >
                  Sao chép
                </Button>
              </Box>
            </Paper>
          </Box>
        )}

        {/* Local History Section */}
        {history.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HistoryIcon /> Lịch sử gần đây của bạn
              </Typography>
              <Button startIcon={<ClearAll />} size="small" onClick={clearHistory} color="inherit">
                Xóa tất cả
              </Button>
            </Box>
            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <List disablePadding>
                {history.map((item, index) => (
                  <React.Fragment key={item.shortCode}>
                    <ListItem
                      secondaryAction={
                        <Tooltip title="Sao chép">
                          <IconButton onClick={() => copyToClipboard(item.shortLink)}>
                            <ContentCopy fontSize="small" />
                          </IconButton>
                        </Tooltip>

                      }
                    >

                      <ListItemText
                        primary={
                          <Link href={item.shortLink} target="_blank" color="secondary" sx={{ fontWeight: 600 }}>
                            {item.shortLink}
                          </Link>
                        }
                        secondary={item.originalUrl}
                        secondaryTypographyProps={{
                          noWrap: true,
                          sx: { maxWidth: { xs: '200px', sm: '400px', md: '500px' } }
                        }}
                      />
                    </ListItem>
                    {index < history.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Box>
        )}
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          Đã sao chép link vào clipboard!
        </Alert>
      </Snackbar>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
}

export default Home;
