import type { NextApiRequest, NextApiResponse } from 'next';
import matchprodb from '../../server/lib/dt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    

    if (req.method === 'POST') {
        try {
          const { candidateData, recruiterID, aiAnalysis } = req.body;

          console.log('Received Candidate data:', req.body);
          const addedAt = new Date().toISOString().split('T')[0];
          // Basic validation
          if (!candidateData) {
            return res.status(400).json({ error: 'Missing required fields' });
          }

          let location: string[] | null = null;
          const rawLocation = candidateData.jobPreferences?.location;

          if (typeof rawLocation === "string") {
            try {
              location = JSON.parse(rawLocation);
            } catch (err) {
              console.error("Invalid JSON for location:", rawLocation, err);
              location = null;
            }
          } else if (Array.isArray(rawLocation)) {
            location = rawLocation;
          }

          const [findCandidateResult] = await matchprodb.query<any>(
            `SELECT * FROM matchprodb.candidates 
            WHERE email = ? 
              AND password = ?`,
            [
              candidateData.email, candidateData.password
            ]
          );



          if (!Array.isArray(findCandidateResult) || findCandidateResult.length === 0)
          {
              const [insertCandidateResult] = await matchprodb.query<any>(
                `INSERT INTO candidates (name, email, phone, professionalTitle, password, createdAt, experience, availability, recruitmentSource, location)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  candidateData.name,
                  candidateData.email,
                  candidateData.phone,
                  candidateData.professionalTitle,
                  candidateData.password,
                  addedAt,
                  candidateData.experience,
                  "available_soon",
                  candidateData.recruitmentSource,
                  candidateData.location
                ]
              );

              if (!insertCandidateResult) {
                return res.status(500).json({ error: 'Failed to save candidate basic info' });
              }

              const candidateID = insertCandidateResult.insertId

              if (!candidateID) {
                return res.status(500).json({ error: 'Failed to create candidate record' });
              }

              if (!recruiterID) {
                return res.status(400).json({ error: 'Missing recruiterID' });
              }


              const [insertJobPreference] = await matchprodb.query<any>(
                `INSERT INTO job_preferences (candidate_id, salaryMin, salaryMax, location, jobType)
                  VALUES (?, ?, ?, ?, ?)`,
                [
                  Number(candidateID),
                  candidateData.jobPreferences.salary.min,
                  candidateData.jobPreferences.salary.max,
                  location,
                  candidateData.jobPreferences.jobType
                ]
              );

              const [insertLinkResult] = await matchprodb.query<any>(
                `INSERT INTO candidates_database (candidate_id, recruiter_id, addedAt)
                  VALUES (?, ?, ?)`,
                [
                  Number(candidateID),
                  Number(recruiterID),
                  addedAt
                ]
              );
              // Convert arrays to JSON strings for database storage
              const strengthsJson = Array.isArray(aiAnalysis.strengths) ? JSON.stringify(aiAnalysis.strengths) : aiAnalysis.strengths;
              const concernsJson = Array.isArray(aiAnalysis.concerns) ? JSON.stringify(aiAnalysis.concerns) : aiAnalysis.concerns;
                            

              const [result] = await matchprodb.query<any>(
                `INSERT INTO ai_analysis (candidate_id, strengths, concerns, recommendation, matchScore, cv_link, cv_id, uploadedAt)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                 [
                  candidateID,
                  strengthsJson, 
                  concernsJson, 
                  aiAnalysis.recommendation, 
                  aiAnalysis.score, 
                  aiAnalysis.cv_link,
                  aiAnalysis.cv_id,
                  addedAt
                  
                 ]
              )
      
              console.log('AI analysis updated successfully:', result);
      
              const [result_candidate] = await matchprodb.query<any>(
                `UPDATE candidates 
                 SET matchScore = (?), cvUploaded = (?)
                 WHERE  id = (?)`,

                 [
                  aiAnalysis.score,
                  1, 
                  candidateID
                 ]
              ) 

              console.log('Candidate added/linked successfully:', insertLinkResult);
              return res.status(201).json({ message: 'Candidate saved successfully', id: Number(candidateID) });
          }
          return res.status(500).json({ error: 'Ya existe un candidato' });

        } catch (error) {
          console.error('Error adding candidate:', error);
          return res.status(500).json({ error: 'Failed to add candidate', details: error.message });
        }
      }

  res.setHeader('Allow', ['POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}