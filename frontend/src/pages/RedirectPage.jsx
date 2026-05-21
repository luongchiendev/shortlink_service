import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, CircularProgress, Paper, useTheme } from '@mui/material';
import { getShortLink } from '../api/urlApi.js';

const RedirectPage = () => {
    const { code } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const [seconds, setSeconds] = useState(5);
    const [targetUrl, setTargetUrl] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUrl = async () => {
            try {
                const data = await getShortLink(code);
                console.log(data);
                setTargetUrl(data.originalUrl);
            } catch (err) {
                setError('Liên kết không tồn tại hoặc đã bị xóa.');
                console.error(err);
            }
        };
        fetchUrl();
    }, [code]);

    useEffect(() => {
        if (!targetUrl || error) return;

        if (seconds > 0) {
            const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            // Redirect when countdown reaches 0
            window.location.replace(targetUrl);
        }
    }, [seconds, targetUrl, error]);

    if (error) {
        return (
            <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h4" color="error" gutterBottom>{error}</Typography>
                <Typography variant="body1">Vui lòng kiểm tra lại ID liên kết.</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 15, textAlign: 'center' }}>
            <Paper sx={{ p: 6, borderRadius: 4, background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)' }}>
                <CircularProgress
                    variant="determinate"
                    value={(5 - seconds) * 20}
                    size={80}
                    thickness={4}
                    sx={{ mb: 4, color: theme.palette.secondary.main }}
                />
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                    {seconds} s
                </Typography>
                <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
                    Đang chuẩn bị chuyển hướng...
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Bạn đang được chuyển hướng đến:<br />
                    <span style={{ color: theme.palette.primary.light, wordBreak: 'break-all' }}>
                        {targetUrl || '...'}
                    </span>
                </Typography>
            </Paper>
        </Container>
    );
};

export default RedirectPage;
