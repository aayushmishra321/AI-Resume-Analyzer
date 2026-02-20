import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { resumeService } from "../../services/api";

export function ResumeBuilder() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Get template from navigation state
  useEffect(() => {
    if (location.state?.templateId) {
      setSelectedTemplate(location.state.templateId);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  }, [location.state]);

  const handleGenerateResume = async () => {
    try {
      setGenerating(true);
      setError(null);
      
      // Send formData to backend for PDF generation
      const response = await resumeService.create(formData);
      
      // Show success message
      setShowToast(true);
      
      // Navigate to My Resumes page after short delay
      setTimeout(() => {
        setShowToast(false);
        navigate('/app/resumes');
      }, 1500);
      
    } catch (error) {
      console.error('Error generating resume:', error);
      setError(error.response?.data?.message || 'Failed to generate resume. Please try again.');
      setShowToast(false);
    } finally {
      setGenerating(false);
    }
  };

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    experience: [
      {
        title: "",
        company: "",
        location: "",
        dates: "",
        description: ""
      }
    ],
    education: [
      {
        degree: "",
        school: "",
        location: "",
        dates: ""
      }
    ],
    skills: ""
  });

  const steps = [
    { number: 1, name: "Personal Info" },
    { number: 2, name: "Experience" },
    { number: 3, name: "Education" },
    { number: 4, name: "Skills" },
  ];

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { title: "", company: "", location: "", dates: "", description: "" }]
    });
  };

  const removeExperience = (index) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_, i) => i !== index)
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { degree: "", school: "", location: "", dates: "" }]
    });
  };

  const removeEducation = (index) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: 'var(--font-family)' }}>
      {/* Success Toast */}
      {showToast && !error && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-top">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{selectedTemplate ? 'Template selected! Start building your resume.' : 'Resume generated successfully!'}</span>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-top">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-border p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-foreground">Resume Builder</h1>
            {selectedTemplate && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Template #{selectedTemplate} Selected
              </div>
            )}
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.number
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {step.number}
                  </div>
                  <span className={`text-sm ${
                    currentStep >= step.number ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.number ? "bg-primary" : "bg-border"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="bg-white border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              {steps[currentStep - 1].name}
            </h2>

            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="bg-input-background border-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-input-background border-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-input-background border-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, State"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="bg-input-background border-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    rows={4}
                    placeholder="Brief summary of your professional background and key achievements"
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    className="bg-input-background border-input resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Experience */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {formData.experience.map((exp, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-foreground">Experience {index + 1}</h3>
                      {formData.experience.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExperience(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Job Title</Label>
                      <Input
                        placeholder="e.g., Senior Software Engineer"
                        value={exp.title}
                        onChange={(e) => {
                          const newExp = [...formData.experience];
                          newExp[index].title = e.target.value;
                          setFormData({ ...formData, experience: newExp });
                        }}
                        className="bg-input-background border-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input
                        placeholder="e.g., Tech Corporation"
                        value={exp.company}
                        onChange={(e) => {
                          const newExp = [...formData.experience];
                          newExp[index].company = e.target.value;
                          setFormData({ ...formData, experience: newExp });
                        }}
                        className="bg-input-background border-input"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          placeholder="City, State"
                          value={exp.location}
                          onChange={(e) => {
                            const newExp = [...formData.experience];
                            newExp[index].location = e.target.value;
                            setFormData({ ...formData, experience: newExp });
                          }}
                          className="bg-input-background border-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Dates</Label>
                        <Input
                          placeholder="2020 - Present"
                          value={exp.dates}
                          onChange={(e) => {
                            const newExp = [...formData.experience];
                            newExp[index].dates = e.target.value;
                            setFormData({ ...formData, experience: newExp });
                          }}
                          className="bg-input-background border-input"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        rows={3}
                        placeholder="Describe your key responsibilities and achievements"
                        value={exp.description}
                        onChange={(e) => {
                          const newExp = [...formData.experience];
                          newExp[index].description = e.target.value;
                          setFormData({ ...formData, experience: newExp });
                        }}
                        className="bg-input-background border-input resize-none"
                      />
                    </div>
                  </div>
                ))}

                <Button variant="outline" onClick={addExperience} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </div>
            )}

            {/* Step 3: Education */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {formData.education.map((edu, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-foreground">Education {index + 1}</h3>
                      {formData.education.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEducation(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Degree</Label>
                      <Input
                        placeholder="e.g., Bachelor of Science in Computer Science"
                        value={edu.degree}
                        onChange={(e) => {
                          const newEdu = [...formData.education];
                          newEdu[index].degree = e.target.value;
                          setFormData({ ...formData, education: newEdu });
                        }}
                        className="bg-input-background border-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>School</Label>
                      <Input
                        placeholder="e.g., University Name"
                        value={edu.school}
                        onChange={(e) => {
                          const newEdu = [...formData.education];
                          newEdu[index].school = e.target.value;
                          setFormData({ ...formData, education: newEdu });
                        }}
                        className="bg-input-background border-input"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          placeholder="City, State"
                          value={edu.location}
                          onChange={(e) => {
                            const newEdu = [...formData.education];
                            newEdu[index].location = e.target.value;
                            setFormData({ ...formData, education: newEdu });
                          }}
                          className="bg-input-background border-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Dates</Label>
                        <Input
                          placeholder="2015 - 2019"
                          value={edu.dates}
                          onChange={(e) => {
                            const newEdu = [...formData.education];
                            newEdu[index].dates = e.target.value;
                            setFormData({ ...formData, education: newEdu });
                          }}
                          className="bg-input-background border-input"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button variant="outline" onClick={addEducation} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              </div>
            )}

            {/* Step 4: Skills */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  <Textarea
                    id="skills"
                    rows={6}
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="Enter your skills separated by commas"
                    className="bg-input-background border-input resize-none"
                  />
                  <p className="text-xs text-muted-foreground">Separate each skill with a comma</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < steps.length ? (
                <Button
                  onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                  className="bg-primary hover:bg-primary/90"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleGenerateResume}
                  disabled={generating}
                >
                  {generating ? 'Generating...' : 'Generate Resume'}
                </Button>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white border border-border rounded-lg p-6 sticky top-6 h-fit">
            <h2 className="text-lg font-semibold text-foreground mb-6">Live Preview</h2>
            
            <div className="border border-border rounded-lg p-8 bg-background">
              {/* Preview Header */}
              <div className="mb-6 pb-4 border-b border-border">
                <h1 className="text-2xl font-semibold text-foreground mb-2">{formData.fullName || "Your Name"}</h1>
                <div className="text-sm text-muted-foreground space-y-1">
                  {formData.email && <p>{formData.email}</p>}
                  {formData.phone && <p>{formData.phone}</p>}
                  {formData.location && <p>{formData.location}</p>}
                </div>
              </div>

              {/* Preview Summary */}
              {formData.summary && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">Summary</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{formData.summary}</p>
                </div>
              )}

              {/* Preview Experience */}
              {formData.experience.length > 0 && formData.experience[0].title && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">Experience</h2>
                  <div className="space-y-4">
                    {formData.experience.map((exp, index) => (
                      exp.title && (
                        <div key={index}>
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="text-sm font-medium text-foreground">{exp.title}</h3>
                            {exp.dates && <span className="text-xs text-muted-foreground">{exp.dates}</span>}
                          </div>
                          {exp.company && <p className="text-sm text-muted-foreground mb-1">{exp.company} {exp.location && `• ${exp.location}`}</p>}
                          {exp.description && <p className="text-sm text-muted-foreground">{exp.description}</p>}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Preview Education */}
              {formData.education.length > 0 && formData.education[0].degree && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">Education</h2>
                  <div className="space-y-3">
                    {formData.education.map((edu, index) => (
                      edu.degree && (
                        <div key={index}>
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="text-sm font-medium text-foreground">{edu.degree}</h3>
                            {edu.dates && <span className="text-xs text-muted-foreground">{edu.dates}</span>}
                          </div>
                          {edu.school && <p className="text-sm text-muted-foreground">{edu.school} {edu.location && `• ${edu.location}`}</p>}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Preview Skills */}
              {formData.skills && (
                <div>
                  <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.split(',').map((skill, index) => (
                      skill.trim() && (
                        <span key={index} className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {skill.trim()}
                        </span>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}