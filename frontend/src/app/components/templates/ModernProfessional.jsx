export function ModernProfessional({ data }) {
  return (
    <div className="bg-white p-8 shadow-sm border border-border rounded-lg h-full">
      {/* Header */}
      <div className="border-b-2 border-primary pb-4 mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-1">
          {data?.fullName || "John Doe"}
        </h1>
        <div className="text-sm text-muted-foreground flex flex-wrap gap-3">
          <span>{data?.email || "john.doe@email.com"}</span>
          <span>•</span>
          <span>{data?.phone || "(555) 123-4567"}</span>
          <span>•</span>
          <span>{data?.location || "San Francisco, CA"}</span>
        </div>
      </div>

      {/* Summary */}
      {data?.summary && (
        <div className="mb-6">
          <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
            Professional Summary
          </h2>
          <p className="text-sm text-foreground leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data?.experience && data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
            Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-foreground">{exp.title}</h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {exp.dates}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {exp.company} {exp.location && `• ${exp.location}`}
                </div>
                <p className="text-sm text-foreground">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data?.education && data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {edu.dates}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {edu.school} {edu.location && `• ${edu.location}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data?.skills && (
        <div>
          <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.split(',').map((skill, index) => (
              skill.trim() && (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded"
                >
                  {skill.trim()}
                </span>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
