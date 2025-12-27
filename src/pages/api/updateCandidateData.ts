import type { NextApiRequest, NextApiResponse } from 'next';
import matchprodb from '../../server/lib/dt';

interface ProfileData {
  // Common
  id: number;
  email: string;
  password?: string;
  name: string;
  avatar_url: string;
  createdAt?: string;
  bio?: string;
  location?: string;
  phone?: string;
  role: 'candidate' | 'recruiter';

  // Candidate-specific
  skills: string[];
  experience: number;
  cvUploaded?: boolean;
  professional_title?: string;
  matchScore?: number;
  availability?: string;
  recruitmentSource?: string;
  company?: string;
  industry?: string;
  // Candidate job preferences
  salary_min: number;
  salary_max: number;
  job_type: string;
  preferred_locations: string[];

  // Recruiter-specific
  companyName?: string;
  companySizeMin?: number;
  companySizeMax?: number;
  address?: string;
  foundedYear?: number;
  companyDescription?: string;
  employerRole?: string;
  requirements?: string[];
  companyTypes?: string[];
  companyLocation?: string;
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    

    if (req.method === 'PATCH') {
        try {
      // Accept either { formData: {...} } or the raw form object in the request body
      const formData: ProfileData = (req.body && (req.body.formData ?? req.body)) as any;
      console.log('Received Candidate data for update:', formData);

      if (!formData || !formData.email || !formData.id) {
        return res.status(400).json({ error: 'Missing required candidate id or email', received: req.body });
      }

            const [findCandidateResult] = await matchprodb.query<any>(
            `SELECT * FROM matchprodb.candidates 
            WHERE email = ? 
              AND id = ?`,
            [
              formData.email, formData.id
            ]);

            const [findJobPreferencesResult] = await matchprodb.query<any>(
            `SELECT * FROM matchprodb.job_preferences 
            WHERE candidate_id = ?`,
            [
               findCandidateResult.id
            ]);

          if (!Array.isArray(findCandidateResult) || findCandidateResult.length === 0)
          {
              return res.status(404).json({ error: 'Candidate not found' });
          }
          else  
          {

              const [updateCandidateResult] = await matchprodb.query<any>(
                `UPDATE candidates 
                 SET name = ?, 
                     professionalTitle = ?,    
                     email = ?,
                     phone = ?, 
                     location = ?,
                     experience = ?,
                     bio = ?,
                     skills = ?                    
                 WHERE id = ?`,
                [
                  formData.name,
                  formData.professional_title,
                  formData.email,
                  formData.phone,
                  formData.location,
                  formData.experience,
                  formData.bio,
                  JSON.stringify(formData.skills),
                  formData.id
                ]
              );

              // Safely handle potentially missing jobPreferences
 

              const [updateJobPreferencesResult] = await matchprodb.query<any>(
                `UPDATE job_preferences 
                 SET salaryMin = ?, 
                     salaryMax = ?,    
                     jobType = ?,
                     location = ?
                 WHERE candidate_id = ?`,
                [
                  formData.salary_min,
                  formData.salary_max,
                  formData.job_type ?? null,
                  JSON.stringify(formData.preferred_locations ?? []),
                  formData.id
                ]
              );
              // JSON.stringify(candidateData.jobPreferences),
              if ((updateCandidateResult && updateCandidateResult.affectedRows === 0) || (updateJobPreferencesResult && updateJobPreferencesResult.affectedRows === 0)) {
                return res.status(500).json({ error: 'Failed to update candidate basic info', updateCandidateResult, updateJobPreferencesResult });
              }
              return res.status(202).json({ message: 'Candidate data updated successfully' });
            }
        } catch (error) {
            console.error('Error updating candidate data:', error);
            const msg = (error as any)?.message ?? String(error);
            res.status(500).json({ error: 'Internal Server Error', message: msg });
        }
    }

    res.setHeader('Allow', ['PATCH']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
} 