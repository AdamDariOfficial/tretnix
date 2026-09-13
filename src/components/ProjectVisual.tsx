import { StorageImage } from "@/components/StorageMedia";
import type { Project } from "@/lib/projects";

type ProjectVisualProps = {
  project: Project;
  className?: string;
};

export function ProjectVisual({ project, className = "" }: ProjectVisualProps) {
  if (project.image_url) {
    return (
      <StorageImage
        src={project.image_url}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover ${className}`}
      />
    );
  }

  if (project.slug === "forno-lume") {
    return (
      <div
        aria-hidden="true"
        className={`absolute inset-0 overflow-hidden bg-[#e8ddca] text-[#302c24] ${className}`}
      >
        <div className="absolute -right-[12%] -top-[14%] h-[62%] w-[70%] rounded-full bg-[#b75636]" />
        <div className="absolute right-[7%] top-[9%] h-[34%] w-[38%] rounded-t-full border border-[#f4ead8]/60 bg-[#d69a59]" />
        <div className="absolute -bottom-[16%] -left-[12%] h-[56%] w-[68%] rounded-full bg-[#626347]" />
        <div className="absolute bottom-[11%] left-[9%] h-[34%] w-[38%] rounded-t-full border border-[#d7ba78]/60 bg-[#f4ead8]" />
        <div className="absolute left-[8%] top-[8%] max-w-[56%]">
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[#5d563f]">
            Food &amp; Hospitality
          </p>
          <p className="font-serif mt-2 text-3xl leading-none sm:text-4xl">Forno Lume</p>
        </div>
        <div className="absolute right-[7%] top-[47%] h-px w-[34%] bg-[#302c24]/35" />
        <div className="absolute right-[7%] top-[51%] h-px w-[24%] bg-[#302c24]/25" />
      </div>
    );
  }

  if (project.slug === "rito-studio") {
    return (
      <div
        aria-hidden="true"
        className={`absolute inset-0 overflow-hidden bg-[#eee9e1] text-[#242126] ${className}`}
      >
        <div className="absolute -left-[18%] top-[14%] h-[54%] w-[62%] rounded-full border-[1.5rem] border-[#6f2336] sm:border-[2rem]" />
        <div className="absolute -right-[16%] -top-[10%] h-[62%] w-[60%] rounded-full bg-[#242126]" />
        <div className="absolute bottom-[8%] right-[8%] h-[38%] w-[34%] rounded-full border border-[#6f2336]/50 bg-[#c9b6ad]" />
        <div className="absolute bottom-[10%] left-[9%] max-w-[58%]">
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[#6f2336]">
            Beauty &amp; Wellness
          </p>
          <p className="font-serif mt-2 text-3xl leading-none sm:text-4xl">RITO Studio</p>
        </div>
        <div className="absolute left-[10%] top-[8%] h-px w-[30%] bg-[#242126]/35" />
        <div className="absolute left-[10%] top-[11%] h-px w-[20%] bg-[#242126]/25" />
      </div>
    );
  }

  return (
    <div aria-hidden="true" className={`absolute inset-0 ${project.gradient} ${className}`}>
      <div className="absolute inset-0 bg-grid opacity-30" />
    </div>
  );
}
