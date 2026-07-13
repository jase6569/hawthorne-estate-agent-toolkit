import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: string;
  description?: string;
  className?: string;
  action?: React.ReactNode;
};

export function SectionHeading({ title, description, className, action }: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        <h2 className="font-bricolage text-2xl font-semibold tracking-tight">{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}