'use client';

import { useState } from 'react';
import { ArrowRight, Check, ChevronDown, ClipboardCopy, FileArchive, FileImage, Files, FileSpreadsheet, HeartHandshake, MessageCircle, MousePointerClick, Search, ShieldCheck, Sparkles, X } from 'lucide-react';
import './xiaobangban.css';

type Category = '全部服务' | 'PDF 文件' | '图片处理' | '文档表格' | '代查代找';
const categories: Category[] = ['全部服务', 'PDF 文件', '图片处理', '文档表格', '代查代找'];
const services = [
  { id: 'merge', title: '合并 PDF', description: '多个 PDF 合成一个，按你希望的顺序排好。', price: '¥3', category: 'PDF 文件' as Category, icon: Files, note: '基础价适用于 10 个以内常规文件。' },
  { id: 'split', title: '拆分 PDF', description: '提取指定页码，或按页拆成多个文件。', price: '¥3', category: 'PDF 文件' as Category, icon: FileArchive, note: '告诉我们需要保留哪些页即可。' },
  { id: 'compress', title: '压缩 PDF', description: '尽可能缩小文件，方便上传和发送。', price: '¥3', category: 'PDF 文件' as Category, icon: FileArchive, note: '压缩效果取决于原文件内容。' },
  { id: 'editpdf', title: 'PDF 页面整理', description: '旋转、删除页面，调整页面顺序。', price: '¥3 起', category: 'PDF 文件' as Category, icon: Files, note: '修改较多的文件会提前报价。' },
  { id: 'picformat', title: '图片格式转换', description: 'JPG、PNG、WebP 等常见格式互转。', price: '¥2 起', category: '图片处理' as Category, icon: FileImage, note: '批量图片按数量确认价格。' },
  { id: 'picpdf', title: '图片转 PDF', description: '把照片、扫描图整理成一个 PDF。', price: '¥3', category: '图片处理' as Category, icon: FileImage, note: '可按需要排序和调整方向。' },
  { id: 'resize', title: '图片尺寸调整', description: '改大小、裁剪、压缩，适配上传要求。', price: '¥3 起', category: '图片处理' as Category, icon: FileImage, note: '请提供平台要求的尺寸或大小。' },
  { id: 'docs', title: '文档格式整理', description: '处理常见格式转换和简单排版问题。', price: '¥5 起', category: '文档表格' as Category, icon: FileSpreadsheet, note: '先查看文件，确认可处理再报价。' },
  { id: 'sheets', title: '简单表格整理', description: '清理重复项、调整列顺序、规范格式。', price: '先报价', category: '文档表格' as Category, icon: FileSpreadsheet, note: '根据表格行数与处理要求报价。' },
  { id: 'find', title: '帮我找资料', description: '找公开资料、合法电子书来源、官方入口。', price: '先报价', category: '代查代找' as Category, icon: Search, note: '只提供合法公开的获取途径；可先约定费用上限。' },
];

