import projectData from '@/config/projects.json';
import type { Project, ProjectIcon, ProjectStatus } from './types';

export const PROJECT_MAP_SEED = 'mingxia-project-map-v1';

// 首页卡片的唯一数据源是 config/projects.json；编辑 JSON 即可增删改项目。
export const projects: Project[] = projectData.map((project) => ({
  ...project,
  status: project.status as ProjectStatus,
  icon: project.icon as ProjectIcon,
  weight: project.weight as Project['weight'],
}));
