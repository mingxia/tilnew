'use client';

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        {/* Logo 和网站名称 */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            {/* Logo 图标 */}
            <img
              src="/assets/byteday.svg"
              alt="Logo"
              className="w-12 h-12 rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-xs opacity-60 font-mono">Byte.Day</span>
              <h1 className="text-lg font-medium">白日梦</h1>
            </div>
          </div>
        </div>

        <a href="/" className="site-header-home">项目地图</a>
      </div>
    </header>
  );
}
