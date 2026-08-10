const states = [
  { label: '已完成', className: 'status-done' },
  { label: '进行中', className: 'status-ongoing' },
  { label: '计划中', className: 'status-planned' },
  { label: '已暂停', className: 'status-paused' },
];

export function ProjectMapLegend() {
  return <ul className="project-map-legend" aria-label="项目状态图例">
    {states.map((state) => <li key={state.label}><span className={state.className} />{state.label}</li>)}
  </ul>;
}
