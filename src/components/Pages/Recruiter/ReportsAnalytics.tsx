import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3,
  Clock,
  Download,
  Calendar,
  CheckCircle,
  XCircle,
  UserCheck,
  FileText,
  MessageSquare,
} from 'lucide-react';
import { RECRUITMENT_SOURCES } from '../../../types';
import { useCandidates, useRejectedApplications, useHiredApplications, useApplications, useJobs } from '../../../database';
import { getRecruitmentAnalytics } from '../../../database/analytics-utils';

export default function ReportsAnalytics() {

  const [dateRange, setDateRange] = useState('');

   /* 1. fetch data with hooks – LEGAL place */
  const { allApplications } = useApplications()
  const { allRejectedApplications } = useRejectedApplications()
  const { allHiredApplications } = useHiredApplications()
  const { candidates } = useCandidates()
  const { alljobs } = useJobs()

   // Extract unique years from data
  const getAvailableYears = () => {
    const years = new Set<number>();
    
    // Add years from applications
    allApplications.forEach(app => {
      const year = new Date(app.appliedAt).getFullYear();
      if (!isNaN(year)) years.add(year);
    });
    
    // Add years from jobs
    alljobs.forEach(job => {
      const year = new Date(job.createdAt).getFullYear();
      if (!isNaN(year)) years.add(year);
    });
    
    // Add years from candidates (if they have creation dates)
    candidates.forEach(candidate => {
      if (candidate.createdAt) {
        const year = new Date(candidate.createdAt).getFullYear();
        if (!isNaN(year)) years.add(year);
      }
    });
    
    return Array.from(years).sort((a, b) => b - a); // Sort descending (newest first)
  };

  const availableYears = getAvailableYears();

  // Set default year to the most recent available year
  useEffect(() => {
    if (availableYears.length > 0 && !dateRange) {
      setDateRange(availableYears[0].toString());
    }
  }, [availableYears, dateRange]);

  const analytics = useMemo(() => {
    if (!allApplications.length && !candidates.length && !alljobs.length) {
      return null
    }

    const year = Number.parseInt(dateRange)
    return getRecruitmentAnalytics(allApplications, allRejectedApplications, allHiredApplications, candidates, alljobs, year)
  }, [allApplications, allRejectedApplications, candidates, alljobs, dateRange])


  if (!analytics) {
    return (
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-96">
          <div className="text-gray-600">No analytics data available</div>
        </div>
      </div>
    );
  }


  const renderOverviewReport = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Average Hiring Time</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-4xl font-bold text-gray-900">{analytics.avgHiringTime} days</p>
            <p className="text-sm text-gray-600 mt-2">
              Average time from initial candidate contact to official start date
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <Clock className="w-12 h-12 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Position Status Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                <span className="font-medium text-gray-900">Open Positions</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{analytics.openPositions}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <XCircle className="w-6 h-6 text-gray-600 mr-3" />
                <span className="font-medium text-gray-900">Closed Positions</span>
              </div>
              <span className="text-2xl font-bold text-gray-600">{analytics.closedPositions}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Candidate Volume Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-gray-700">Total Applications</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{analytics.totalApplications}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <UserCheck className="w-5 h-5 text-orange-600 mr-2" />
                <span className="text-gray-700">Applications Reviewed</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{analytics.totalReviewed}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MessageSquare className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-gray-700">Candidates Interviewed</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{analytics.totalInterviewed}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recruitment Channel Effectiveness</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Channel</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Applications</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Reviewed</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Interviewed</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Hired</th>
              </tr>
            </thead>
            <tbody>
              {analytics.channelMetrics.map((metric) => {
                if (metric.totalApplications === 0) return null;
                const source = RECRUITMENT_SOURCES.find(s => s.value === metric.channelName);
                return (
                  <tr key={metric.channelName} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{source?.label || metric.channelName}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{metric.totalApplications}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{metric.totalReviewed}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{metric.totalInterviewed}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{metric.totalHired}</td>
                  </tr>
                );
              })}
              {analytics.channelMetrics.every(m => m.totalApplications === 0) && (
                <tr>
                  <td colSpan={6} className="py-8 px-4 text-center text-gray-500">
                    No recruitment channel data available. This might be because candidates don't have recruitment source information or there are no applications for the selected year.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Candidate Quality by Channel</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Channel</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Hire Rate</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Avg Performance</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Avg Retention</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Quality Score</th>
              </tr>
            </thead>
            <tbody>
              {analytics.channelQuality.map((quality) => {
                if (quality.hireRate === 0) return null;
                const source = RECRUITMENT_SOURCES.find(s => s.value === quality.channelName);

                const qualityScore = (
                  (quality.hireRate / 100) * 0.4 +
                  (quality.avgPerformanceScore / 5) * 0.3 +
                  (Math.min(quality.avgRetentionMonths / 24, 1)) * 0.3
                ) * 100;

                return (
                  <tr key={quality.channelName} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{source?.label || quality.channelName}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{quality.hireRate}%</td>
                    <td className="py-3 px-4 text-right text-gray-700">{quality.avgPerformanceScore}/5.0</td>
                    <td className="py-3 px-4 text-right text-gray-700">{quality.avgRetentionMonths} months</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-medium ${
                        qualityScore >= 70 ? 'text-green-600' :
                        qualityScore >= 50 ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {qualityScore.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
              {analytics.channelQuality.every(q => q.hireRate === 0) && (
                <tr>
                  <td colSpan={5} className="py-8 px-4 text-center text-gray-500">
                    No candidate quality data available. This might be because candidates don't have recruitment source information or there are no applications for the selected year.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );


  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
                Reports & Analytics
              </h1>
              <p className="text-gray-600 mt-2">
                Comprehensive insights into your recruitment performance
              </p>
            </div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {
                  availableYears.map(year => (
                    <option key={year} value={year.toString()}>{year}</option>
                  ))
                }
              </select>
            </div>
          </div>
        </div>

        {renderOverviewReport()}

        <div className="mt-8 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Need Custom Reports?</h3>
              <p className="text-gray-600 text-sm mt-1">
                Get detailed analytics tailored to your specific needs
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-sm font-medium">
                Schedule Demo
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}