import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import { ContentCopy, Link as LinkIcon } from '@mui/icons-material';

interface ShortenResult {
  originalUrl: string;
  shortUrl: string;
  shortCode: string;
  createdAt: string;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<ShortenResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to shorten URL');
      }

      const data = await response.json();
      setResult(data);
      setUrl('');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result?.shortUrl) {
      try {
        await navigator.clipboard.writeText(result.shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <LinkIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h3" component="h1" gutterBottom>
              URL Shortener
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Transform long URLs into short, shareable links
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Enter your URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very/long/url"
              variant="outlined"
              disabled={loading}
              sx={{ mb: 2 }}
              inputProps={{ 'data-testid': 'url-input' }}
            />
            
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading || !url}
              data-testid="shorten-button"
              sx={{ py: 1.5 }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Shortening...
                </>
              ) : (
                'Shorten URL'
              )}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} data-testid="error-message">
              {error}
            </Alert>
          )}

          {result && (
            <Card elevation={2} data-testid="result-card">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Your shortened URL:
                </Typography>
                
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'grey.100',
                    p: 2,
                    borderRadius: 1,
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ flexGrow: 1, wordBreak: 'break-all' }}
                    data-testid="short-url"
                  >
                    {result.shortUrl}
                  </Typography>
                  <IconButton
                    onClick={handleCopy}
                    color={copied ? 'success' : 'primary'}
                    data-testid="copy-button"
                  >
                    <ContentCopy />
                  </IconButton>
                </Box>

                {copied && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    URL copied to clipboard!
                  </Alert>
                )}

                <Typography variant="body2" color="text.secondary">
                  Original URL: {result.originalUrl}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Paper>
      </Box>
    </Container>
  );
}