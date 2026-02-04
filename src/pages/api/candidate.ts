import type { NextApiRequest, NextApiResponse } from 'next';
import matchprodb from '../../server/lib/dt';
const DEFAULT_AVATAR = '/placeholder-user.jpg';
import { Candidate, Certification, Education, JobPreferences, WorkExperience } from '../../types';
import { start } from 'repl';

const script_candidate = `SELECT * FROM matchprodb.candidates`;
const script_job_preferences = `SELECT * FROM matchprodb.job_preferences`;
const script_education = `SELECT * FROM matchprodb.education_candidate`;
const script_work_experience = `SELECT * FROM matchprodb.work_experience`;
const script_certifications = `SELECT * FROM matchprodb.certifications`;
const script_ai_analysis = `SELECT * FROM matchprodb.ai_analysis`;



// Helper functions for safer data processing
function parseSafeJSON(jsonStr: string, fallback: any = []) {
    try {
        return jsonStr ? JSON.parse(jsonStr) : fallback;
    } catch (error) {
        console.warn('JSON parse error:', error);
        return fallback;
    }
}

function parseLocation(locationStr: string): string {
    if (!locationStr) return '';
    try {
        // Try to parse as JSON first
        const parsed = JSON.parse(locationStr);
        if (Array.isArray(parsed)) {
            return parsed.join(', ');
        }
        return String(parsed);
    } catch (error) {
        // If JSON parsing fails, return as-is (it's already a plain string)
        return locationStr;
    }
}

