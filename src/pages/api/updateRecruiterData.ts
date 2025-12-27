import type { NextApiRequest, NextApiResponse } from 'next';
import matchprodb from '../../server/lib/dt';

interface ProfileData {
  id: number;
  email: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  phone?: string;
  role?: 'recruiter';

  // recruiter-specific
  company?: string;
  industry?: string;
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
      const formData: ProfileData = (req.body && (req.body.formData ?? req.body)) as any;
      console.log('Received Recruiter data for update:', formData);

      if (!formData || !formData.email || !formData.id) {
        return res.status(400).json({ error: 'Missing required recruiter id or email' });
      }

      const [findRecruiterResult] = await matchprodb.query<any>(
        `SELECT * FROM matchprodb.recruiters WHERE id = ?`,
        [formData.id]
      );

      if (!Array.isArray(findRecruiterResult) || findRecruiterResult.length === 0) {
        return res.status(404).json({ error: 'Recruiter not found' });
      }

      const [updateRecruiterResult] = await matchprodb.query<any>(
        `UPDATE recruiters SET
           name = ?,
           email = ?,
           phone = ?,
           location = ?,
           bio = ?,
           company = ?,
           industry = ?,
           companySizeMin = ?,
           companySizeMax = ?,
           address = ?,
           foundedYear = ?,
           company = ?,
           companyDescription = ?,
           employerRole = ?,
           requirements = ?,
           companyTypes = ?,
           companyLocation = ?
         WHERE id = ?`,
        [
          formData.name,
          formData.email,
          formData.phone ?? null,
          formData.location ?? null,
          formData.bio ?? null,
          formData.company ?? null,
          formData.industry ?? null,
          formData.companySizeMin ?? null,
          formData.companySizeMax ?? null,
          formData.address ?? null,
          formData.foundedYear ?? null,
          formData.companyName ?? null,
          formData.companyDescription ?? null,
          formData.employerRole ?? null,
          JSON.stringify(formData.requirements ?? []),
          JSON.stringify(formData.companyTypes ?? []),
          formData.companyLocation ?? null,
          formData.id,
        ]
      );

      if (!updateRecruiterResult || updateRecruiterResult.affectedRows === 0) {
        return res.status(500).json({ error: 'Failed to update recruiter data', updateRecruiterResult });
      }

      return res.status(202).json({ message: 'Recruiter data updated successfully' });
    } catch (error) {
      console.error('Error updating recruiter data:', error);
      const msg = (error as any)?.message ?? String(error);
      res.status(500).json({ error: 'Internal Server Error', message: msg });
    }
  }

  res.setHeader('Allow', ['PATCH']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
