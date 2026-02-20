import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { FileText, TrendingUp, AlertCircle, CheckCircle2, ArrowUpRight, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { analysisService } from "../../services/api";

export function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await analysisService.getDashboardStats();
      setStats(response.data);
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-700">{error}</p>
          <Button onClick={fetchDashboardData} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const hasData = stats && stats.stats.totalResumes > 0;

  return (
    <div className="p-8" style={{ fontFamily: 'var(--font-family)' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          {hasData 
            ? "Welcome back! Here's an overview of your resume performance." 
            : "Get started by uploading your first resume!"}
        </p>
      </div>

      {!hasData ? (
        /* Empty State */
        <div className="bg-white border border-border rounded-lg p-12 text-center">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No Resumes Yet</h2>
          <p className="text-muted-foreground mb-6">
            Upload your first resume to get started with AI-powered analysis
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/app/analysis">
              <Button className="bg-primary hover:bg-primary/90">
                Upload Resume
              </Button>
            </Link>
            <Link to="/app/templates">
              <Button variant="outline">
                Browse Templates
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Resume Score</p>
                  <p className="text-3xl font-semibold text-foreground">{stats.stats.averageScore}%</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="mb-2">
                <Progress value={stats.stats.averageScore} className="h-2" />
              </div>
              <p className="text-xs text-green-600">
                {stats.stats.averageScore >= 80 ? 'Excellent score!' : 'Keep improving!'}
              </p>
            </div>

            <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">ATS Compatibility</p>
                  <p className="text-3xl font-semibold text-foreground">{stats.stats.atsCompatibility}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {stats.stats.atsCompatibility === 'Excellent' 
                  ? 'Your resume is well-optimized for ATS systems'
                  : 'Consider improving ATS compatibility'}
              </p>
            </div>

            <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Documents</p>
                  <p className="text-3xl font-semibold text-foreground">{stats.stats.totalResumes}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {stats.stats.totalAnalyses} {stats.stats.totalAnalyses === 1 ? 'analysis' : 'analyses'} completed
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resume Score Widget */}
            {stats.scoreBreakdown && (
              <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground">Resume Score Breakdown</h2>
                  <Link to="/app/analysis">
                    <Button variant="ghost" size="sm" className="text-primary">
                      View Details
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Content Quality</span>
                      <span className="text-sm font-medium text-foreground">{stats.scoreBreakdown.content}%</span>
                    </div>
                    <Progress value={stats.scoreBreakdown.content} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Keyword Match</span>
                      <span className="text-sm font-medium text-foreground">{stats.scoreBreakdown.keywords}%</span>
                    </div>
                    <Progress value={stats.scoreBreakdown.keywords} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Formatting</span>
                      <span className="text-sm font-medium text-foreground">{stats.scoreBreakdown.format}%</span>
                    </div>
                    <Progress value={stats.scoreBreakdown.format} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">ATS Readability</span>
                      <span className="text-sm font-medium text-foreground">{stats.scoreBreakdown.ats}%</span>
                    </div>
                    <Progress value={stats.scoreBreakdown.ats} className="h-2" />
                  </div>
                </div>
              </div>
            )}

            {/* Improvement Suggestions */}
            {stats.latestAnalysis && stats.latestAnalysis.suggestions && (
              <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-6">Improvement Suggestions</h2>
                
                <div className="space-y-3">
                  {stats.latestAnalysis.suggestions.slice(0, 4).map((suggestion, index) => (
                    <div key={index} className="flex gap-3 p-3 rounded-md border border-border bg-background">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground leading-relaxed">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {stats.recentActivity && stats.recentActivity.length > 0 && (
              <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-6">Recent Activity</h2>
                
                <div className="space-y-4">
                  {stats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{activity.action}</p>
                        <p className="text-sm text-muted-foreground truncate">{activity.file}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-6">Quick Actions</h2>
              
              <div className="space-y-3">
                <Link to="/app/analysis">
                  <Button className="w-full bg-primary hover:bg-primary/90 justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Analyze New Resume
                  </Button>
                </Link>
                <Link to="/app/cover-letter">
                  <Button variant="outline" className="w-full justify-start">
                    Generate Cover Letter
                  </Button>
                </Link>
                <Link to="/app/templates">
                  <Button variant="outline" className="w-full justify-start">
                    Browse Templates
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
