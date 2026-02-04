import type { NextApiRequest, NextApiResponse } from 'next';
import matchprodb from '../../server/lib/dt';
import { CompanyInfo } from '../../types';

const script_company = `SELECT * FROM matchprodb.company_info`;


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CompanyInfo[] | { error: string }>) {
    if (req.method === 'GET') {
        const [rows_company] = await matchprodb.query<any[]>(script_company);
        const company  = rows_company.map(company => { 
            return { 
                id: company.id,
                name: company.name,
                department: company.department,
                size: company.size,
                industry: company.industry,
                founded: company.founded,
                description: company.description,
                culture: company.culture,
                website: company.website
            }
        });
        res.status(200).json(company as CompanyInfo[]);
    }
  }