// src/pages/api/CVs.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import matchprodb from '../../server/lib/dt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { name, candidateId, matchScore } = req.body;
      
      console.log(`Updating MatchScore of ${name}:`, req.body);

    //   const createdAt = new Date().toISOString().split('T')[0];

      // Insert into DB
      const [result] = await matchprodb.query<any>(
        `UPDATE candidates
        SET matchScore = (?)
        WHERE id = (?);`,
        [
            matchScore,
            candidateId
        ]
      );

      console.log('Match score updated successfully:', result);
      return res.status(201).json({ message: 'MatchScore updated  successfully', id: (result as any).insertId });
    } catch (error) {
      console.error('Error updating match score:', error);
      return res.status(500).json({ error: 'Failed to update match score', details: error.message });
    }
  }
}