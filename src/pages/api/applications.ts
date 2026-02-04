// src/pages/api/CVs.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import matchprodb from '../../server/lib/dt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  if (req.method === 'PATCH') {
    try {

      const { jobId, candidateId, status, reason, comentario } = req.body;
      
      // console.log('Received IDs:', req.body);

      // Validate required fields
      if (!candidateId) {
        return res.status(404).json({ error: 'candidateId is required' });
      }

      if (!jobId) {
        return res.status(404).json({ error: 'jobId is required' });
      }
      
      const [data] = await matchprodb.query<any>(
        `SELECT * FROM applications WHERE jobId=? AND candidateId=?`,
        [
          jobId,
          candidateId,
        ]
      );
      
      if (!data) {
        return res.status(404).json({ error: 'Application Data not found' });
      }

      const applicationId = data[0].id;

      const [result] = await matchprodb.query<any>(
        `UPDATE applications 
        SET 
          status = ?
        WHERE id = ?`,
        [
          status,
          applicationId
        ]
      );

      
      const responsedAt = new Date().toISOString().split('T')[0];

      if (status === 'rejected') {
        await matchprodb.query<any>(
          `INSERT INTO rejected_applications (rejected_application_id, candidate_id, job_id, reason, responsedAt, comentario) VALUES 
          (?, ?, ?, ?, ?, ?)`,
          [
            applicationId,
            candidateId,
            jobId,
            reason,
            responsedAt,
            comentario
          ]
        );
      }

      if (status === 'hired') {
        await matchprodb.query<any>(
          `INSERT INTO hired_applications (hired_application_id, candidate_id, job_id, responsedAt) VALUES 
          (?, ?, ?, ?)`,
          [
            applicationId,
            candidateId,
            jobId,
            responsedAt,
          ]
        );
      }


      if (!result) {
        return res.status(424).json({ error: 'Failed to update an application status' });
      }

      

      console.log('Application status updated successfully:', result);
      return res.status(202).json({ message: 'Application status updated successfully', id: (result as any).insertId });
    } catch (error) {
      console.error('Error updating an application status:', error);
      return res.status(500).json({ error: 'Failed to update an application status', details: error.message });
    }
  }
  else if (req.method === 'POST') {
    try {

      const { candidateId, jobId } = req.body;
      
      console.log('Received IDs:', req.body);

      // Validate required fields
      if (!candidateId) {
        return res.status(400).json({ error: 'candidateId is required' });
      }

      if (!jobId) {
        return res.status(400).json({ error: 'jobId is required' });
      }

      const appliedAt = new Date().toISOString().split('T')[0];

      // Insert into DB
      const [result] = await matchprodb.query<any>(
        `INSERT INTO applications (jobId, candidateId, status, appliedAt, reviewed)
          VALUES (?, ?, ?, ?, ?)`,
        [
          jobId,
          candidateId,
          "pending",
          appliedAt,
          0
        ]
      );

      console.log('Application saved successfully:', result);
      return res.status(201).json({ message: 'Application saved successfully', id: (result as any).insertId });
    } catch (error) {
      console.error('Error saving an application:', error);
      return res.status(500).json({ error: 'Failed to save an application', details: error.message });
    }
  }
  else if (req.method === 'GET') {
    const script_applications = `SELECT * FROM matchprodb.applications`;

    try{


     const [rows_applications] = await matchprodb.query<any[]>(script_applications);
   //   const [rows_company_info] = await matchprodb.query<any[]>('SELECT * FROM company_info');
     
     // // Group by client ID
     const applicationMap: Record<number, any> = {};

     for (const application of rows_applications) {
       const applicationID = application.id
       if(!applicationMap[applicationID]) { 
         applicationMap[applicationID]= {
          id: applicationID,
          appliedAt: application.appliedAt,
          status: application.status,
          candidateId: application.candidateId,
          jobId: application.jobId,
          reviewed: application.reviewed === 1

         }
       }
     }

     res.status(202).json(Object.values(applicationMap));
   } catch (error) {
     console.error('Error fetching jobs:', error);
     res.status(500).json({ error: 'Failed to fetch jobs' });
   }
 }
  else {
    res.setHeader('Allow', ['GET', 'POST', 'PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}