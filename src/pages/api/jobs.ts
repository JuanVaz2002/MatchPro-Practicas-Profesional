// src/pages/api/jobs.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import matchprodb from '../../server/lib/dt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { title, company, department, location, experience, description, recruiterID } = req.body;

      const default_job_type = "full-time";
      const default_salaryMin = 5000;
      const default_salaryMax = 10000;
      const default_requirements = "[\"\"]"; 
      const default_benefits = "[\"\"]";
      const default_skills = "[\"\"]";
      const default_steps = "[\"\"]";
      const views = 0;
      const default_status = "active";


      console.log('Received job data for posting:', req.body);

      const addedAt = new Date().toISOString().split('T')[0];
      const [result] = await matchprodb.query<any>(
        `INSERT INTO jobs (recruiterID, title, company, department, location, experience, description, createdAt, 
                           job_type, salaryMin, salaryMax, requirements, benefits, skills, steps, views, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
         [
          recruiterID, title, company, department, location, Number(experience), description, addedAt, default_job_type, 
          default_salaryMin, default_salaryMax, default_requirements, default_benefits, default_skills, default_steps, views, default_status
         ]
      );

      console.log('Job inserted successfully:', result);
      return res.status(201).json({ message: 'Job created successfully', id: (result as any).insertId });
    } catch (error) {
      console.error('Error inserting job:', error);
      return res.status(500).json({ error: 'Failed to create job', details: error.message });
    }
  }

  else if (req.method === 'GET') {
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
        let steps = [];

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

      try {
        steps = job.steps ? JSON.parse(job.steps) : [];
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
            steps: steps,
            companyInfo: {},
            applicants: job.applicants,
            views: job.views,
            shortlisted: job.shortlisted,
            interviewed: job.interviewed,
            status: job.status
          }
        }
      }

      // Build company info index for O(1) lookup instead of O(n²) nested loop
      const companyInfoMap = new Map();
      for (const company of rows_company_info) {
        companyInfoMap.set(company.name, {
          name: company.name,
          size: company.size,
          industry: company.industry,
          founded: company.founded instanceof Date ? company.founded.toISOString().split("T")[0] : String(company.founded).split("T")[0],
          description: company.description,
          culture: company.culture,
          website: company.website
        });
      }
      
      // Enrich jobs with indexed company info in single pass
      for (const jobID of Object.keys(jobsMap)) {
        const company_name = jobsMap[jobID].company;
        jobsMap[jobID].companyInfo = companyInfoMap.get(company_name) || {};
      } 

      res.status(202).json(Object.values(jobsMap));
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  } 
  
  else if (req.method === 'PATCH') {
    try {

      const { title, company, department, location, experience, description, 
              workType, salaryMin, salaryMax, requirements, benefits, skills, steps,
              jobId, status } = req.body;


     
      
      console.log('Received job data for posting:', req.body);


      const requirementsJson = Array.isArray(requirements) ? JSON.stringify(requirements) : requirements;
      const benefitsJson = Array.isArray(benefits) ? JSON.stringify(benefits) : benefits;
      const skillsJson = Array.isArray(skills) ? JSON.stringify(skills) : skills;
      const stepsJson = Array.isArray(steps) ? JSON.stringify(steps) : steps;


      const [result] = await matchprodb.query<any>(
        `UPDATE jobs 
        SET title = ?, 
            company = ?, 
            department = ?, 
            location = ?, 
            experience = ?, 
            description = ?, 
            job_type = ?, 
            salaryMin = ?, 
            salaryMax = ?, 
            requirements = ?, 
            benefits = ?, 
            skills = ?,
            steps = ?,
            status = ?
        WHERE id = ?`,
        [
          title, company, department, location, Number(experience), description, workType, 
          Number(salaryMin), Number(salaryMax), requirementsJson, benefitsJson, skillsJson, stepsJson, status, jobId
        ]
      );
      console.log('Job inserted successfully:', result);
      return res.status(201).json({ message: 'Job created successfully', id: (result as any).insertId });

      

      
    } catch (error) {
      console.error('Error inserting job:', error);
      return res.status(500).json({ error: 'Failed to create job', details: error.message });
    }
  
  }  
  else {
    res.setHeader('Allow', ['GET', 'POST', 'PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

