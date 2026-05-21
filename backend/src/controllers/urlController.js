import { nanoid } from 'nanoid';
import Url from '../models/Url.js';

export const shortenUrl = async (req, res) => {
    try {
        const { originalUrl } = req.body;

        if (!originalUrl) {
            return res.status(400).json({ error: 'Original URL is required' });
        }

        // Check if URL already exists
        let url = await Url.findOne({ where: { originalUrl } });

        if (url) {
            return res.status(200).json(url);
        }

        // Generate short code
        const shortCode = nanoid(7);
        url = await Url.create({
            originalUrl,
            shortCode,
        });

        return res.status(201).json(url);
    } catch (error) {
        console.error('Error shortening URL:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const redirectUrl = async (req, res) => {
    try {
        const { code } = req.params;
        const url = await Url.findOne({ where: { shortCode: code } });

        if (!url) {
            return res.status(404).json({ error: 'URL not found' });
        }

        return res.redirect(url.originalUrl);
    } catch (error) {
        console.error('Error redirecting URL:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const listUrls = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Url.findAndCountAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        });

        return res.status(200).json({
            urls: rows,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error('Error listing URLs:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteUrl = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Url.destroy({ where: { id } });

        if (!deleted) {
            return res.status(404).json({ error: 'URL not found' });
        }

        return res.status(200).json({ message: 'URL deleted successfully' });
    } catch (error) {
        console.error('Error deleting URL:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const getUrlInfo = async (req, res) => {
    try {
        const { code } = req.params;
        const url = await Url.findOne({ where: { shortCode: code } });

        if (!url) {
            return res.status(404).json({ error: 'URL not found' });
        }

        return res.status(200).json(url);
    } catch (error) {
        console.error('Error fetching URL info:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
