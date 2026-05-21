import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Tooltip,
    Link,
    Box,
    CircularProgress,
    Button,
    Snackbar,
    Alert
} from '@mui/material';
import { ContentCopy, Delete } from '@mui/icons-material';
import { listAllUrls, deleteUrl } from '../api/urlApi.js';

const HistoryPage = () => {
    const [urls, setUrls] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const fetchUrls = async () => {
        setLoading(true);
        try {
            const data = await listAllUrls(page + 1, rowsPerPage);
            setUrls(data.urls);
            setTotal(data.total);
        } catch (error) {
            console.error('Error fetching URLs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUrls();
    }, [page, rowsPerPage]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa URL này?')) {
            try {
                await deleteUrl(id);
                fetchUrls();
            } catch (error) {
                console.error('Error deleting URL:', error);
                alert('Không thể xóa URL. Vui lòng thử lại.');
            }
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setSnackbarOpen(true);
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                    Tất cả Short links
                </Typography>
                <Typography color="text.secondary">
                    Danh sách toàn bộ các liên kết đã được rút gọn trên hệ thống.
                </Typography>
            </Box>

            <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
                <TableContainer sx={{ minHeight: 400 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>STT</TableCell>
                                <TableCell>Short Link</TableCell>
                                <TableCell>Original URL</TableCell>
                                <TableCell>Ngày tạo</TableCell>
                                <TableCell align="right">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : urls.map((url, index) => (
                                <TableRow key={url.id} hover>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>
                                        <Link href={`http://localhost:5173/r/${url.shortCode}`} target="_blank" color="secondary" sx={{ fontWeight: 600 }}>
                                            {url.shortCode}
                                        </Link>
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {url.originalUrl}
                                    </TableCell>
                                    <TableCell>{formatDate(url.createdAt)}</TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                            <Tooltip title="Sao chép">
                                                <IconButton size="small" onClick={() => copyToClipboard(`http://localhost:5173/r/${url.shortCode}`)}>
                                                    <ContentCopy fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Xóa">
                                                <IconButton size="small" color="error" onClick={() => handleDelete(url.id)}>
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Số hàng mỗi trang:"
                />
            </Paper>

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
        </Container>
    );
};

export default HistoryPage;
