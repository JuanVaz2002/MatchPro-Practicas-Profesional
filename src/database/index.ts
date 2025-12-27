import {
    Candidate, 
    Recruiter,
    CandidateDatabase,
    AIAnalysis,
    LinkedInProfiles,
    HiredApplication,
    Client,
    Referral,
    Job,
    Application,
    RejectedApplication,
} from "../types";
// ENUM('job-boards', 'company-career-page', 'employee-referral', 'recruitment-events', 'professional-conferences', 'social-media', 'coding-communities', 'university-partnerships', 'recruitment-agencies', 'direct-outreach', 'other')
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useJobs() {
  const { data: alljobs = [], error, isLoading, mutate: mutateJobs } = useSWR<Job[]>("/api/jobs", fetcher);
  // if (isLoading) return <p className="text-center text-gray-500">Loading applications...</p>;
  // if (error) return <p className="text-center text-red-500">Failed to load applications.</p>;
  // if (!data) return <p className="text-center text-gray-500">No applications found.</p>;

  return { alljobs, mutateJobs };
}

export function useClients() {
    const { data: clients = [], error, isLoading, mutate: mutateClients } = useSWR<Client[]>("/api/client", fetcher);
    
    return { clients, mutateClients };
}

export function useCandidates() {
    const { data: candidates = [], error, isLoading, mutate: mutateCandidates } = useSWR<Candidate[]>("/api/candidate", fetcher);
    return { candidates, mutateCandidates };
}

export function useRecruiters() {
  const { data: recruiters = [], error, isLoading, mutate: mutateRecruiters } = useSWR<Recruiter[]>("/api/recruiters", fetcher);
  return { recruiters, mutateRecruiters };
}

export function useAIAnalysis() {
  const { data: aiAnalysis = [], error, isLoading, mutate: mutateAIAnalysis } = useSWR<AIAnalysis[]>("/api/aiAnalysis", fetcher);
  return { aiAnalysis, mutateAIAnalysis };
}

export function useReferrals() {
  const { data: referrals = [], error, isLoading, mutate: mutateReferrals } = useSWR<Referral[]>("/api/referral", fetcher);
  return { referrals, mutateReferrals };
}

export function useApplications() {
  const { data: allApplications = [], error, isLoading, mutate: mutateApplication } = useSWR<Application[]>("/api/applications", fetcher);
  // if (isLoading) return <p className="text-center text-gray-500">Loading applications...</p>;
  // if (error) return <p className="text-center text-red-500">Failed to load applications.</p>;
  // if (!data) return <p className="text-center text-gray-500">No applications found.</p>;

  return { allApplications, mutateApplication };
}

export function useRejectedApplications() {
  const { data: allRejectedApplications = [], error, isLoading, mutate: mutateRejectedApplication } = useSWR<RejectedApplication[]>("/api/rejectedApplications", fetcher);
  // if (isLoading) return <p className="text-center text-gray-500">Loading applications...</p>;
  // if (error) return <p className="text-center text-red-500">Failed to load applications.</p>;
  // if (!data) return <p className="text-center text-gray-500">No applications found.</p>;

  return { allRejectedApplications, mutateRejectedApplication };
}

export function useHiredApplications() {
  const { data: allHiredApplications = [], error, isLoading, mutate: mutateHiredApplication } = useSWR<HiredApplication[]>("/api/hiredApplications", fetcher);
  // if (isLoading) return <p className="text-center text-gray-500">Loading applications...</p>;
  // if (error) return <p className="text-center text-red-500">Failed to load applications.</p>;
  // if (!data) return <p className="text-center text-gray-500">No applications found.</p>;

  return { allHiredApplications, mutateHiredApplication };
}

export function useJobsRecruiter(recruiterID: number) {
  const { alljobs } = useJobs();

  const jobs = alljobs.filter(d => d.recruiterID === recruiterID) ?? [];
  
  return jobs;
}

export function useUsers() {
  const { candidates } = useCandidates();
  const { recruiters } = useRecruiters();


  const users: { candidates: Candidate[]; recruiters: Recruiter[]; } = {
    recruiters: [...recruiters],
    candidates: [...candidates]
  };
  
  return users;
  
}



export function useAppliedJobsCandidate(candidateID: number) {
  const { allApplications } = useApplications();
  const { alljobs } = useJobs();
  const { candidates } = useCandidates();
  // if (isLoading) return <p className="text-center text-gray-500">Loading applications...</p>;
  // if (error) return <p className="text-center text-red-500">Failed to load applications.</p>;
  // if (!data) return <p className="text-center text-gray-500">No applications found.</p>;
  const filteredApplications = allApplications.filter(app => app.candidateId === candidateID);
  const candidateAppliedJobs = alljobs.filter(job => filteredApplications.some(application => job.id === application.jobId));

  return { candidateAppliedJobs };
}

export function useRecentApplication(candidateID: number) {
  const {allApplications } = useApplications();
  
  const recentApplications = allApplications.find(app => app.candidateId === candidateID );
  

  return recentApplications;
}




export function useCandidatesDatabase(recruiterID: number) {
  const { data } = useSWR<CandidateDatabase[]>("/api/candidateDatabase", fetcher);
  const { candidates } = useCandidates();
  const filtered_data = data?.filter(d => d.recruiterID === recruiterID);
  const candidateIds = Object.values(filtered_data ?? []).map(c => c.candidateID);

  const candidatesDatabase = candidates.filter(can => candidateIds.includes(can.id));

  return {
    candidatesDatabase
  };
}


export function useJobsCandidate(candidateID: number) {
  const { data: candidateDB } = useSWR<CandidateDatabase[]>("/api/candidateDatabase", fetcher);
  const { data: jobs } = useSWR<Job[]>("/api/jobs", fetcher);
  
  const filtered_candidateDB = candidateDB?.filter(d => d.candidateID === candidateID) ?? [];
  
  let recruiterIDList: number[] = [];

  for (const dato of filtered_candidateDB) {
    recruiterIDList.push(dato.recruiterID);
  }
  
  let activeJobs: Job[] = [];
  
  for (const recruiterID of recruiterIDList) {
    const filtered_jobs = jobs?.filter(j => j.recruiterID === recruiterID) ?? [];
    for (const job of filtered_jobs) {
      activeJobs.push(job);
    }
  }
  return activeJobs;
}