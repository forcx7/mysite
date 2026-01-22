
import React, { useState, useEffect } from 'react';
import { Post, Category, SectionType } from './types';
import { HeroIcon, SECTION_CONFIG, COLORS } from './constants';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionType>(SectionType.PRESENT);
  const [activeCategory, setActiveCategory] = useState<Category | '全部'>('全部');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedPosts = localStorage.getItem('unbounded_realm_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      const initialPosts: Post[] = [
        {
          id: '1',
          title: '众生亦我',
          content: '万象生长，不仅仅是草木的拔节，更是意志的共鸣。在这里，每一阵风都有回响，每一颗星都是引力。',
          category: '蝶野漫步' as Category,
          section: SectionType.PRESENT,
          timestamp: Date.now(),
          imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: '2',
          title: '万物森罗',
          content: '在无限的原野上，我们既是观察者，也是被观察的奇迹。生命的热度，就藏在那些不可遏制的瞬间。',
          category: '米悬的梦' as Category,
          section: SectionType.DISTANT,
          timestamp: Date.now() - 86400000,
          imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80'
        }
      ];
      setPosts(initialPosts);
      localStorage.setItem('unbounded_realm_posts', JSON.stringify(initialPosts));
    }
  }, []);

  const handleAddPost = (newPost: Omit<Post, 'id' | 'timestamp'>) => {
    const post: Post = {
      ...newPost,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    const newPosts = [post, ...posts];
    setPosts(newPosts);
    localStorage.setItem('unbounded_realm_posts', JSON.stringify(newPosts));
    setIsModalOpen(false);
  };

  const filteredPosts = posts.filter(post => {
    const sectionMatch = post.section === activeSection;
    const categoryMatch = activeCategory === '全部' || post.category === activeCategory;
    return sectionMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen pb-20">
      {/* Intense Powerful Header - Refined for Unconstrained Growth */}
      <header className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <HeroIcon />
          <div className="mt-16 text-center relative">
            <h1 className="flex flex-col items-center unconstrained-title">
              <span className="font-heavy text-5xl md:text-7xl text-slate-200 tracking-[0.4em] mb-[-0.3em] opacity-40 select-none">
                GROWTH OF ALL
              </span>
              <span className="font-brush text-8xl md:text-[11rem] text-slate-900 leading-none relative z-10 title-glow tracking-normal">
                蝶野：万象生长
              </span>
            </h1>
            <div className="relative mt-8 mb-12">
               <div className="w-64 h-3 bg-gradient-to-r from-orange-500 via-rose-500 to-emerald-500 mx-auto rounded-full blur-[1px]"></div>
               <div className="absolute inset-0 w-64 h-3 bg-white/40 blur-md mx-auto rounded-full animate-pulse"></div>
            </div>
            <p className="text-2xl md:text-3xl text-slate-500 font-bold leading-relaxed max-w-4xl mx-auto px-4 italic">
              在云朵里做梦，在草地上奔跑，在每一个日出里重新生长。
            </p>
          </div>
        </div>
      </header>

      {/* Grounded Navigation - Bold & Tactile */}
      <nav className="sticky top-10 z-50 py-4 px-6 mb-16">
        <div className="max-w-4xl mx-auto glass-card rounded-[3rem] p-4 flex flex-col md:flex-row items-center gap-8 border-2 border-white/80">
          <div className="flex bg-slate-100 p-2 rounded-[2rem] w-full md:w-auto">
            {[SectionType.PRESENT, SectionType.DISTANT].map(section => (
              <button
                key={section}
                onClick={() => { setActiveSection(section); setActiveCategory('全部'); }}
                className={`flex-1 md:flex-none px-14 py-4 rounded-2xl transition-all duration-700 text-sm font-black tracking-[0.2em] ${
                  activeSection === section 
                    ? 'bg-slate-900 text-white shadow-2xl scale-110' 
                    : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                {section}
              </button>
            ))}
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 px-2">
            {['全部', ...SECTION_CONFIG[activeSection]].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as Category | '全部')}
                className={`whitespace-nowrap px-8 py-2.5 rounded-2xl text-[10px] font-black transition-all border-2 tracking-widest ${
                  activeCategory === cat
                    ? 'border-orange-500 bg-orange-500 text-white shadow-xl'
                    : 'border-slate-100 bg-white text-slate-400 hover:border-slate-900 hover:text-slate-900'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Dynamic Content Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-14 space-y-14">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, idx) => (
              <PostCard key={post.id} post={post} index={idx} />
            ))
          ) : (
            <div className="col-span-full py-48 text-center">
               <div className="inline-block p-20 glass-card rounded-full animate-bounce border-4 border-orange-50">
                  <span className="text-8xl">🌱</span>
               </div>
               <p className="mt-16 text-slate-300 font-brush text-7xl">在此，等待万象的破局</p>
            </div>
          )}
        </div>
      </main>

      {/* Creation Center: Pulsing FAB */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-14 right-14 w-28 h-28 bg-slate-900 text-white rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.3)] hover:shadow-[0_40px_90px_rgba(249,115,22,0.4)] transition-all hover:scale-110 active:scale-90 flex items-center justify-center z-50 group border-4 border-orange-400/20"
      >
        <svg className="w-14 h-14 transition-all group-hover:scale-125" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
        </svg>
        <div className="absolute inset-0 bg-orange-500 rounded-[2.5rem] animate-ping opacity-10 group-hover:opacity-30"></div>
      </button>

      {/* Upload Modal - Immersive Creation Portal */}
      {isModalOpen && (
        <UploadModal 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleAddPost} 
          currentSection={activeSection}
        />
      )}

      {/* Footer - Profound & Unending */}
      <footer className="py-48 px-6 text-center border-t-2 border-slate-50 mt-32 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-heavy text-slate-50 mb-16 tracking-[1.2em] select-none opacity-50">INFINITE</h2>
          <div className="flex justify-center items-center gap-16 mb-16">
            <span className="w-24 h-[3px] bg-slate-900"></span>
            <p className="text-slate-900 text-lg font-black tracking-[0.8em] uppercase">蝶野 · 齐七 · 米悬</p>
            <span className="w-24 h-[3px] bg-slate-900"></span>
          </div>
          <p className="font-brush text-7xl md:text-[8rem] text-slate-900/5 leading-none italic pointer-events-none select-none">
            野蛮生长，不问西东
          </p>
        </div>
      </footer>
    </div>
  );
};

