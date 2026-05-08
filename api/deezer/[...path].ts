import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const path = Array.isArray(req.query['path'])
        ? req.query['path'].join('/')
        : req.query['path'] ?? '';

    const query = new URLSearchParams(req.query as Record<string, string>);
    query.delete('path');

    const url = `https://api.deezer.com/${path}?${query.toString()}`;

    const response = await fetch(url);
    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(data);
}