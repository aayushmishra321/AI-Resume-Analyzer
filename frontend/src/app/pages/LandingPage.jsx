import { Link } from "react-router";
import { FileText, TrendingUp, CheckCircle2, Target, Briefcase, Star } from "lucide-react";
import { Button } from "../components/ui/button";

export function LandingPage() {
  const features = [
    {
      icon: <Target className="w-6 h-6 text-primary" />,
      title: "ATS-Optimized Analysis",
      description: "Get your resume scored against industry-standard ATS systems to maximize your chances."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
      title: "Real-time Scoring",
      description: "Receive instant feedback on your resume's strengths and areas for improvement."
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-primary" />,
      title: "Keyword Matching",
      description: "Ensure your resume contains the right keywords for your target role and industry."
    },
    {
      icon: <FileText className="w-6 h-6 text-primary" />,
      title: "Professional Templates",
      description: "Choose from our curated collection of clean, professional resume templates."
    },
    {
      icon: <Briefcase className="w-6 h-6 text-primary" />,
      title: "Job Match Score",
      description: "See how well your resume matches specific job descriptions and requirements."
    },
    {
      icon: <Star className="w-6 h-6 text-primary" />,
      title: "Cover Letter Generator",
      description: "Create compelling cover letters tailored to each job application automatically."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "Tech Corp",
      content: "This tool helped me land 3 interviews within a week. The ATS optimization made all the difference.",
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "Startup Inc",
      content: "The resume analysis was spot-on. I improved my score from 65% to 92% and got my dream job.",
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Manager",
      company: "Brand Co",
      content: "Professional, easy to use, and incredibly effective. Highly recommend for job seekers.",
      avatar: "ER"
    }
  ];

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: 'var(--font-family)' }}>
      {/* Navigation */}
      <nav className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-7 h-7 text-primary" />
              <span className="text-xl font-semibold text-foreground">ResumeAI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" className="text-sm">
                  Log In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="text-sm bg-primary hover:bg-primary/90">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-semibold text-foreground mb-6 leading-tight">
            Improve Your Resume with<br />AI-Based ATS Analysis
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Get instant feedback on your resume's ATS compatibility, keyword optimization, and overall effectiveness. 
            Our AI analyzes your resume against real job requirements to help you stand out.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/app/analysis">
              <Button size="lg" className="bg-primary hover:bg-primary/90 px-8 py-6 text-base">
                Analyze Resume
              </Button>
            </Link>
            <Link to="/app/builder">
              <Button size="lg" variant="outline" className="px-8 py-6 text-base border-border">
                Build Resume
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-foreground mb-4">
              Everything You Need to Get Hired
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools to optimize your resume and increase your interview chances
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-background border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-foreground mb-4">
              Trusted by Job Seekers Worldwide
            </h2>
            <p className="text-muted-foreground">
              See what our users have to say about their success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  "{testimonial.content}"
                </p>
                <div className="text-xs text-muted-foreground">
                  {testimonial.company}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-primary" />
                <span className="font-semibold text-foreground">ResumeAI</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Helping professionals land their dream jobs with AI-powered resume optimization.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Examples</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2026 ResumeAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
