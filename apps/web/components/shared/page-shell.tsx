import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <h1 className="text-2xl font-black tracking-tight uppercase">{title}</h1>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ title, description, children, className }: SectionProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

interface ActionAreaProps {
  children: React.ReactNode;
  className?: string;
}

export function ActionArea({ children, className }: ActionAreaProps) {
  return (
    <div className={cn("pt-6", className)}>
      {children}
    </div>
  );
}
