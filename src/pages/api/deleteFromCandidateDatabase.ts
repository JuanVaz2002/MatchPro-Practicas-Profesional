import type { NextApiRequest, NextApiResponse } from 'next';
import matchprodb from '../../server/lib/dt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    

    if (req.method === 'POST') {
        try {
          const { candidateId, recruiterId } = req.body;
          
          console.log('Received AI analysis data:', req.body);
    
          // Validate required fields
          if (!candidateId) {
            return res.status(400).json({ error: 'candidateId is required' });
          }

          if (!recruiterId) {
            return res.status(400).json({ error: 'candidateId is required' });
          }
    
    
          // Insert into DB
          const [result] = await matchprodb.query<any>(
            `DELETE FROM matchprodb.candidates_database WHERE candidate_id = (?) and recruiter_id = (?)`,
            [
              Number(candidateId),
              Number(recruiterId)
            ]
          );
    
          console.log('Candidate deleted successfully:', result);
          return res.status(201).json({ message: 'Candidate deleted successfully', id: (result as any).insertId });
        } catch (error) {
          console.error('Error deleting candidate:', error);
          return res.status(500).json({ error: 'Failed to delete candidate', details: error.message });
        }
      }
    else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}