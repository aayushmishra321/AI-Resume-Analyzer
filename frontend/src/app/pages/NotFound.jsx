import { Link } from "react-router";
import { FileText, Home } from "lucide-react";
import { Button } from "../components/ui/button";

export function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6" style={{ fontFamily: 'var(--font-family)' }}>
      <div className="text-center">
        <FileText className="w-16 h-16 text-primary mx-auto mb-6" />
        <h1 className="text-6xl font-semibold text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button className="bg-primary hover:bg-primary/90">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