function formatDate(date: any): string {
    return date instanceof Date ? date.toISOString().split('T')[0] : String(date).split('T')[0];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const [rows_candidate] = await matchprodb.query<any[]>(script_candidate);
        const [rows_job_preferences] = await matchprodb.query<any[]>(script_job_preferences);
        const [rows_education] = await matchprodb.query<any[]>(script_education);
        const [rows_work_experience] = await matchprodb.query<any[]>(script_work_experience);
        const [rows_certifications] = await matchprodb.query<any[]>(script_certifications);
        const [rows_ai_analysis] = await matchprodb.query<any[]>(script_ai_analysis);
        
        // Build indexed lookups for O(1) access - prevents O(n²) nested loops
        const jobPrefsMap = new Map();
        const educationMap = new Map<number, any[]>();
        const workExpMap = new Map<number, any[]>();
        const certsMap = new Map<number, any[]>();
        const aiMap = new Map();

        // Index data in one pass each
        for (const prefs of rows_job_preferences) jobPrefsMap.set(prefs.candidate_id, prefs);
        for (const edu of rows_education) {
            if (!educationMap.has(edu.user_id)) educationMap.set(edu.user_id, []);
            const eduArray = educationMap.get(edu.user_id);
            if (eduArray) eduArray.push(edu);
        }
        for (const work of rows_work_experience) {
            if (!workExpMap.has(work.candidate_id)) workExpMap.set(work.candidate_id, []);
            const workArray = workExpMap.get(work.candidate_id);
            if (workArray) workArray.push(work);
        }
        for (const cert of rows_certifications) {
            if (!certsMap.has(cert.candidate_id)) certsMap.set(cert.candidate_id, []);
            const certArray = certsMap.get(cert.candidate_id)
            if (certArray) certArray.push(cert);
        }
        for (const ai of rows_ai_analysis) aiMap.set(ai.candidate_id, ai);

        // Build candidates with single pass using indexed data
        const candidates = rows_candidate.map(candidate => {
            const candidateId = candidate.id;
            const jobPrefs = jobPrefsMap.get(candidateId);
            const education = educationMap.get(candidateId) || [];
            const workExp = workExpMap.get(candidateId) || [];
            const certs = certsMap.get(candidateId) || [];
            const aiData = aiMap.get(candidateId);

            return {
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
                education: education.map(edu => ({
                    degree: edu.degree,
                    school: edu.school,
                    year: edu.year,
                    gpa: edu.gpa
                })),
                company: candidate.company,
                industry: candidate.industry,
                skills: parseSafeJSON(candidate.skills, []),
                experience: candidate.experience,
                cvUploaded: candidate.cvUploaded,
                professionalTitle: candidate.professionalTitle,
                matchScore: candidate.matchScore,
                availability: candidate.availability,
                recruitmentSource: candidate.recruitmentSource,
                jobPreferences: jobPrefs ? {
                    salary: { min: jobPrefs.salaryMin, max: jobPrefs.salaryMax },
                    location: parseLocation(jobPrefs.location),
                    jobType: jobPrefs.jobType
                } : {},
                workExperience: workExp.map(work => ({
                    title: work.title,
                    company: work.company,
                    location: work.location,
                    startDate: formatDate(work.startDate),
                    endDate: work.endDate ? formatDate(work.endDate) : "Present",
                    description: work.description,
                    jobType: work.jobType || "full-time"
                })),
                certifications: certs.map(cert => ({
                    title: cert.title,
                    issuer: cert.issuer,
                    year: cert.year,
                    credentialId: cert.credentialId
                })),
                aiAnalysis: aiData ? {
                    strengths: parseSafeJSON(aiData.strengths, []),
                    concerns: parseSafeJSON(aiData.concerns, []),
                    recommendation: aiData.recommendation || '',
                    matchScore: aiData.matchScore || 0,
                    resume: {
                        cv_link: aiData.cv_link || '',
                        cv_id: aiData.cv_id || '',
                        uploadedAt: aiData.uploadedAt || ''
                    }
                } : undefined 
            };
        });
        
        // console.log(candidates[0].aiAnalysis.resume?.cv_id);

        res.status(200).json(candidates);
    }
    else if (req.method == 'PATCH') {
        const { completeProfile } = req.body;

        if (!completeProfile) {
            return res.status(404).json({ error: 'completeProfile is required' });
        }

        const basicInfo: Partial<Candidate> = completeProfile.basicInfo;
        const candidate_id = basicInfo.id;
        const education: Education[] = completeProfile.education;
        const jobPreferences: JobPreferences = completeProfile.jobPreferences;
        const workExperience: WorkExperience[] = completeProfile.workExperience;
        const certifications: Certification[] = completeProfile.certifications;

        
        const skillsJSON = Array.isArray(basicInfo.skills) ? JSON.stringify(basicInfo.skills) : basicInfo.skills;
        const jobTypeJSON = Array.isArray(jobPreferences.jobType) ? JSON.stringify(jobPreferences.jobType) : jobPreferences.jobType;
        
        await matchprodb.query<any>(
            `UPDATE candidates 
             SET
                name=?,
                professionalTitle=?,
                bio=?,
                location=?,
                company=?,
                industry=?,
                skills=?,
                experience=?,
                availability=?,
             WHERE id=? AND phone=? AND email=?;`,
            [
                basicInfo.name,
                basicInfo.professionalTitle,
                basicInfo.bio,
                basicInfo.location,
                basicInfo.company,
                basicInfo.industry,
                skillsJSON,
                basicInfo.experience,
                basicInfo.availability,
                candidate_id
            ]
        );
          
        education.forEach(edu => {
            if (edu.degree !== '' && edu.school !== '' && edu.gpa >= 2.0) {

                matchprodb.query<any>(
                `INSERT INTO education_candidate (user_id, degree, school, year, gpa)
                VALUES (?, ?, ?, ?, ?);`,
                [
                    candidate_id,
                    edu.degree,
                    edu.school,
                    edu.year,
                    edu.gpa
                ]
                );
            }
        });
        
       
        const [insertJobPreference] = await matchprodb.query<any>(
            `INSERT INTO job_preferences (candidate_id, salaryMin, salaryMax, location, jobType)
                VALUES (?, ?, ?, ?, ?);`,
            [
                candidate_id,
                jobPreferences.salary.min,
                jobPreferences.salary.max,
                jobPreferences.location,
                jobTypeJSON
            ]
        );

        workExperience.forEach(work => {

            if (work.title !== '' && work.company !== '' && work.location !== '' && work.startDate !== '' && work.description !== '') { 
                let endDate: string | null = null;
                if (work.endDate !== '')
                    endDate = work.endDate;

                matchprodb.query<any>(
                    `INSERT INTO work_experience (candidate_id, title, company, location, startDate, endDate, description)
                        VALUES (?, ?, ?, ?, ?, ?, ?);`,
                    [
                        candidate_id,
                        work.title,
                        work.company,
                        work.location,
                        work.startDate,
                        endDate,
                        work.description
                    ]
                );
            }
        })

        certifications.forEach(cert => {
            if (cert.title !== '' && cert.issuer !== '' && cert.credentialId !== '') { 
                matchprodb.query<any>(
                    `INSERT INTO certifications (candidate_id, title, issuer, year, credentialId)
                        VALUES (?, ?, ?, ?, ?, ?, ?);`,
                    [
                        candidate_id,
                        cert.title,
                        cert.issuer,
                        cert.year,
                        cert.credentialId,
                    ]
                );
            }
        })
    }
    else {
        res.setHeader('Allow', ['GET', 'PATCH']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}