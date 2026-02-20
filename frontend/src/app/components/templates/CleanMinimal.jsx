export function CleanMinimal({ data }) {
  return (
    <div className="bg-white p-8 shadow-sm border border-border rounded-lg h-full">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b border-border">
        <h1 className="text-4xl font-light text-foreground mb-3">
          {data?.fullName || "John Doe"}
        </h1>
        <div className="text-sm text-muted-foreground space-x-3">
          <span>{data?.email || "john.doe@email.com"}</span>
          <span>|</span>
          <span>{data?.phone || "(555) 123-4567"}</span>
          <span>|</span>
          <span>{data?.location || "San Francisco, CA"}</span>
        </div>
      </div>

      {/* Summary */}
      {data?.summary && (
        <div className="mb-8">
          <p className="text-sm text-center text-muted-foreground leading-relaxed italic">
            {data.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {data?.experience && data.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-light text-foreground mb-4 pb-2 border-b border-border">
            Experience
          </h2>
          <div className="space-y-5">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-medium text-foreground">{exp.title}</h3>
                  <span className="text-xs text-muted-foreground">{exp.dates}</span>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {exp.company} {exp.location && `• ${exp.location}`}
                </div>
                <p className="text-sm text-foreground leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data?.education && data.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-light text-foreground mb-4 pb-2 border-b border-border">
            Education
          </h2>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-medium text-foreground">{edu.degree}</h3>
                  <span className="text-xs text-muted-foreground">{edu.dates}</span>
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
          <h2 className="text-lg font-light text-foreground mb-4 pb-2 border-b border-border">
            Skills
          </h2>
          <p className="text-sm text-foreground">
            {data.skills}
          </p>
        </div>
      )}
    </div>
  );
}
