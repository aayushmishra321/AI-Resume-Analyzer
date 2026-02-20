import { useState } from "react";
import { Eye, Download } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { ModernProfessional } from "../components/templates/ModernProfessional";
import { CleanMinimal } from "../components/templates/CleanMinimal";
import { ExecutiveClassic } from "../components/templates/ExecutiveClassic";

export function ResumeTemplates() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const sampleData = {
    fullName: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 987-6543",
    location: "New York, NY",
    summary: "Results-driven professional with 8+ years of experience in software development and team leadership.",
    experience: [
      {
        title: "Senior Software Engineer",
        company: "Tech Corp",
        location: "New York, NY",
        dates: "2020 - Present",
        description: "Led development of scalable microservices architecture serving 2M+ users. Mentored team of 5 junior developers."
      },
      {
        title: "Software Engineer",
        company: "StartupXYZ",
        location: "San Francisco, CA",
        dates: "2017 - 2020",
        description: "Developed full-stack web applications using React, Node.js, and PostgreSQL."
      }
    ],
    education: [
      {
        degree: "B.S. Computer Science",
        school: "Stanford University",
        location: "Stanford, CA",
        dates: "2013 - 2017"
      }
    ],
    skills: "JavaScript, React, Node.js, Python, AWS, Docker, Kubernetes, PostgreSQL"
  };

  const templates = [
    { 
      id: 1, 
      name: "Modern Professional", 
      category: "developer",
      component: ModernProfessional,
      description: "Clean design with bold headers and organized sections"
    },
    { 
      id: 2, 
      name: "Clean Minimal", 
      category: "developer",
      component: CleanMinimal,
      description: "Simple layout with centered header and elegant typography"
    },
    { 
      id: 3, 
      name: "Executive Classic", 
      category: "manager",
      component: ExecutiveClassic,
      description: "Professional sidebar layout perfect for executives"
    },
    { 
      id: 4, 
      name: "Fresh Graduate", 
      category: "fresher",
      component: ModernProfessional,
      description: "Optimized layout for entry-level positions"
    },
    { 
      id: 5, 
      name: "Tech Stack", 
      category: "developer",
      component: CleanMinimal,
      description: "Highlights technical skills prominently"
    },
    { 
      id: 6, 
      name: "Entry Level", 
      category: "fresher",
      component: CleanMinimal,
      description: "Simple and professional for first-time job seekers"
    },
    { 
      id: 7, 
      name: "Senior Manager", 
      category: "manager",
      component: ExecutiveClassic,
      description: "Emphasizes leadership experience and achievements"
    },
    { 
      id: 8, 
      name: "Simple Professional", 
      category: "fresher",
      component: ModernProfessional,
      description: "Straightforward layout focusing on education and skills"
    },
    { 
      id: 9, 
      name: "Corporate Executive", 
      category: "manager",
      component: ExecutiveClassic,
      description: "Sophisticated design for C-level positions"
    },
  ];

  const filteredTemplates = filter === "all" 
    ? templates 
    : templates.filter(t => t.category === filter);

  const handleUseTemplate = (template) => {
    // Navigate to builder with template selected
    navigate('/app/builder', { state: { templateId: template.id } });
  };

  return (
    <div className="p-8" style={{ fontFamily: 'var(--font-family)' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground mb-2">Resume Templates</h1>
        <p className="text-muted-foreground">Choose from our collection of professional resume templates</p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <div className="flex gap-3">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-primary" : ""}
          >
            All Templates
          </Button>
          <Button
            variant={filter === "developer" ? "default" : "outline"}
            onClick={() => setFilter("developer")}
            className={filter === "developer" ? "bg-primary" : ""}
          >
            Developer
          </Button>
          <Button
            variant={filter === "fresher" ? "default" : "outline"}
            onClick={() => setFilter("fresher")}
            className={filter === "fresher" ? "bg-primary" : ""}
          >
            Fresher
          </Button>
          <Button
            variant={filter === "manager" ? "default" : "outline"}
            onClick={() => setFilter("manager")}
            className={filter === "manager" ? "bg-primary" : ""}
          >
            Manager
          </Button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const TemplateComponent = template.component;
          return (
            <div
              key={template.id}
              className="bg-white border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Template Preview */}
              <div className="aspect-[8.5/11] bg-background p-4 relative overflow-hidden">
                <div className="scale-[0.35] origin-top-left w-[285%] h-[285%]">
                  <TemplateComponent data={sampleData} />
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white hover:bg-white/90"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => handleUseTemplate(template)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Use Template
                  </Button>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-4 border-t border-border">
                <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{template.description}</p>
                <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded capitalize">
                  {template.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      <Dialog open={selectedTemplate !== null} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              {selectedTemplate?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {selectedTemplate && (
              <>
                <div className="mb-6">
                  {(() => {
                    const TemplateComponent = selectedTemplate.component;
                    return <TemplateComponent data={sampleData} />;
                  })()}
                </div>
                <div className="flex justify-end gap-3 sticky bottom-0 bg-white pt-4 border-t border-border">
                  <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                    Close
                  </Button>
                  <Button 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => {
                      handleUseTemplate(selectedTemplate);
                      setSelectedTemplate(null);
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Use This Template
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
