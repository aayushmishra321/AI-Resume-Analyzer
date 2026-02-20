export function ExecutiveClassic({ data }) {
  return (
    <div className="bg-white shadow-sm border border-border rounded-lg h-full overflow-hidden">
      {/* Header with sidebar */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-1/3 bg-slate-800 text-white p-6">
          <div className="mb-8">
            <div className="w-20 h-20 bg-slate-700 rounded-full mx-auto mb-4"></div>
            <h1 className="text-xl font-bold text-center mb-1">
              {data?.fullName || "John Doe"}
            </h1>
          </div>

          {/* Contact */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-300">
              Contact
            </h2>
            <div className="space-y-2 text-xs text-slate-200">
              <p>{data?.email || "john.doe@email.com"}</p>
              <p>{data?.phone || "(555) 123-4567"}</p>
              <p>{data?.location || "San Francisco, CA"}</p>
            </div>
          </div>

          {/* Skills */}
          {data?.skills && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-300">
                Skills
              </h2>
              <div className="space-y-2">
                {data.skills.split(',').map((skill, index) => (
                  skill.trim() && (
                    <div key={index} className="text-xs text-slate-200">
                      • {skill.trim()}
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="w-2/3 p-6">
          {/* Summary */}
          {data?.summary && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2 border-b-2 border-slate-800 pb-1">
                Executive Summary
              </h2>
              <p className="text-sm text-foreground leading-relaxed">{data.summary}</p>
            </div>
          )}

          {/* Experience */}
          {data?.experience && data.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 border-b-2 border-slate-800 pb-1">
                Professional Experience
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-foreground">{exp.title}</h3>
                    <div className="text-sm text-muted-foreground mb-1">
                      {exp.company} {exp.location && `• ${exp.location}`}
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">{exp.dates}</div>
                    <p className="text-sm text-foreground">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data?.education && data.education.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 border-b-2 border-slate-800 pb-1">
                Education
              </h2>
              <div className="space-y-3">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-foreground">{edu.degree}</h3>
                    <div className="text-sm text-muted-foreground">
                      {edu.school} {edu.location && `• ${edu.location}`}
                    </div>
                    <div className="text-xs text-muted-foreground">{edu.dates}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