const PostCard: React.FC<{ post: Post, index: number }> = ({ post, index }) => {
  return (
    <article 
      className="break-inside-avoid power-bloom group glass-card rounded-[3.5rem] p-8 cursor-pointer overflow-hidden"
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      {post.imageUrl && (
        <div className="rounded-[2.8rem] overflow-hidden mb-10 relative aspect-[4/5] shadow-2xl">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover transition-all duration-[2.5s] group-hover:scale-115 group-hover:rotate-2 filter saturate-[1.1]" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-700"></div>
        </div>
      )}
      <div className="px-2">
        <div className="flex items-center gap-5 mb-8">
           <span className="px-6 py-2 bg-slate-900 text-white rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-xl">
              {post.category}
           </span>
           <time className="text-[11px] font-black text-slate-400 italic tracking-wider">
             {new Date(post.timestamp).toLocaleDateString()}
           </time>
        </div>
        <h3 className="text-4xl font-black mb-8 text-slate-800 leading-[1.1] group-hover:text-orange-600 transition-all">
          {post.title}
        </h3>
        <p className="text-slate-500 leading-relaxed text-lg font-medium opacity-80 group-hover:opacity-100 transition-opacity">
          {post.content}
        </p>
        <div className="mt-12 flex items-center gap-4">
           <div className="h-[2px] bg-slate-100 flex-1"></div>
           <div className="w-4 h-4 rounded-full border-2 border-orange-500 group-hover:bg-orange-500 transition-all duration-500"></div>
        </div>
      </div>
    </article>
  );
};

