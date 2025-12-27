// src/pages/api/jobs.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import matchprodb from '../../server/lib/dt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const {
        title, company, location, experience, description, recruiterID
      } = req.body;

      console.log('Received job data for searching:', req.body);


      const [result] = await matchprodb.query<any>(
        `UPDATE jobs
         SET recruiterID = ?
         WHERE title = ? 
           AND company = ? 
           AND location = ? 
           AND experience = ? 
           AND description = ?;`,
         [
          recruiterID, title, company, location, experience, description, 
         ]
      );

      console.log('Job inserted successfully:', result);
      return res.status(201).json({ message: 'Job created successfully', id: (result as any).insertId });
    } catch (error) {
      console.error('Error inserting job:', error);
      return res.status(500).json({ error: 'Failed to create job', details: error.message });
    }
  }

  if (req.method === 'GET') {
    try {
      const [rows_jobs] = await matchprodb.query<any[]>('SELECT * FROM jobs');
      const [rows_company_info] = await matchprodb.query<any[]>('SELECT * FROM company_info');
      
      // Group by client ID
      const jobsMap: Record<number, any> = {};

      for (const job of rows_jobs) {
        const jobID = job.id

        // Safely parse JSON strings with error handling
        let requirements = [];
        let benefits = [];
        let skills = [];


        try {
          requirements = job.requirements ? JSON.parse(job.requirements) : [];
      } catch (error) {
          console.warn(`Failed to parse requirements for a job "${job.title}":`, error);
          requirements = [];
      }
      
      try {
        benefits = job.benefits ? JSON.parse(job.benefits) : [];
      } catch (error) {
          console.warn(`Failed to parse benefits for a job "${job.title}":`, error);
          benefits = [];
      }

      try {
        skills = job.skills ? JSON.parse(job.skills) : [];
      } catch (error) {
          console.warn(`Failed to parse skills for a job "${job.title}":`, error);
          skills = [];
      }

        if(!jobsMap[jobID]) { 
          jobsMap[jobID]= {
            id: jobID,
            recruiterID: job.recruiterID,
            title: job.title,
            company: job.company,
            department: job.department,
            location: job.location,
            job_type: job.job_type,
            createdAt: job.createdAt instanceof Date ? job.createdAt.toISOString().split("T")[0] : String(job.createdAt).split("T")[0],
            experience: Number(job.experience),
            salary: {min: Number(job.salaryMin), max: Number(job.salaryMax)},
            description: job.description,
            requirements: requirements,
            responsibilities: [],
            benefits: benefits,
            skills: skills,
            companyInfo: {},
            applicants: job.applicants,
            views: job.views,
            shortlisted: job.shortlisted,
            interviewed: job.interviewed,
            status: job.status
          }
        }
      }

      // 4. Enrich with work_experience
      for (const company_info of rows_company_info) {
        const company_name = company_info.name;
        for (const job of rows_jobs) {
          if(job.company === company_name) {
            const jobID = job.id;
            jobsMap[jobID].companyInfo = {
              name: company_info.name,
              size: company_info.size,
              industry: company_info.industry,
              founded: company_info.founded instanceof Date ? company_info.founded.toISOString().split("T")[0] : String(company_info.founded).split("T")[0],
              description: company_info.description,
              culture: company_info.culture,
              website: company_info.website
            }
          }
        }
      } 

      res.status(200).json(Object.values(jobsMap));
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

