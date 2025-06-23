"use client";

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import { Calendar, AlertTriangle, Users, TrendingUp, Filter } from 'lucide-react';
import Navbar from '@/components/navbar';
import { ethers } from 'ethers';
import ReportSystemABI from '@/lib/ReportSystemABI.json';

import '@/styles/list.css';
import '@/styles/table.css';
import '@/styles/button.css';
import '@/styles/dashboard.css';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS;

type BlotterReport = {
  id: number;
  reporter: string;
  complainantInfo: string;
  respondentInfo: string;
  incidentType: string;
  natureOfComplaint: string;
  date: string;
  time: string;
  location: string;
  summaryOfIncident: string;
  complainantStatement: string;
  witnessInfo: string;
  timestamp: number;
};

type MonthlyIncident = {
  month: string;
  [key: string]: string | number;
};

type IncidentTypeDistribution = {
  name: string;
  value: number;
  color: string;
};

type TimeSeries = {
  date: string;
  incidents: number;
};

type HourlyData = {
  hour: string;
  incidents: number;
  percentage: number;
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  color?: string;
}

const Dashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7days');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dashboard data states
  const [stats, setStats] = useState({
    totalIncidents: 0,
    resolvedCases: 0,
    activeCases: 0,
    responseRate: '0%'
  });

  const [incidentData, setIncidentData] = useState<MonthlyIncident[]>([]);
  const [incidentTypes, setIncidentTypes] = useState<IncidentTypeDistribution[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeries[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [filteredReports, setFilteredReports] = useState<BlotterReport[]>([]);

  // Colors for charts
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d8', '#f28b82'];

  // Helper functions
  const parseNumber = (val: any): number => {
    if (typeof val === 'string') return parseInt(val, 10);
    if (val && typeof val.toNumber === 'function') return val.toNumber();
    if (typeof val === 'bigint') return Number(val);
    return Number(val) || 0;
  };

  const getMonthName = (monthNum: string): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[parseInt(monthNum) - 1] || monthNum;
  };

  const filterReportsByTimeRange = (reports: BlotterReport[]) => {
    const now = new Date();
    const days = selectedTimeRange === '7days' ? 7 : 
                selectedTimeRange === '30days' ? 30 :
                selectedTimeRange === '3months' ? 90 : 180;
    
    const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
    
    return reports.filter(report => {
      const reportDate = new Date(report.date);
      return reportDate >= cutoffDate;
    });
  };

  useEffect(() => {
    const fetchBlockchainData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (typeof window === "undefined" || !(window as any).ethereum) {
          throw new Error('MetaMask not detected. Please install MetaMask and reload.');
        }
        if (!CONTRACT_ADDRESS) {
          throw new Error('Smart contract address not configured.');
        }

        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ReportSystemABI, signer);

        // Fetch total report count
        const totalReports = await contract.reportCount();
        const totalReportsNum = parseNumber(totalReports);

        // Fetch all reports
        const reports: BlotterReport[] = [];
        for (let i = 1; i <= totalReportsNum; i++) {
          try {
            const report = await contract.getReport(i);
            const processedReport: BlotterReport = {
              id: parseNumber(report.id),
              reporter: report.reporter,
              complainantInfo: report.complainantInfo,
              respondentInfo: report.respondentInfo,
              incidentType: report.incidentType,
              natureOfComplaint: report.natureOfComplaint,
              date: report.date,
              time: report.time,
              location: report.location,
              summaryOfIncident: report.summaryOfIncident,
              complainantStatement: report.complainantStatement,
              witnessInfo: report.witnessInfo,
              timestamp: parseNumber(report.timestamp)
            };
            reports.push(processedReport);
          } catch (err) {
            console.warn(`Failed to fetch report ${i}:`, err);
          }
        }
        // Filter reports by selected time range
        const filtered = filterReportsByTimeRange(reports);
        setFilteredReports(filtered);
        // Calculate basic stats from real data
        const totalIncidents = filtered.length;
        
        // Count resolved cases based on natureOfComplaint or summaryOfIncident containing resolution keywords
        const resolvedCases = filtered.filter(report => {
          const complaint = (report.natureOfComplaint || '').toLowerCase();
          const summary = (report.summaryOfIncident || '').toLowerCase();
          return complaint.includes('resolved') || complaint.includes('closed') || complaint.includes('settled') ||
                 summary.includes('resolved') || summary.includes('closed') || summary.includes('settled');
        }).length;
        
        const activeCases = totalIncidents - resolvedCases;
        const responseRate = totalIncidents > 0 ? ((resolvedCases / totalIncidents) * 100).toFixed(1) : '0';

        setStats({
          totalIncidents,
          resolvedCases,
          activeCases,
          responseRate: `${responseRate}%`
        });

        // Prepare monthly incident data
        const monthlyIncidents: { [key: string]: { [key: string]: number } } = {};
        filtered.forEach(report => {
          if (!report.date) return;
          
          const dateParts = report.date.split('-');
          if (dateParts.length < 2) return;
          
          const monthKey = getMonthName(dateParts[1]);
          const incidentType = report.incidentType || 'Other';
          
          if (!monthlyIncidents[monthKey]) {
            monthlyIncidents[monthKey] = {};
          }
          
          monthlyIncidents[monthKey][incidentType] = (monthlyIncidents[monthKey][incidentType] || 0) + 1;
        });

        // Convert to array format for charts
        const monthlyData: MonthlyIncident[] = Object.entries(monthlyIncidents).map(([month, incidents]) => ({
          month,
          ...incidents
        }));
        setIncidentData(monthlyData);

        // Prepare incident type distribution for pie chart
        const typeCounts: { [key: string]: number } = {};
        filtered.forEach(report => {
          const type = report.incidentType || 'Other';
          typeCounts[type] = (typeCounts[type] || 0) + 1;
        });

        const distribution: IncidentTypeDistribution[] = Object.entries(typeCounts).map(([name, value], index) => ({
          name,
          value,
          color: COLORS[index % COLORS.length]
        }));
        setIncidentTypes(distribution);

        // Prepare time series data
        const dateIncidents: { [key: string]: number } = {};
        filtered.forEach(report => {
          if (!report.date) return;
          dateIncidents[report.date] = (dateIncidents[report.date] || 0) + 1;
        });

        const timeSeries: TimeSeries[] = Object.entries(dateIncidents)
          .map(([date, incidents]) => ({ date, incidents }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setTimeSeriesData(timeSeries);

        // Prepare hourly data
        const hourlyIncidents: { [key: string]: number } = {};
        filtered.forEach(report => {
          if (!report.time) return;
          
          const hour = report.time.split(':')[0];
          const hourNum = parseInt(hour);
          
          let period = '';
          if (hourNum >= 0 && hourNum < 8) period = '12:00 AM - 8:00 AM';
          else if (hourNum >= 8 && hourNum < 12) period = '8:00 AM - 12:00 PM';
          else if (hourNum >= 12 && hourNum < 18) period = '12:00 PM - 6:00 PM';
          else period = '6:00 PM - 12:00 AM';
          
          hourlyIncidents[period] = (hourlyIncidents[period] || 0) + 1;
        });

        const totalHourlyIncidents = Object.values(hourlyIncidents).reduce((sum, count) => sum + count, 0);
        const hourlyDataArray: HourlyData[] = [
          '8:00 AM - 12:00 PM',
          '12:00 PM - 6:00 PM', 
          '6:00 PM - 12:00 AM',
          '12:00 AM - 8:00 AM'
        ].map(hour => {
          const incidents = hourlyIncidents[hour] || 0;
          const percentage = totalHourlyIncidents > 0 ? Math.round((incidents / totalHourlyIncidents) * 100) : 0;
          return { hour, incidents, percentage };
        });
        setHourlyData(hourlyDataArray);

      } catch (err: any) {
        console.error('Dashboard error:', err);
        setError(err.message || 'Failed to fetch data from blockchain');
      } finally {
        setLoading(false);
      }
    };

    fetchBlockchainData();
  }, [selectedTimeRange]);

  // StatCard component
  const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, color = 'blue' }) => (
    <div className="stat-card">
      <div className="stat-card-content">
        <div>
          <p className="stat-card-text">{title}</p>
          <p className={`stat-card-value ${color}`}>{value}</p>
          {trend && (
            <div className="stat-card-trend">
              <TrendingUp className="trend-icon" />
              <span className="trend-text">{trend}</span>
            </div>
          )}
        </div>
        <div className={`stat-card-icon-container ${color}`}>
          <Icon className={`stat-card-icon ${color}`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="blotter-container">
        <Navbar />
        <p className="loading-text">Loading dashboard data from blockchain...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blotter-container">
        <Navbar />
        <p className="error-text">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="blotter-container">
      <Navbar />
      <div className="blotter-wrapper">
        <div className="blotter-card">
          <div className="dashboard-header">
            <div className="header-content">
              <div>
                <h1 className="blotter-title">Barangay Blotter Dashboard</h1>
                <p className="header-subtitle">Real-time incident monitoring and analytics</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-container">
            <div className="filter-group">
              <Filter className="filter-icon" />
              <select
                value={selectedTimeRange}
                onChange={e => setSelectedTimeRange(e.target.value)}
                className="filter-select"
                aria-label="Select time range for data"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="stats-grid" role="region" aria-label="Dashboard statistics">
              <StatCard
                title="Total Incidents"
                value={stats.totalIncidents}
                icon={AlertTriangle}
                color="red"
              />
              <StatCard
                title="Resolved Cases"
                value={stats.resolvedCases}
                icon={Users}
                color="green"
              />
              <StatCard
                title="Active Cases"
                value={stats.activeCases}
                icon={Calendar}
                color="yellow"
              />
              <StatCard
                title="Response Rate"
                value={stats.responseRate}
                icon={TrendingUp}
                color="blue"
              />
            </div>

            {/* Charts */}
            <div className="charts-grid" role="region" aria-label="Charts and analytics">
              {/* Monthly Incident Trends */}
              <div className="chart-container">
                <h3 className="chart-title">Monthly Incident Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={incidentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {incidentTypes.map((type, index) => (
                      <Bar 
                        key={type.name}
                        dataKey={type.name} 
                        stackId="a" 
                        fill={type.color} 
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Incident Distribution */}
              <div className="chart-container">
                <h3 className="chart-title">Incident Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={incidentTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {incidentTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

            {/* Timeline and Analytics */}
          <div className="analytics-container" role="region" aria-label="Incident timeline and analysis">
            <div className="full-width-chart">
              <h3 className="chart-title">Incident Timeline ({selectedTimeRange})</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="incidents" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Location Analysis & Peak Hours */}
            <div className="analytics-grid">
              <div className="chart-container">
                <h3 className="chart-title">Top Incident Locations</h3>
                <div className="space-y-3">
                  {(() => {
                    const locationCounts: { [key: string]: number } = {};
                    filteredReports.forEach(report => {
                      if (report.location) {
                        locationCounts[report.location] = (locationCounts[report.location] || 0) + 1;
                      }
                    });
                    
                    const sortedLocations = Object.entries(locationCounts)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5);
                    
                    const maxCount = sortedLocations[0]?.[1] || 1;
                    
                    return sortedLocations.map(([location, count], index) => (
                      <div key={index} className="peak-hours-item">
                        <span className="peak-hours-label">{location}</span>
                        <div className="peak-hours-bar-container" aria-label={`${count} incidents at ${location}`}>
                          <div className="peak-hours-bar">
                            <div
                              className="peak-hours-bar-fill"
                              style={{ width: `${(count / maxCount) * 100}%` }}
                            ></div>
                          </div>
                          <span className="peak-hours-count">{count}</span>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              <div className="chart-container">
                <h3 className="chart-title">Case Status Overview</h3>
                <div className="resolution-stats">
                  <div className="resolution-average">
                    <div className="resolution-average-value">{stats.totalIncidents}</div>
                    <div className="resolution-average-label">Total Reports Filed</div>
                  </div>
                  <div className="resolution-breakdown">
                    <div className="resolution-breakdown-item">
                      <span className="resolution-breakdown-label">Active Cases</span>
                      <span className="resolution-breakdown-value">{stats.activeCases}</span>
                    </div>
                    <div className="resolution-breakdown-item">
                      <span className="resolution-breakdown-label">Resolved Cases</span>
                      <span className="resolution-breakdown-value">{stats.resolvedCases}</span>
                    </div>
                    <div className="resolution-breakdown-item">
                      <span className="resolution-breakdown-label">Resolution Rate</span>
                      <span className="resolution-breakdown-value">{stats.responseRate}</span>
                    </div>
                    <div className="resolution-breakdown-item">
                      <span className="resolution-breakdown-label">Total Locations</span>
                      <span className="resolution-breakdown-value">{new Set(filteredReports.map(r => r.location).filter(Boolean)).size}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;