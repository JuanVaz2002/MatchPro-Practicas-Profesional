// src/pages/api/CVs.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import matchprodb from '../../server/lib/dt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {

      const { recruiterID, strengths, concerns, recommendation, matchScore, cv_link } = req.body;
      
      console.log('Received AI analysis data:', req.body);

      // Validate required fields
      if (!recruiterID) {
        return res.status(400).json({ error: 'candidateId is required' });
      }

      if (!strengths || !concerns || !recommendation) {
        return res.status(400).json({ error: 'strengths, concerns, and recommendation are required' });
      }

      const uploadedAt = new Date().toISOString().split('T')[0];
      // Convert arrays to JSON strings for database storage
      const strengthsJson = Array.isArray(strengths) ? JSON.stringify(strengths) : strengths;
      const concernsJson = Array.isArray(concerns) ? JSON.stringify(concerns) : concerns;

      // Validate that the data can be properly serialized
      try {
        JSON.stringify(strengthsJson);
        JSON.stringify(concernsJson);
      } catch (error) {
        console.error('Error serializing AI analysis data:', error);
        return res.status(400).json({ error: 'Invalid data format for strengths or concerns' });
      }

      const [existing] = await matchprodb.query<any>(
        `SELECT id FROM ai_analysis_recruiter WHERE recruiter_id = ? LIMIT 1`,
        [recruiterID]
      );
      console.log(existing)
      if(existing.length > 0) {

        const [result] = await matchprodb.query<any>(
          `UPDATE ai_analysis_recruiter 
           SET strengths = (?), 
               concerns = (?), 
               recommendation = (?), 
               matchScore = (?), 
               cv_link = (?), 
               uploadedAt = (?)
           WHERE  id = (?)`,

           [
            strengthsJson, 
            concernsJson, 
            recommendation, 
            matchScore, 
            cv_link,
            uploadedAt,
            existing[0].id
           ]
        )

        console.log('AI analysis updated successfully:', result);

        
        const [result_candidate] = await matchprodb.query<any>(
          `UPDATE recruiters 
           SET cvUploaded = 1, 
               matchScore = (?), 
           WHERE  id = (?)`,

           [
            matchScore, 
            existing[0].id
           ]
        )

        console.log('Recruiter updated successfully:', result_candidate);

        
        return res.status(201).json({ message: 'AI analysis updated successfully', id: (result as any).insertId });

      } else {

        // Insert into DB
        const [result] = await matchprodb.query<any>(
          `INSERT INTO ai_analysis_recruiter (recruiter_id, strengths, concerns, recommendation, matchScore, cv_link, uploadedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            recruiterID,
            strengthsJson, 
            concernsJson, 
            recommendation, 
            matchScore, 
            cv_link,
            uploadedAt
          ]
        );

        const [result_candidate] = await matchprodb.query<any>(
          `UPDATE recruiters 
           SET cvUploaded = 1, 
               matchScore = (?), 
           WHERE  id = (?)`,

           [
            matchScore, 
            existing[0].id
           ]
        )

        console.log('Recruiter updated successfully:', result_candidate);

        console.log('AI analysis uploaded successfully:', result);
        return res.status(201).json({ message: 'AI analysis uploaded successfully', id: (result as any).insertId });

      }

      
    } catch (error) {
      console.error('Error uploading CV:', error);
      return res.status(500).json({ error: 'Failed to upload AI analysis', details: error.message });
    }
  }


  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}