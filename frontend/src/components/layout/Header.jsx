import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

export const Header = () => {
    const theme = useTheme();

    return (
        <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{
                fontWeight: 800,
                background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }}>
                <span style={{ color: theme.palette.text.primary }}>ShortLink</span>
            </Typography>
            <Typography variant="h6" color="text.secondary">
                Rút gọn liên kết nhanh chóng và chuyên nghiệp với ShortLink
            </Typography>
        </Box>
    );
};
