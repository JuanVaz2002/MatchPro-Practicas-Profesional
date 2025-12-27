import {
    type RecruitmentAnalytics,
    type ChannelMetric,
    type ChannelQuality,
    type RecruitmentSource,
    RECRUITMENT_SOURCES,
    type Candidate,
    type Application,
    type RejectedApplication,
    type HiredApplication,
    type Job,
  } from "../types"
  
  /**
   * Created new utility functions to calculate real recruitment analytics
   * from database data instead of using mock data
   */
  
  /**
   * Calculate the average hiring time in days for a given year
   */
  export function calculateAverageHiringTime(
    applications: Application[],
    rejectedApplications: RejectedApplication[],
    hiredApplications: HiredApplication[],
    year: number,
  ): number {
    const yearStart = new Date(year, 0, 1)
    const yearEnd = new Date(year, 11, 31)
  
    const filteredApps = applications.filter((app) => {
      const appliedDate = new Date(app.appliedAt)
      return appliedDate >= yearStart && appliedDate <= yearEnd
    })
    // console.log(filteredApps);
    if (filteredApps.length === 0) return 0
  
    // Calculate average days between application and hire
    const totalDays = filteredApps.reduce((sum, app) => {
      if (app.status === "hired" && hiredApplications) {
        const hiredAppArray = Array.isArray(hiredApplications) ? hiredApplications : []
      
        const hiredApplication = hiredAppArray.find(
          hiredApp => hiredApp.candidateId === app.candidateId
        );
      
        const appliedDate = new Date(app.appliedAt);
        const estimatedCurrentDate = new Date(hiredApplication?.responsedAt ?? Date.now());
      
        const diffMs = estimatedCurrentDate.getTime() - appliedDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        sum += diffDays;
      }
      return sum;
    }, 0)

    return Math.round(totalDays / filteredApps.length)
  }
  
  /**
   * Calculate position statistics for the given year
   */
  export function calculatePositionStats(jobs: Job[], year: number) {
    const yearStart = new Date(year, 0, 1)
    const yearEnd = new Date(year, 11, 31)
  
    const openPositions = jobs.filter(
      (job) => job.status === "active" && new Date(job.createdAt) >= yearStart && new Date(job.createdAt) <= yearEnd,
    ).length
  
    const closedPositions = jobs.filter(
      (job) => job.status === "closed" && new Date(job.createdAt) >= yearStart && new Date(job.createdAt) <= yearEnd,
    ).length
  
    return { openPositions, closedPositions }
  }
  
  /**
   * Calculate candidate volume metrics for the given year
   */
  export function calculateCandidateMetrics(
    applications: Application[],
    rejectedApplications: RejectedApplication[],
    year: number,
  ) {
    const yearStart = new Date(year, 0, 1)
    const yearEnd = new Date(year, 11, 31)
  
    const totalApplications = applications.filter((app) => {
      const appliedDate = new Date(app.appliedAt)
      return appliedDate >= yearStart && appliedDate <= yearEnd
    }).length
  
    const totalReviewed = applications.filter(
      (app) => app.reviewed && new Date(app.appliedAt) >= yearStart && new Date(app.appliedAt) <= yearEnd,
    ).length
  
    const totalInterviewed = applications.filter(
      (app) => app.status.includes("interview") && new Date(app.appliedAt) >= yearStart && new Date(app.appliedAt) <= yearEnd,
    ).length
  
    return { totalApplications, totalReviewed, totalInterviewed }
  }
  
  /**
   * Calculate metrics for each recruitment channel
   */
  export function calculateChannelMetrics(
    applications: Application[],
    candidates: Candidate[],
    jobs: Job[],
    year: number,
  ): ChannelMetric[] {
    const yearStart = new Date(year, 0, 1)
    const yearEnd = new Date(year, 11, 31)
  
    const channelMetricsMap = new Map<string, ChannelMetric>()
  
    // Initialize all channels
    RECRUITMENT_SOURCES.forEach((source) => {
      channelMetricsMap.set(source.value, {
        channelName: source.value,
        totalApplications: 0,
        totalReviewed: 0,
        totalInterviewed: 0,
        totalHired: 0,
        totalCost: 0,
      })
    })
  
    // Process applications
    applications.forEach((app) => {
      const appliedDate = new Date(app.appliedAt)
      if (appliedDate < yearStart || appliedDate > yearEnd) return
  
      const candidate = candidates.find((c) => c.id === app.candidateId)
      if (!candidate || !candidate.recruitmentSource) return
  
      const source = candidate.recruitmentSource as RecruitmentSource
      const metric = channelMetricsMap.get(source)
  
      if (metric?.channelName === source) {
        metric.totalApplications += 1;
  
        if (app.reviewed) {
          metric.totalReviewed += 1;
        }
  
        if (app.status === "hired") {
          metric.totalHired += 1;
          metric.totalInterviewed += 1;
        } else if (app.status.includes("interview")) {
          metric.totalInterviewed += 1;
        }
  
        metric.totalCost += estimateChannelCost(source, app.status === "hired");
      }
    })

    return Array.from(channelMetricsMap.values()).filter((m) => m.totalApplications > 0)
  }
  
  /**
   * Estimate cost for recruitment channel
   */
  function estimateChannelCost(channel: RecruitmentSource, hired: boolean): number {
    const baseCosts: Record<RecruitmentSource, number> = {
      "job-boards": hired ? 400 : 100,
      "employee-referral": hired ? 2000 : 500,
      "linkedin": hired ? 600 : 150,
      "recruitment-agencies": hired ? 5000 : 1500,
      "company-career-page": hired ? 100 : 20,
      "recruitment-events": hired ? 800 : 300,
      "professional-conferences": hired ? 1200 : 500,
      "social-media": hired ? 200 : 50,
      "coding-communities": hired ? 150 : 40,
      "university-partnerships": hired ? 600 : 200,
      "direct-outreach": hired ? 400 : 150,
      "other": hired ? 300 : 100,
    }
  
    return baseCosts[channel] || 100
  }
  
  /**
   * Calculate quality metrics for each recruitment channel
   */
  export function calculateChannelQuality(
    applications: Application[],
    candidates: Candidate[],
    year: number,
  ): ChannelQuality[] {
    const yearStart = new Date(year, 0, 1)
    const yearEnd = new Date(year, 11, 31)
  
    const qualityMap = new Map<string, ChannelQuality>()
  
    // Initialize all channels
    RECRUITMENT_SOURCES.forEach((source) => {
      qualityMap.set(source.value, {
        channelName: source.value,
        hireRate: 0,
        avgRetentionMonths: 0,
        avgPerformanceScore: 0,
      })
    })
  
    // Calculate metrics per channel
    const channelStats = new Map<
      string,
      {
        totalCandidates: number
        hiredCandidates: number
        performanceScores: number[]
        retentionMonths: number[]
      }
    >()
  
    applications
      .filter((app) => {
        const appliedDate = new Date(app.appliedAt)
        return appliedDate >= yearStart && appliedDate <= yearEnd
      })
      .forEach((app) => {
        const candidate = candidates.find((c) => c.id === app.candidateId)
        if (!candidate || !candidate.recruitmentSource) return
  
        const source = candidate.recruitmentSource as RecruitmentSource
        if (!channelStats.has(source)) {
          channelStats.set(source, {
            totalCandidates: 0,
            hiredCandidates: 0,
            performanceScores: [],
            retentionMonths: [],
          })
        }
  
        const stats = channelStats.get(source)!
        stats.totalCandidates += 1
  
        if (app.status === "hired") {
          stats.hiredCandidates += 1
        }
  
        if (candidate.matchScore) {
          stats.performanceScores.push(candidate.matchScore)
        }
  
        stats.retentionMonths.push(estimateRetentionMonths(candidate))
      })
  
    // Calculate quality metrics
    channelStats.forEach((stats, channel) => {
      const hireRate = stats.totalCandidates > 0 ? (stats.hiredCandidates / stats.totalCandidates) * 100 : 0
  
      const avgPerformanceScore =
        stats.performanceScores.length > 0
          ? stats.performanceScores.reduce((a, b) => a + b, 0) / stats.performanceScores.length
          : 0
      

      const avgRetentionMonths =
        stats.retentionMonths.length > 0
          ? Math.round(stats.retentionMonths.reduce((a, b) => a + b, 0) / stats.retentionMonths.length)
          : 0

      const quality = qualityMap.get(channel)
      if (quality) {
        quality.hireRate = Math.round(hireRate * 10) / 10
        quality.avgPerformanceScore = (Math.round(avgPerformanceScore * 10) / 10)  * 5 / 100
        quality.avgRetentionMonths = avgRetentionMonths
      }
    })
  
    return Array.from(qualityMap.values()).filter((q) => q.hireRate > 0)
  }
  
  /**
   * Estimate retention months based on candidate data
   */
  function estimateRetentionMonths(candidate: Candidate): number {
    // Base calculation: use match score and experience as indicators
    const baseRetention = 12 // 12 months baseline
    const matchScoreFactor = (candidate.matchScore / 100) * 6 // Up to 6 additional months
    const experienceFactor = Math.min(candidate.experience / 10, 1) * 6 // Up to 6 additional months
  
    return Math.round(baseRetention + matchScoreFactor + experienceFactor)
  }
  
  /**
   * Main function to get recruitment analytics from real database data
   */
  export function getRecruitmentAnalytics(
    applications: Application[],
    rejectedApplications: RejectedApplication[],
    hiredApplications: HiredApplication[],
    candidates: Candidate[],
    jobs: Job[],
    year: number,
  ): RecruitmentAnalytics {
    const avgHiringTime = calculateAverageHiringTime(applications, rejectedApplications, hiredApplications, year)
  
    const { openPositions, closedPositions } = calculatePositionStats(jobs, year)
  
    const { totalApplications, totalReviewed, totalInterviewed } = calculateCandidateMetrics(
      applications,
      rejectedApplications,
      year,
    )
  
    const channelMetrics = calculateChannelMetrics(applications, candidates, jobs, year)
    const channelQuality = calculateChannelQuality(applications, candidates, year)
  
    return {
      avgHiringTime,
      openPositions,
      closedPositions,
      totalApplications,
      totalReviewed,
      totalInterviewed,
      channelMetrics,
      channelQuality,
    }
  }
  