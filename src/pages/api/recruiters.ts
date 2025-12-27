import type { NextApiRequest, NextApiResponse } from 'next';
import matchprodb from '../../server/lib/dt';
const DEFAULT_AVATAR = '/placeholder-user.jpg';

const script_recruiter = `SELECT * FROM matchprodb.recruiters`;
const script_education = `SELECT * FROM matchprodb.education_recruiter`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const [rows_recruiter] = await matchprodb.query<any[]>(script_recruiter);
        const [rows_education] = await matchprodb.query<any[]>(script_education);




        // Build education index by user_id for O(1) lookup
        const educationMap = new Map<number, any[]>();
        for (const edu of rows_education) {
            if (!educationMap.has(edu.user_id)) educationMap.set(edu.user_id, []);
            educationMap.get(edu.user_id)!.push({
                degree: edu.degree,
                school: edu.school,
                year: edu.year,
                gpa: edu.gpa
            });
        }

        // Helper to safely parse JSON
        const parseSafeJSON = (jsonStr: string, fallback: any = []) => {
            try {
                return jsonStr ? JSON.parse(jsonStr) : fallback;
            } catch (error) {
                console.warn('JSON parse error:', error);
                return fallback;
            }
        };

        // Map recruiters with single pass using indexed education
        const recruiters = rows_recruiter.map(recruiter => ({
            id: recruiter.id,
            email: recruiter.email,
            password: recruiter.password,
            name: recruiter.name,
            avatar: recruiter.avatar || DEFAULT_AVATAR,
            createdAt: recruiter.createdAt,
            bio: recruiter.bio,
            role: "recruiter",
            location: recruiter.location,
            phone: recruiter.phone,
            education: educationMap.get(recruiter.id) || [],
            company: recruiter.company,
            industry: recruiter.industry,
            companySizeMin: recruiter.companySizeMin,
            companySizeMax: recruiter.companySizeMax,
            address: recruiter.address,
            foundedYear: recruiter.foundedYear,
            companyDescription: recruiter.companyDescription,
            employerRole: recruiter.employerRole,
            requirements: parseSafeJSON(recruiter.requirements, []),
            companyTypes: parseSafeJSON(recruiter.companyTypes, []),
            companyLocation: recruiter.companyLocation
        }));

        res.status(200).json(recruiters);
    }
}