import React from 'react';
import { Box, Typography } from '@mui/material';

export const Footer = () => {
    return (
        <Box component="footer" sx={{ py: 6, textAlign: 'center', mt: 'auto', color: 'text.secondary' }}>
            <Typography variant="body2">
                &copy; 2026 ShortLink. All rights reserved.
            </Typography>
        </Box>
    );
};
