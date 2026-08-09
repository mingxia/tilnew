import type { Project } from './types';

export const PROJECT_MAP_SEED = 'mingxia-project-map-v1';

export const projects: Project[] = [
  { id: 'songs', slug: 'songs', title: '权当为歌', description: '写了许多年的原创歌曲集', status: 'done', weight: 2, year: 2013, icon: 'music', href: '/songs' },
  { id: 'hiwaldorf', slug: 'hiwaldorf', title: 'HiWaldorf', description: '华德福教育中文媒体与社区', status: 'active', weight: 4, year: 2014, icon: 'heart', href: 'https://hiwaldorf.com' },
  { id: 'darkness', slug: 'darkness', title: '黑暗传', description: '汉民族创世史诗的整理与维护', status: 'active', weight: 4, year: 2016, icon: 'book', href: '/darkness' },
  { id: 'four-seasons', slug: 'sishiyayun', title: '四时雅韵', description: '一套跨越四季的古诗文选集', status: 'done', weight: 3, year: 2017, icon: 'feather', href: '/sishiyayun' },
  { id: 'school', slug: 'school', title: '小人物学校', description: '关于终身学习的一次公开构想', status: 'done', weight: 2, year: 2018, icon: 'school', href: '/school' },
  { id: 'xian', slug: 'xian', title: '开放城市计划', description: '关于西安与城市未来的观察', status: 'done', weight: 2, year: 2019, icon: 'map', href: '/xian' },
  { id: 'mingfeng', slug: 'mingfeng', title: '鸣风书局', description: '在黄田古村里，慢慢建一间书店', status: 'active', weight: 4, year: 2021, icon: 'home', href: '/mingfeng' },
  { id: 'letters', slug: 'letters', title: '二十四分之一', description: '写给时间，也写给远方的书信', status: 'active', weight: 2, year: 2021, icon: 'feather', href: '/letters' },
  { id: 'opera', slug: 'opera-book', title: '小戏迷的第一本戏曲书', description: '为孩子编的一本戏曲入门书', status: 'done', weight: 3, year: 2025, icon: 'book' },
  { id: 'storybox', slug: 'storybox', title: '故事盒子', description: '把值得流传的故事重新讲给孩子', status: 'active', weight: 5, year: 2025, icon: 'sparkles', href: 'https://gushihezi.com' },
  { id: 'star-box', slug: 'star-box', title: '装星星的盒子', description: '一个还在夜里发亮的故事想法', status: 'idea', weight: 2, year: 2027, icon: 'sparkles' },
  { id: 'village-stories', slug: 'village-stories', title: '狗村与猫村', description: '关于两个村庄的长篇故事', status: 'idea', weight: 3, year: 2028, icon: 'home' },
  { id: 'palace-gate', slug: 'palace-gate', title: '宫门', description: '一部仍在等待开篇的故事', status: 'idea', weight: 2, year: 2029, icon: 'feather' },
];
