import { jest } from '@jest/globals';

// Mocks must be defined before imports in ESM if using standard jest.mock
// but in ESM it's better to use unstable_mockModule or just mock the functions after import if possible.
// However, Url is a default export.

// Let's try manual property assignment if auto-mock failing
import Url from '../models/Url.js';
import { nanoid } from 'nanoid';
import { shortenUrl, redirectUrl, deleteUrl, listUrls, getUrlInfo } from '../controllers/urlController.js';

// Manually mock the methods on the imported Url object
Url.findOne = jest.fn();
Url.create = jest.fn();
Url.findAndCountAll = jest.fn();
Url.destroy = jest.fn();

// Manually mock nanoid
// Note: nanoid is a named export or default depending on version
// Since we used import { nanoid } from 'nanoid', we mock it as a variable if it was exported that way.
// But nanoid v5 is ESM only.

describe('UrlController', () => {
    let mockReq;
    let mockRes;

    beforeEach(() => {
        mockReq = {
            body: {},
            params: {},
            query: {},
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            redirect: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    describe('shortenUrl', () => {
        it('should return 400 if originalUrl is missing', async () => {
            await shortenUrl(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Original URL is required' });
        });

        it('should return existing URL if it already exists', async () => {
            const existingUrl = { originalUrl: 'https://google.com', shortCode: 'abc' };
            mockReq.body.originalUrl = 'https://google.com';
            Url.findOne.mockResolvedValue(existingUrl);

            await shortenUrl(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(existingUrl);
        });

        it('should create a new short URL if it does not exist', async () => {
            mockReq.body.originalUrl = 'https://new.com';
            Url.findOne.mockResolvedValue(null);
            // We can't easily mock nanoid if it's a direct import and we can't reassign it
            // So we might just check if it was called through other side effects if possible
            // but for now let's hope Url.create gets called.
            Url.create.mockResolvedValue({ originalUrl: 'https://new.com', shortCode: 'newCode' });

            await shortenUrl(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                originalUrl: 'https://new.com'
            }));
        });
    });

    describe('redirectUrl', () => {
        it('should redirect if code exists', async () => {
            mockReq.params.code = 'abc';
            Url.findOne.mockResolvedValue({ originalUrl: 'https://target.com' });

            await redirectUrl(mockReq, mockRes);

            expect(mockRes.redirect).toHaveBeenCalledWith('https://target.com');
        });

        it('should return 404 if code does not exist', async () => {
            mockReq.params.code = 'invalid';
            Url.findOne.mockResolvedValue(null);

            await redirectUrl(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
        });
    });

    describe('deleteUrl', () => {
        it('should return 200 on successful deletion', async () => {
            mockReq.params.id = '1';
            Url.destroy.mockResolvedValue(1);

            await deleteUrl(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'URL deleted successfully' });
        });

        it('should return 404 if URL to delete is not found', async () => {
            mockReq.params.id = '999';
            Url.destroy.mockResolvedValue(0);

            await deleteUrl(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
        });
    });

    describe('listUrls', () => {
        it('should return paginated URLs', async () => {
            const mockData = { count: 1, rows: [{ id: 1, originalUrl: 'https://test.com' }] };
            Url.findAndCountAll.mockResolvedValue(mockData);
            mockReq.query = { page: '1', limit: '10' };

            await listUrls(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                total: 1,
                urls: mockData.rows
            }));
        });
    });

    describe('getUrlInfo', () => {
        it('should return URL details for a valid code', async () => {
            mockReq.params.code = 'abc';
            Url.findOne.mockResolvedValue({ id: 1, originalUrl: 'https://test.com' });

            await getUrlInfo(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                originalUrl: 'https://test.com'
            }));
        });

        it('should return 404 for an invalid code', async () => {
            mockReq.params.code = 'invalid';
            Url.findOne.mockResolvedValue(null);

            await getUrlInfo(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
        });
    });
});