const UploadModal: React.FC<{ 
  onClose: () => void; 
  onSubmit: (post: Omit<Post, 'id' | 'timestamp'>) => void;
  currentSection: SectionType;
}> = ({ onClose, onSubmit, currentSection }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<Category>(SECTION_CONFIG[currentSection][0] as Category);
  const [section, setSection] = useState<SectionType>(currentSection);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    onSubmit({ title, content, imageUrl, category, section });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-3xl animate-in fade-in zoom-in-90 duration-500">
      <div className="bg-white w-full max-w-5xl rounded-[5rem] p-16 shadow-[0_60px_120px_rgba(0,0,0,0.4)] border-8 border-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-orange-500 via-rose-500 to-emerald-500"></div>
        
        <div className="flex justify-between items-start mb-16">
          <div>
            <h2 className="text-7xl font-brush text-slate-900">万象创造 <span className="text-orange-500 font-heavy text-3xl ml-6 tracking-widest opacity-30">CREATE</span></h2>
            <p className="text-slate-400 font-black mt-6 tracking-[0.4em] uppercase text-sm">赋予瞬间永恒的张力</p>
          </div>
          <button onClick={onClose} className="p-6 hover:bg-slate-50 rounded-full transition-all text-slate-200 hover:text-slate-900 hover:rotate-90">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] ml-8">归属于</label>
              <select 
                value={section} 
                onChange={(e) => {
                  const newSection = e.target.value as SectionType;
                  setSection(newSection);
                  setCategory(SECTION_CONFIG[newSection][0] as Category);
                }}
                className="w-full bg-slate-50 border-none rounded-[2.5rem] p-8 text-xl font-black focus:ring-8 focus:ring-orange-100 outline-none appearance-none transition-all cursor-pointer shadow-inner"
              >
                <option value={SectionType.PRESENT}>当下 PRESENT</option>
                <option value={SectionType.DISTANT}>远方 DISTANT</option>
              </select>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] ml-8">注入标签</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full bg-slate-50 border-none rounded-[2.5rem] p-8 text-xl font-black focus:ring-8 focus:ring-emerald-100 outline-none appearance-none transition-all cursor-pointer shadow-inner"
              >
                {SECTION_CONFIG[section].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] ml-8">命题</label>
            <input 
              placeholder="此刻的名字..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent border-b-8 border-slate-50 rounded-none py-8 text-6xl font-black focus:border-orange-500 outline-none placeholder:text-slate-100 text-slate-900 transition-all font-brush"
              required
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] ml-8">叙事</label>
            <textarea 
              placeholder="描述那些不可遏制的生长..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-[4rem] p-12 min-h-[280px] text-2xl leading-relaxed focus:ring-8 focus:ring-orange-500/5 outline-none placeholder:text-slate-200 text-slate-700 transition-all shadow-inner"
              required
            />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <label className="cursor-pointer flex items-center gap-10 group">
              <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center group-hover:bg-orange-50 transition-all border-4 border-dashed border-slate-200 relative overflow-hidden shadow-inner">
                {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" /> : <span className="text-5xl text-slate-100">+</span>}
              </div>
              <div className="text-left">
                <span className="text-xs font-black text-slate-400 group-hover:text-orange-600 transition-colors uppercase tracking-[0.4em] block mb-2">影像注入</span>
                <span className="text-[10px] text-slate-200 font-bold uppercase tracking-widest">Visual Feedback</span>
              </div>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            <button 
              type="submit" 
              className="w-full md:w-auto bg-slate-900 text-white px-24 py-10 rounded-[3rem] font-black text-3xl hover:bg-orange-600 hover:shadow-[0_40px_80px_rgba(249,115,22,0.4)] transition-all active:scale-95 shadow-2xl tracking-widest"
            >
              爆发绽放
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
