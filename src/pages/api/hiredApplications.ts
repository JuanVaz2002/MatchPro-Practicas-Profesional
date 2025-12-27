// src/pages/api/CVs.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import matchprodb from '../../server/lib/dt';
import { HiredApplication } from '../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  
  if (req.method === 'GET') {
    const script_applications = `SELECT * FROM matchprodb.hired_applications`;

    try {
     const [rows_hired_applications] = await matchprodb.query<any[]>(script_applications);
     
     const hiredApplications = rows_hired_applications.map(app => ({
       id: app.id,
       hiredApplicationId: app.hired_application_id,
       candidateId: app.candidate_id,
       jobId: app.job_id,
       responsedAt: app.responsedAt
     }));

     res.status(202).json(hiredApplications);
   } catch (error) {
     console.error('Error fetching hired applications:', error);
     res.status(500).json({ error: 'Failed to fetch hired applications' });
   }
 }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}