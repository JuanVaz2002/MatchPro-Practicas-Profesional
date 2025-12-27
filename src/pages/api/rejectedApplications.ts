// src/pages/api/CVs.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import matchprodb from '../../server/lib/dt';
import { RejectedApplication } from '../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  
  if (req.method === 'GET') {
    const script_applications = `SELECT * FROM matchprodb.rejected_applications`;

    try {
     const [rows_rejected_applications] = await matchprodb.query<any[]>(script_applications);
     
     // No deduplication needed - map directly
     const rejectedApplications = rows_rejected_applications.map(app => ({
       id: app.id,
       rejectedApplicationId: app.rejected_application_id,
       candidateId: app.candidate_id,
       jobId: app.job_id,
       reason: app.reason,
       responsedAt: app.responsedAt,
       comentario: app.comentario
     }));

     res.status(202).json(rejectedApplications);
   } catch (error) {
     console.error('Error fetching rejected applications:', error);
     res.status(500).json({ error: 'Failed to fetch rejected applications' });
   }
 }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}