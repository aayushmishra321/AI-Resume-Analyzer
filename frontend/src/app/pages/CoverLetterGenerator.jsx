import { useState, useEffect } from "react";
import { Sparkles, Copy, Download, RefreshCw, Loader2, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { coverLetterService, resumeService } from "../../services/api";

export function CoverLetterGenerator() {
  const [isGenerated, setIsGenerated] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    hiringManager: "",
    jobDescription: "",
    tone: "professional",
    resumeId: ""
  });

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

  const handleGenerate = async () => {
    if (!formData.jobTitle || !formData.companyName || !formData.jobDescription) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setGenerating(true);
      const response = await coverLetterService.generate(
        formData.jobTitle,
        formData.companyName,
        formData.hiringManager,
        formData.jobDescription,
        formData.tone,
        formData.resumeId
      );
      
      setGeneratedLetter(response.data.coverLetter.generatedLetter);
      setIsGenerated(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate cover letter');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedLetter], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `cover-letter-${formData.companyName.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="p-8" style={{ fontFamily: 'var(--font-family)' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground mb-2">Cover Letter Generator</h1>
        <p className="text-muted-foreground">Create a personalized cover letter tailored to your job application using AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Job Information</h2>

          <form className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input
                id="jobTitle"
                placeholder="Enter job title"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className="bg-input-background border-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="bg-input-background border-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hiringManager">Hiring Manager Name (Optional)</Label>
              <Input
                id="hiringManager"
                placeholder="Enter hiring manager name"
                value={formData.hiringManager}
                onChange={(e) => setFormData({ ...formData, hiringManager: e.target.value })}
                className="bg-input-background border-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={formData.tone} onValueChange={(value) => setFormData({ ...formData, tone: value })}>
                <SelectTrigger className="bg-input-background border-input">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {resumes.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="resume">Your Resume (Optional)</Label>
                <Select 
                  value={formData.resumeId || undefined} 
                  onValueChange={(value) => setFormData({ ...formData, resumeId: value })}
                >
                  <SelectTrigger className="bg-input-background border-input">
                    <SelectValue placeholder="Select a resume for better personalization" />
                  </SelectTrigger>
                  <SelectContent>
                    {resumes.map((resume) => (
                      <SelectItem key={resume._id} value={resume._id}>
                        {resume.fileName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.resumeId && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, resumeId: "" })}
                    className="text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    Clear selection
                  </button>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description/Key Requirements *</Label>
              <Textarea
                id="jobDescription"
                rows={6}
                placeholder="Paste the job description or key requirements here..."
                value={formData.jobDescription}
                onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                className="bg-input-background border-input resize-none"
              />
            </div>

            <Button 
              className="w-full bg-primary hover:bg-primary/90"
              onClick={(e) => {
                e.preventDefault();
                handleGenerate();
              }}
              disabled={!formData.jobTitle || !formData.companyName || !formData.jobDescription || generating}
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Cover Letter
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Generated Letter Preview */}
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Generated Letter</h2>
            {isGenerated && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={handleGenerate} disabled={generating}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            )}
          </div>

          {!isGenerated ? (
            <div className="flex items-center justify-center h-96 border-2 border-dashed border-border rounded-lg">
              <div className="text-center">
                <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Fill in the form and click Generate to create your cover letter</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Textarea
                value={generatedLetter}
                onChange={(e) => setGeneratedLetter(e.target.value)}
                rows={20}
                className="bg-input-background border-input font-mono text-sm resize-none"
              />
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900 leading-relaxed">
                  <strong>Tip:</strong> Review and customize the generated letter to add personal touches and specific examples from your experience. 
                  This is a starting point - make it uniquely yours!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tips Section */}
      {!isGenerated && (
        <div className="mt-6 bg-white border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Tips for a Great Cover Letter</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-2">Be Specific</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Mention specific achievements and skills that match the job requirements. Use numbers and metrics when possible.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Show Enthusiasm</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Express genuine interest in the company and role. Research the company and mention what excites you about them.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Keep It Concise</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Aim for 3-4 paragraphs. Make every sentence count and avoid repeating what's in your resume.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
