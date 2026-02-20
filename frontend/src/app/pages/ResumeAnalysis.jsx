import { useState, useEffect } from "react";
import { Upload, FileText, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { resumeService, analysisService } from "../../services/api";

export function ResumeAnalysis() {
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadedResume, setUploadedResume] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [error, setError] = useState(null);
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await resumeService.getList();
      setResumes(response.data.resumes);
    } catch (err) {
      console.error('Failed to fetch resumes:', err);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const response = await resumeService.upload(selectedFile);
      setUploadedResume(response.data.resume);
      setSelectedFile(null);
      await fetchResumes();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async (resumeId) => {
    try {
      setAnalyzing(true);
      setError(null);
      const response = await analysisService.analyze(resumeId || uploadedResume._id, jobDescription);
      setAnalysisResult(response.data.analysis);
      setIsAnalyzed(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSelectExistingResume = async (resume) => {
    setUploadedResume(resume);
    setIsAnalyzed(false);
    setAnalysisResult(null);
  };

  return (
    <div className="p-8" style={{ fontFamily: 'var(--font-family)' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground mb-2">Resume Analysis</h1>
        <p className="text-muted-foreground">Upload your resume to get instant ATS compatibility analysis</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!uploadedResume && !isAnalyzed ? (
        /* Upload Section */
        <div className="max-w-3xl mx-auto">
          <div 
            className="bg-white border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{ borderColor: isDragging ? 'var(--primary)' : 'var(--border)' }}
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              {uploading ? (
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-primary" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {selectedFile ? selectedFile.name : 'Upload Your Resume'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {selectedFile 
                ? `File size: ${(selectedFile.size / 1024).toFixed(2)} KB`
                : 'Drag and drop your resume here, or click to browse'}
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button 
                variant="outline" 
                className="border-border" 
                disabled={uploading}
                onClick={() => document.getElementById('file-upload').click()}
                type="button"
              >
                <FileText className="w-4 h-4 mr-2" />
                Choose File
              </Button>
              <input 
                id="file-upload"
                type="file" 
                className="hidden" 
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx"
                disabled={uploading}
              />
              <Button 
                className="bg-primary hover:bg-primary/90" 
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                type="button"
              >
                {uploading ? 'Uploading...' : 'Upload Resume'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Supported formats: PDF, DOC, DOCX (Max 10MB)
            </p>
          </div>

          {/* Existing Resumes */}
          {resumes.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Or select from your resumes:</h3>
              <div className="grid grid-cols-1 gap-3">
                {resumes.map((resume) => (
                  <div 
                    key={resume._id}
                    className="bg-white border border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
                    onClick={() => handleSelectExistingResume(resume)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">{resume.fileName}</p>
                          <p className="text-sm text-muted-foreground">
                            Uploaded {new Date(resume.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Select
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">ATS Scoring</h4>
              <p className="text-sm text-muted-foreground">Get your resume scored against ATS systems</p>
            </div>

            <div className="bg-white border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Keyword Analysis</h4>
              <p className="text-sm text-muted-foreground">See which keywords match your target role</p>
            </div>

            <div className="bg-white border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Improvements</h4>
              <p className="text-sm text-muted-foreground">Receive actionable suggestions</p>
            </div>
          </div>
        </div>
      ) : uploadedResume && !isAnalyzed ? (
        /* Job Description Input */
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-border rounded-lg p-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Resume Uploaded Successfully!</h2>
            <p className="text-muted-foreground mb-6">
              File: <span className="font-medium text-foreground">{uploadedResume.fileName}</span>
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="jobDescription">Job Description (Optional)</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Paste the job description to get a more accurate match score
                </p>
                <Textarea
                  id="jobDescription"
                  rows={8}
                  placeholder="Paste the job description here for better analysis..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="bg-input-background border-input resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                className="bg-primary hover:bg-primary/90 flex-1"
                onClick={() => handleAnalyze()}
                disabled={analyzing}
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Resume'
                )}
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setUploadedResume(null);
                  setJobDescription('');
                }}
                disabled={analyzing}
              >
                Upload Different Resume
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Analysis Results */
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-white border border-border rounded-lg p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">Overall ATS Score</h2>
                <p className="text-muted-foreground">Your resume has been analyzed against 50+ ATS criteria</p>
              </div>
              <Button 
                variant="outline" 
                className="border-border"
                onClick={() => {
                  setIsAnalyzed(false);
                  setUploadedResume(null);
                  setAnalysisResult(null);
                  setJobDescription('');
                }}
              >
                Analyze Another Resume
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-5xl font-semibold text-primary mb-2">{analysisResult.overallScore}</div>
                <p className="text-sm text-muted-foreground">Overall Score</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Content</span>
                  <span className="text-sm font-medium text-foreground">{analysisResult.contentScore}%</span>
                </div>
                <Progress value={analysisResult.contentScore} className="h-2 mb-1" />
                <p className="text-xs text-green-600">
                  {analysisResult.contentScore >= 80 ? 'Excellent' : 'Good'}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Keywords</span>
                  <span className="text-sm font-medium text-foreground">{analysisResult.keywordScore}%</span>
                </div>
                <Progress value={analysisResult.keywordScore} className="h-2 mb-1" />
                <p className="text-xs text-yellow-600">
                  {analysisResult.keywordScore >= 80 ? 'Excellent' : 'Good'}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Format</span>
                  <span className="text-sm font-medium text-foreground">{analysisResult.formatScore}%</span>
                </div>
                <Progress value={analysisResult.formatScore} className="h-2 mb-1" />
                <p className="text-xs text-green-600">
                  {analysisResult.formatScore >= 80 ? 'Excellent' : 'Good'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Keyword Match */}
            {analysisResult.keywordMatches && analysisResult.keywordMatches.length > 0 && (
              <div className="bg-white border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">Keyword Match Analysis</h3>
                
                <div className="space-y-3">
                  {analysisResult.keywordMatches.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-md border border-border bg-background">
                      <div className="flex items-center gap-3">
                        {item.status === "found" ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                        <span className="text-sm text-foreground">{item.keyword}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.status === "found" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {item.status === "found" ? `${item.count} mentions` : "Missing"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {analysisResult.missingSkills && analysisResult.missingSkills.length > 0 && (
              <div className="bg-white border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">Missing Skills & Keywords</h3>
                
                <p className="text-sm text-muted-foreground mb-4">
                  Consider adding these skills if they match your experience:
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {analysisResult.missingSkills.map((skill, index) => (
                    <span key={index} className="px-3 py-1.5 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 mb-1">Pro Tip</h4>
                      <p className="text-sm text-blue-700 leading-relaxed">
                        Only add skills you actually have. Focus on keywords from your target job description.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Formatting Suggestions */}
          {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
            <div className="bg-white border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Suggestions & Improvements</h3>
              
              <div className="space-y-3">
                {analysisResult.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex gap-3 p-4 rounded-md border border-border bg-background">
                    <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground leading-relaxed">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
