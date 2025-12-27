
import type { NextApiRequest, NextApiResponse } from 'next';
import matchprodb from '../../server/lib/dt';
const DEFAULT_AVATAR = '/placeholder-user.jpg';

// Referrals
const script_referral = `SELECT * FROM matchprodb.referrals`;
const script_timeline = `SELECT * FROM matchprodb.timeline`;
const script_referrer = `SELECT * FROM matchprodb.referrer`;

// Candidates
const script_candidate = `SELECT * FROM matchprodb.candidates`;
const script_job_preferences = `SELECT * FROM matchprodb.job_preferences`;
const script_education = `SELECT * FROM matchprodb.education_candidate`;
const script_work_experience = `SELECT * FROM matchprodb.work_experience`;
const script_certifications = `SELECT * FROM matchprodb.certifications`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const [rows_candidate] = await matchprodb.query<any[]>(script_candidate);
        const [rows_job_preferences] = await matchprodb.query<any[]>(script_job_preferences);
        const [rows_education] = await matchprodb.query<any[]>(script_education);
        const [rows_work_experience] = await matchprodb.query<any[]>(script_work_experience);
        const [rows_certifications] = await matchprodb.query<any[]>(script_certifications);

        // Group by client ID
        const candidatesMap: Record<number, any> = {};

        for (const candidate of rows_candidate) {
            const candidateId = candidate.id;

            let skills = []
            try {
                skills = candidate.skills ? JSON.parse(candidate.skills) : [];
            } catch (error) {
                console.warn(`Failed to parse skills (${candidate.name}):`, error);
                skills = [];
            }

            if (!candidatesMap[candidateId]) {
                candidatesMap[candidateId] = {
                    id: candidate.id,
                    email: candidate.email,
                    password: candidate.password,
                    name: candidate.name,
                    avatar: candidate.avatar || DEFAULT_AVATAR,
                    createdAt: candidate.createdAt,
                    bio: candidate.bio,
                    role: "candidate",
                    location: candidate.location,
                    phone: candidate.phone,
                    education: [],
                    company: candidate.company,
                    industry: candidate.industry,
                    skills: skills,
                    experience: candidate.experience,
                    cvUploaded: candidate.cvUploaded,
                    professionalTitle: candidate.professionalTitle,
                    matchScore: candidate.matchScore,
                    availability: candidate.availability,
                    jobPreferences: {},
                    workExperience: [],
                    certifications: []
                };
            }

            // 2. Enrich with job_preferences
            for (const job_preferences of rows_job_preferences) {
                const candidate_id = job_preferences.candidate_id;
                if (candidatesMap[candidate_id]) {
                candidatesMap[candidate_id].jobPreferences = {
                    salary: { min: job_preferences.salaryMin, max: job_preferences.salaryMax },
                    location: (job_preferences.location).split(","),
                    jobType: job_preferences.jobType
                };
                }
            }
        
            // 3. Enrich with education
            for (const education of rows_education) {
                const candidate_id = education.user_id;
                if (candidatesMap[candidate_id]) {
                candidatesMap[candidate_id].education.push({
                    degree: education.degree,
                    school: education.school,
                    year: education.year,
                    gpa: education.gpa,
                });
                }
            }
            
            // 4. Enrich with work_experience
            for (const work_experience of rows_work_experience) {
                const candidate_id = work_experience.candidate_id;
                if (candidatesMap[candidate_id]) {
                candidatesMap[candidate_id].workExperience.push({
                    title: work_experience.title,
                    company: work_experience.company,
                    location: work_experience.location,
                    startDate: work_experience.startDate,
                    endDate: work_experience.endDate,
                    description: work_experience.description
                });
                }
            }
            
            // 5. Enrich with certifications
            for (const certification of rows_certifications) {
                const candidate_id = certification.candidate_id;
                if (candidatesMap[candidate_id]) {
                candidatesMap[candidate_id].certifications.push({
                    name: certification.name,
                    issuer: certification.issuer,
                    year: certification.year,
                    credential_id: certification.credential_id,
                });
                }
            }
        }

        const [rows_referral] = await matchprodb.query<any[]>(script_referral);
        const [rows_timeline] = await matchprodb.query<any[]>(script_timeline);
        const [rows_referrer] = await matchprodb.query<any[]>(script_referrer);
            
        // Group by referral ID
        const referralMap: Record<number, any> = {};

        for (const referral of rows_referral) {
            const referral_id = referral.id;
            if (!referralMap[referral_id]) {
                referralMap[referral_id] = {
                    id: referral.id,
                    candidate: candidatesMap[referral.candidate_id],  // 6. Enrich with candidates
                    referredDate: referral.referredDate,
                    status: referral.status,
                    jobTitle: referral.jobTitle,
                    referralBonus: referral.referralBonus,
                    notes: referral.notes,
                    referrer: {},
                    timeline: []
                };
            }
        }

        // 7. Enrich with timeline
        for (const timeline of rows_timeline) {
            const referral_id = timeline.referral_id;
            if (referralMap[referral_id]) {
                referralMap[referral_id].timeline.push({
                    event: timeline.event,
                    date: timeline.date,
                    status: timeline.status
                });
            }
        }

        // 8. Enrich with referrers
        for (const referrer of rows_referrer) {
            const referral_id = referrer.referral_id;
            if (referralMap[referral_id]) {
                referralMap[referral_id].referrer = {
                    name: referrer.event,
                    professionalTitle: referrer.professionalTitle,
                    company: referrer.company,
                    relationship: referrer.relationship
                };
            }
        }

        const referrals = Object.values(referralMap);
        res.status(200).json(referrals);
    }
    else if (req.method === 'POST') {
        try {
            const { candidateId, jobTitle, referralBonus, notes, referrer } = req.body;

      
            console.log('Received job data for posting:', req.body);
      
            const addedAt = new Date().toISOString().split('T')[0];
            const status = "under_review";
            const [result] = await matchprodb.query<any>(
              `INSERT INTO referrals (candidate_id, referredDate, status, jobTitle, referralBonus, notes)
               VALUES (?, ?, ?, ?, ?, ?);`,
               [
                candidateId, addedAt, status, jobTitle, referralBonus, notes
                ]
            );

            if (referrer.name !== "" && referrer.jobTitle !== "" && referrer.company !== "" && referrer.relationship !== "") {
                const [result_referrer] = await matchprodb.query<any>(
                    `INSERT INTO referrer (referral_id, name, professionalTitle, company, relationship)
                     VALUES (?, ?, ?, ?, ?);`,
                     [
                        (result as any).insertId, referrer.name, referrer.jobTitle, referrer.company, referrer.relationship
                     ]
                );
            }
      
            console.log('Job inserted successfully:', result);
            return res.status(201).json({ message: 'Job created successfully', id: (result as any).insertId });
          } catch (error) {
            console.error('Error inserting job:', error);
            return res.status(500).json({ error: 'Failed to create job', details: error.message });
          }

    }
}