const states = [
  { label: '已完成', className: 'bg-[var(--project-done)]' },
  { label: '进行中', className: 'bg-[var(--project-ongoing)]' },
  { label: '已暂停', className: 'bg-[var(--project-paused)]' },
  { label: '计划中', className: 'bg-[var(--project-planned)]' },
];

export function ProjectMapLegend() {
  return <ul className="project-map-legend" aria-label="项目状态图例">
    {states.map((state) => <li key={state.label}><span className={state.className} />{state.label}</li>)}
  </ul>;
}
