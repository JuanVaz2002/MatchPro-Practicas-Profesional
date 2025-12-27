import type { NextApiRequest, NextApiResponse } from 'next';
import matchprodb from '../../server/lib/dt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'PATCH') {
        const { applicationId } = req.body;

        if (!applicationId) {
            return res.status(404).json({ error: 'applicationId is required' });
        }
        
        const [reviewedApplication] = await matchprodb.query<any>(
            `UPDATE applications 
             SET
                reviewed=1
             WHERE id=?;`,
            [
                applicationId
            ]
        );
        res.status(202).json(reviewedApplication);
    }
    else {
        res.setHeader('Allow', ['PATCH']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}