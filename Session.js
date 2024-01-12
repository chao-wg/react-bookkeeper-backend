import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    const jwtToken = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyODMsImV4cCI6MTY5NDYwMjIwNH0.P7RLF9hlyj7LNJIIukGFyYcPhy4j69_AsFk_U0SQg8w';

    res.set({
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '0',
        'X-Content-Type-Options': 'nosniff',
        'X-Download-Options': 'noopen',
        'X-Permitted-Cross-Domain-Policies': 'none',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Content-Type': 'application/json; charset=utf-8',
        'Vary': 'Accept, Origin',
        'ETag': 'W/"29886053549dadaf0204b8c1f407ae9e"',
        'Cache-Control': 'max-age=0, private, must-revalidate',
        'X-Request-Id': '56303a92-de36-45de-a4cd-1aa06a8e9ff6',
        'X-Runtime': '0.007657',
        'Content-Length': '118'
    });

    res.status(200).json({ jwt: jwtToken });
});

export default router;
