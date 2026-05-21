import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Home, History } from '@mui/icons-material';

export const Navbar = () => {
    return (
        <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Container maxWidth="md">
                <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h6" component={RouterLink} to="/" sx={{
                        textDecoration: 'none',
                        color: 'primary.light',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}>
                        Shortlink
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button component={RouterLink} to="/" startIcon={<Home />} color="inherit">
                            Trang chủ
                        </Button>
                        <Button component={RouterLink} to="/history" startIcon={<History />} color="inherit">
                            Lịch sử Hệ thống
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
