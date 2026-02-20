import { useState, useEffect } from "react";
import { FileText, Eye, Trash2, Plus, Loader2, BarChart3, Download } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { resumeService } from "../../services/api";

export function MyResumes() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await resumeService.getList();
      
      console.log('API Response:', response);
      
      // Handle different response structures
      let resumesList = [];
      if (response.success && response.data && response.data.resumes) {
        resumesList = response.data.resumes;
      } else if (response.data && Array.isArray(response.data)) {
        resumesList = response.data;
      } else if (Array.isArray(response)) {
        resumesList = response;
      }
      
      console.log('Resumes loaded:', resumesList.length);
      setResumes(resumesList);
    } catch (err) {
      console.error('Failed to fetch resumes:', err);
      setError(err.response?.data?.message || 'Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resumeId) => {
    if (!confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      await resumeService.delete(resumeId);
      setResumes(resumes.filter(r => r._id !== resumeId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete resume');
    }
  };

  const handleDownload = async (resume) => {
    try {
      console.log('Downloading resume:', resume._id, resume.fileName);
      
      // Pass true to indicate this is a download request
      const response = await resumeService.download(resume._id, true);
      const blob = response.data;
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = resume.fileName || 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
    } catch (err) {
      console.error('Failed to download resume:', err);
      alert('Unable to download this resume. Please try again.');
    }
  };

  const handleView = async (resume) => {
    try {
      console.log('Viewing resume:', resume._id, resume.fileName);
      
      // Pass false to indicate this is a view request (inline)
      const response = await resumeService.download(resume._id, false);
      
      console.log('Download response:', response);
      console.log('Content-Type:', response.headers['content-type']);
      
      // The response.data is already a Blob when using responseType: 'blob'
      const blob = response.data;
      
      // Verify it's a valid blob
      if (!(blob instanceof Blob)) {
        console.error('Response is not a Blob:', blob);
        throw new Error('Invalid file format received');
      }
      
      console.log('Blob size:', blob.size, 'bytes');
      console.log('Blob type:', blob.type);
      
      // Create object URL and open in new tab
      const url = URL.createObjectURL(blob);
      console.log('Opening URL:', url);
      
      const newWindow = window.open(url, '_blank');
      
      if (!newWindow) {
        alert('Please allow popups to view the resume');
      }
      
      // Clean up the URL after 10 seconds
      setTimeout(() => {
        URL.revokeObjectURL(url);
        console.log('Cleaned up blob URL');
      }, 10000);
      
    } catch (err) {
      console.error('Failed to view resume:', err);
      console.error('Error details:', err.response?.data);
      alert('Unable to preview this resume. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8" style={{ fontFamily: 'var(--font-family)' }}>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">My Resumes</h1>
          <p className="text-muted-foreground">Manage your uploaded and generated resumes</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => navigate('/app/analysis')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Upload Resume
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={() => navigate('/app/builder')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Resume
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {resumes.length === 0 ? (
        /* Empty State */
        <div className="bg-white border border-border rounded-lg p-12 text-center">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No Resumes Yet</h2>
          <p className="text-muted-foreground mb-6">
            Create your first resume or upload an existing one
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate('/app/builder')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Resume
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/app/analysis')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Upload Resume
            </Button>
          </div>
        </div>
      ) : (
        /* Resumes Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <div
              key={resume._id}
              className="bg-white border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Resume Preview */}
              <div className="aspect-[8.5/11] bg-background p-4 flex items-center justify-center border-b border-border">
                <FileText className="w-16 h-16 text-muted-foreground" />
              </div>

              {/* Resume Info */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-1 truncate" title={resume.fileName}>
                  {resume.fileName}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Uploaded {new Date(resume.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>

                {/* Stats */}
                {resume.analysisResults && resume.analysisResults.length > 0 && (
                  <div className="mb-3 p-2 bg-primary/10 rounded-md">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">ATS Score</span>
                      <span className="font-semibold text-primary">
                        {resume.analysisResults[resume.analysisResults.length - 1].overallScore}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleView(resume)}
                    title="View resume in new tab"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(resume)}
                    title="Download resume"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate('/app/analysis', { state: { resumeId: resume._id } })}
                    title="Analyze resume"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(resume._id)}
                    title="Delete resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Cards */}
      {resumes.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-border rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Total Resumes</h4>
            <p className="text-2xl font-bold text-primary">{resumes.length}</p>
          </div>

          <div className="bg-white border border-border rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Analyzed</h4>
            <p className="text-2xl font-bold text-green-600">
              {resumes.filter(r => r.analysisResults && r.analysisResults.length > 0).length}
            </p>
          </div>

          <div className="bg-white border border-border rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Average Score</h4>
            <p className="text-2xl font-bold text-blue-600">
              {resumes.filter(r => r.analysisResults && r.analysisResults.length > 0).length > 0
                ? Math.round(
                    resumes
                      .filter(r => r.analysisResults && r.analysisResults.length > 0)
                      .reduce((sum, r) => sum + r.analysisResults[r.analysisResults.length - 1].overallScore, 0) /
                    resumes.filter(r => r.analysisResults && r.analysisResults.length > 0).length
                  )
                : 0}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
