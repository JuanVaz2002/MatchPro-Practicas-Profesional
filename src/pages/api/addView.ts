// src/pages/api/CVs.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import matchprodb from '../../server/lib/dt';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { jobId, view } = req.body;
      
      console.log('Received view data:', req.body);
      // Insert into DB
      const [result] = await matchprodb.query<any>(
        `UPDATE jobs
          SET views = (?)
          WHERE id = (?)`,
        [
            view,
            jobId
        ]
      );

      console.log('View updated successfully:', result);
      return res.status(201).json({ message: 'View updated successfully', id: (result as any).insertId });
    } catch (error) {
      console.error('Error updating view:', error);
      return res.status(500).json({ error: 'Failed to update view', details: error.message });
    }
  }
}