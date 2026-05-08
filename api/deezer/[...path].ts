import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const path = Array.isArray(req.query['path'])
        ? req.query['path'].join('/')
        : req.query['path'] ?? '';

    const { path: _, ...rest } = req.query;

    const queryString = new URLSearchParams(
        Object.entries(rest).flatMap(([key, value]) =>
            Array.isArray(value) ? value.map(v => [key, v]) : [[key, value ?? '']]
        )
    ).toString();

    const url = queryString
        ? `https://api.deezer.com/${path}?${queryString}`
        : `https://api.deezer.com/${path}`;

    console.log('Proxying to:', url);

    const response = await fetch(url);
    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.json(data);
}