export default function Home() {
  const [category, setCategory] = useState<Category>('全部服务');
  const [selected, setSelected] = useState<(typeof services)[number] | null>(null);
  const [copied, setCopied] = useState(false);
  const visible = category === '全部服务' ? services : services.filter((item) => item.category === category);
  const contactCopy = selected
    ? `你好，我想咨询小帮办的「${selected.title}」服务。我的需求是：`
    : '你好，我想咨询小帮办的服务。我的需求是：';

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(contactCopy);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="xb-site" id="top">
      <header className="xb-header">
        <div className="xb-wrap xb-header-inner">
          <a href="#top" className="xb-brand" aria-label="小帮办首页"><span className="xb-brand-icon"><HeartHandshake size={23} strokeWidth={2.1} /></span><span>小帮办<span className="xb-brand-dot">.</span></span></a>
          <nav className="xb-nav" aria-label="主导航"><a href="#services">服务清单</a><a href="#how">怎么下单</a><a href="#contact" className="xb-nav-cta">联系小帮办 <ArrowRight size={15} /></a></nav>
        </div>
      </header>

      <section className="xb-hero">
        <div className="xb-wrap xb-hero-grid">
          <div className="xb-hero-copy">
            <div className="xb-eyebrow"><span className="xb-pulse" /> 一点小事，我们帮你办好</div>
            <h1>电脑上的麻烦事，<br/><span>交给小帮办。</span></h1>
            <p className="xb-lead">合并几个 PDF、转换图片、整理文件、找份资料……<br className="xb-desktop-break" />不用研究教程，也不用到处找工具。把需求告诉我们，办好再付款。</p>
            <div className="xb-hero-actions"><a href="#services" className="xb-primary">看看能帮你做什么 <ArrowRight size={18} /></a><a href="#how" className="xb-text-link">第一次使用？了解流程 <ArrowRight size={16} /></a></div>
            <div className="xb-trust-line"><span><Check size={16} /> 小事几元起</span><span><Check size={16} /> 先确认价格</span><span><Check size={16} /> 验收后付款</span></div>
          </div>
          <div className="xb-hero-art" aria-hidden="true">
            <div className="xb-art-grid" />
            <div className="xb-art-note xb-art-note-top"><Sparkles size={17} /> 事情虽小，也值得认真办</div>
            <div className="xb-art-window"><div className="xb-art-window-bar"><i/><i/><i/><span>今日的小事</span></div><div className="xb-art-task"><span className="xb-art-task-icon"><Files size={23}/></span><div><strong>把这几份 PDF 合在一起</strong><small>文件整理 · 简单又省心</small></div></div><div className="xb-art-divider"/><div className="xb-art-status"><span><span className="xb-art-check"><Check size={15}/></span> 已帮你处理好啦</span><strong>¥3</strong></div></div>
            <div className="xb-art-note xb-art-note-bottom"><ShieldCheck size={17}/> 看过结果，满意再付</div>
            <div className="xb-art-flower">✳</div>
          </div>
        </div>
      </section>

      <section className="xb-services-section" id="services">
        <div className="xb-wrap">
          <div className="xb-section-intro"><div><span className="xb-kicker">WHAT WE CAN DO</span><h2>小事清单 <span>10 项</span></h2><p>从最常用的小事开始。点开服务，看看能帮你做什么。</p></div><span className="xb-section-aside">清楚的价格，简单的交付。</span></div>
          <div className="xb-filters" role="group" aria-label="服务分类">{categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className={category === item ? 'xb-filter active' : 'xb-filter'}>{item}</button>)}</div>
          <div className="xb-service-grid">{visible.map((item) => { const Icon = item.icon; return <button key={item.id} type="button" className="xb-service-card" onClick={() => setSelected(item)}><span className="xb-service-icon"><Icon size={23} strokeWidth={1.8}/></span><span className="xb-service-title">{item.title}<ArrowRight size={17} className="xb-service-arrow" /></span><span className="xb-service-desc">{item.description}</span><span className="xb-service-bottom"><span className="xb-service-price">{item.price}</span><span className="xb-service-detail">查看服务 <ArrowRight size={14}/></span></span></button>; })}</div>
          <div className="xb-custom"><span className="xb-custom-icon"><MessageCircle size={22}/></span><div><strong>没找到你要办的事？</strong><p>没关系，先说说需求。能不能做、怎么收费，我们会提前讲清楚。</p></div><a href="#contact">问问小帮办 <ArrowRight size={17}/></a></div>
        </div>
      </section>

      <section className="xb-how-section" id="how"><div className="xb-wrap"><div className="xb-how-heading"><span className="xb-kicker">HOW IT WORKS</span><h2>只要三步，事情办妥。</h2><p>不需要注册账号，也不用填一大堆表。</p></div><div className="xb-steps"><div><span className="xb-step-no">01</span><span className="xb-step-icon"><MessageCircle size={25}/></span><h3>微信说需求</h3><p>把想做的事和相关文件发来。我们确认能否处理、价格和时间。</p></div><div><span className="xb-step-no">02</span><span className="xb-step-icon"><MousePointerClick size={25}/></span><h3>我们帮你办</h3><p>按约定处理，有不清楚的地方先问你，不擅自加价。</p></div><div><span className="xb-step-no">03</span><span className="xb-step-icon"><ShieldCheck size={25}/></span><h3>验收后付款</h3><p>查看交付结果，确认符合约定后再支付服务费。</p></div></div></div></section>

      <section className="xb-contact-section" id="contact"><div className="xb-wrap"><div className="xb-contact-panel"><div><span className="xb-kicker">LET US HELP</span><h2>你有件小事，<br/>刚好我们能帮忙。</h2><p>现在采用微信人工接单。先聊清楚，再决定要不要办。</p><div className="xb-contact-tags"><span>不强制注册</span><span>不提前收费</span><span>超出范围先报价</span></div></div><div className="xb-contact-card"><span className="xb-contact-card-icon"><MessageCircle size={29}/></span><h3>添加微信，聊聊需求</h3><p>微信联系方式即将公布。在此之前，你可以先复制咨询话术，方便之后发送。</p><button type="button" onClick={copyMessage} className="xb-copy-button">{copied ? <Check size={17}/> : <ClipboardCopy size={17}/>} {copied ? '已复制咨询话术' : '复制咨询话术'}</button><small>试运营期间，暂不提供网页下单。</small></div></div></div></section>

      <footer className="xb-footer"><div className="xb-wrap xb-footer-inner"><span className="xb-footer-brand">小帮办<span> · 把小事办好</span></span><p>实际费用及交付时间以微信确认内容为准。请勿发送密码、验证码等敏感信息。</p><a href="#top">回到顶部 ↑</a></div></footer>

      {selected && <div className="xb-modal-backdrop" onMouseDown={(event) => { if(event.target === event.currentTarget) setSelected(null); }}><section className="xb-modal" role="dialog" aria-modal="true" aria-labelledby="xb-modal-title"><button type="button" className="xb-modal-close" onClick={() => setSelected(null)} aria-label="关闭"><X size={19}/></button><span className="xb-kicker">{selected.category}</span><h2 id="xb-modal-title">{selected.title}</h2><p className="xb-modal-description">{selected.description}</p><div className="xb-modal-info"><span>参考服务费</span><strong>{selected.price}</strong></div><p className="xb-modal-note"><ShieldCheck size={17}/> {selected.note} 开始前会先确认最终价格和交付范围。</p><div className="xb-modal-contact"><h3>怎样下单？</h3><p>加微信说明需求，确认可处理和价格后开始，交付验收后付款。微信联系方式即将公布。</p><button type="button" className="xb-primary xb-modal-copy" onClick={copyMessage}>{copied ? <Check size={17}/> : <ClipboardCopy size={17}/>} {copied ? '咨询话术已复制' : '复制这项服务的咨询话术'}</button></div></section></div>}
    </main>
  );
}
