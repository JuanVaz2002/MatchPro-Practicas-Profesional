import type { NextApiRequest, NextApiResponse } from 'next';
import matchprodb from '../../server/lib/dt';

const script_candidates_database = `SELECT * FROM matchprodb.candidates_database`;


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const [rows_candidatesDatabase] = await matchprodb.query<any[]>(script_candidates_database);

        // Group by client ID
        const candidatesDatabaseMap: Record<number, any> = {};
        
        for (const candidatesDatabase of rows_candidatesDatabase) {
            const CDB_ID = candidatesDatabase.id;
            if (!candidatesDatabaseMap[CDB_ID]) {
                candidatesDatabaseMap[CDB_ID] = {
                    id: CDB_ID,
                    candidateID: candidatesDatabase.candidate_id,
                    recruiterID: candidatesDatabase.recruiter_id,
                    addedAt: candidatesDatabase.addedAt instanceof Date ? candidatesDatabase.addedAt.toISOString().split("T")[0] : String(candidatesDatabase.addedAt).split("T")[0],
                };
            }
        }

        const candidatesDatabase = Object.values(candidatesDatabaseMap);
        res.status(200).json(candidatesDatabase);
    } else {
    //     try {
    
    //       const { candidateId, recruiterId } = req.body;
          
    //       console.log('Received AI analysis data:', req.body);
    
    //       // Validate required fields
    //       if (!candidateId) {
    //         return res.status(400).json({ error: 'candidateId is required' });
    //       }

    //       if (!recruiterId) {
    //         return res.status(400).json({ error: 'candidateId is required' });
    //       }
    
    
    //       const addedAt = new Date().toISOString().split('T')[0];
    
    
    //       // Insert into DB
    //       const [result] = await matchprodb.query<any>(
    //         `INSERT INTO candidates_database (candidate_id, recruiter_id, addedAt)
    //           VALUES (?, ?, ?)`,
    //         [
    //           Number(candidateId),
    //           Number(recruiterId),
    //           addedAt
    //         ]
    //       );
    
    //       console.log('Candidate added successfully:', result);
    //       return res.status(201).json({ message: 'Candidate added successfully', id: (result as any).insertId });
    //     } catch (error) {
    //       console.error('Error adding candidate:', error);
    //       return res.status(500).json({ error: 'Failed to add candidate', details: error.message });
    //     }
    //   }
    
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}