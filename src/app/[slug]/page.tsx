import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

// 在构建时获取所有可用的 slug
async function getAllSlugs(): Promise<string[]> {
  const contentDir = path.join(process.cwd(), 'public', 'content');
  try {
    const files = fs.readdirSync(contentDir);
    return files
      .filter((file) => file.endsWith('.md'))
      .map((file) => file.replace('.md', ''));
  } catch (error) {
    return [];
  }
}

// 为构建时预生成所有路由参数
export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

async function getMarkdownContent(slug: string) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'content', `${slug}.md`);
    const content = fs.readFileSync(filePath, 'utf-8');
    return content;
  } catch (error) {
    return null;
  }
}

// 从 MD 内容中提取第一个 H1 标题
function extractTitleFromMarkdown(content: string): string | null {
  // 匹配第一个 # 标题（H1）
  const match = content.match(/^#\s+(.+)$/m);
  if (match) {
    return match[1].trim();
  }
  // 如果没有找到 H1 标题，返回 null
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const markdownContent = await getMarkdownContent(slug);

  if (!markdownContent) {
    return {
      title: `${slug} - 白日梦`,
      description: `白日梦 - ${slug}`,
    };
  }

  // 尝试从 MD 内容中提取 H1 标题
  const h1Title = extractTitleFromMarkdown(markdownContent);
  const pageTitle = h1Title || slug;

  // 如果标题已经是 "白日梦"，则不再添加后缀
  if (pageTitle === '白日梦') {
    return {
      title: pageTitle,
      description: `白日梦`,
    };
  }

  return {
    title: `${pageTitle} - 白日梦`,
    description: `白日梦 - ${pageTitle}`,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const markdownContent = await getMarkdownContent(slug);

  if (!markdownContent) {
    notFound();
  }

  // 导入客户端组件
  const DynamicContent = (await import('./DynamicContent')).default;

  return <DynamicContent markdownContent={markdownContent} slug={slug} />;
}
