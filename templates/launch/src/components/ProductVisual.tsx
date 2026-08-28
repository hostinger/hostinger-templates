import { siteContent } from "@/content/site";

export function ProductVisual() {
  const visual = siteContent.productVisual;

  return (
    <div className="product-visual" aria-label={`${visual.campaign} ${visual.label}`}>
      <div className="visual-topline">
        <span>{visual.label}</span>
        <span className="live-dot">{visual.status}</span>
      </div>
      <div className="visual-title">
        <span className="orbit-mark" aria-hidden="true" />
        <strong>{visual.campaign}</strong>
        <svg viewBox="0 0 54 24" aria-hidden="true">
          <path d="M2 20C13 4 28 4 52 3" />
          <path d="m43 1 9 2-6 7" />
        </svg>
      </div>
      <div className="visual-grid">
        {visual.stats.map((value, index) => (
          <div className="visual-stat" key={visual.statLabels[index]}>
            <strong>{value}</strong>
            <span>{visual.statLabels[index]}</span>
          </div>
        ))}
      </div>
      <div className="visual-tasks">
        {visual.tasks.map((task, index) => (
          <div key={task}>
            <span aria-hidden="true">{index < 2 ? "✓" : "→"}</span>
            {task}
          </div>
        ))}
      </div>
      <div className="visual-stamp" aria-hidden="true">
        READY
        <br />
        TO RUN
      </div>
    </div>
  );
}
