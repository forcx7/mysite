
import React, { useState, useEffect } from 'react';
import { Post, Category, SectionType, ContentBlock, BlockType } from './types';
import { SECTION_CONFIG, COLORS } from './constants';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionType>(SectionType.PRESENT);
  const [activeCategory, setActiveCategory] = useState<Category | '全部'>('全部');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [viewingPost, setViewingPost] = useState<Post | null>(null);

  // 全局键盘监听：Esc 退出
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setViewingPost(null);
        setIsModalOpen(false);
        setEditingPost(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const savedPosts = localStorage.getItem('unbounded_realm_posts_v2');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      const initialPosts: Post[] = [
        {
          id: '1',
          title: '万象生长的第一眼',
          blocks: [
            { id: 'b1', type: 'text', value: '生命不该是封闭的孤岛，而应当是奔涌的江河。' },
            { id: 'b2', type: 'image', value: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80' },
            { id: 'b3', type: 'text', value: '当我看向一多花，花中亦有我的影子。这就是我奔放的热爱。' }
          ],
          category: '蝶野漫步' as Category,
          section: SectionType.PRESENT,
          timestamp: Date.now(),
        }
      ];
      setPosts(initialPosts);
      localStorage.setItem('unbounded_realm_posts_v2', JSON.stringify(initialPosts));
    }
  }, []);

  const handleSavePost = (postData: Omit<Post, 'id' | 'timestamp'>) => {
    let newPosts: Post[];
    if (editingPost) {
      newPosts = posts.map(p => p.id === editingPost.id ? { ...p, ...postData } : p);
    } else {
      const newPost: Post = {
        ...postData,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now()
      };
      newPosts = [newPost, ...posts];
    }
    setPosts(newPosts);
    localStorage.setItem('unbounded_realm_posts_v2', JSON.stringify(newPosts));
    setIsModalOpen(false);
    setEditingPost(null);
    if (viewingPost && viewingPost.id === (editingPost?.id || '')) {
       setViewingPost({ ...(viewingPost as Post), ...postData });
    }
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm('确定要抹除这段生长痕迹吗？')) {
      const newPosts = posts.filter(p => p.id !== id);
      setPosts(newPosts);
      localStorage.setItem('unbounded_realm_posts_v2', JSON.stringify(newPosts));
      if (viewingPost?.id === id) setViewingPost(null);
    }
  };

  const filteredPosts = posts.filter(post => {
    const sectionMatch = post.section === activeSection;
    const categoryMatch = activeCategory === '全部' || post.category === activeCategory;
    return sectionMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen pb-20">
      <header className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <div className="text-center relative">
            <h1 className="flex flex-col items-center unconstrained-title">
              <span className="font-heavy text-4xl md:text-5xl text-slate-300 tracking-[0.5em] mb-4 opacity-40 select-none uppercase">
                GROWTH OF ALL
              </span>
              <span className="font-cursive text-7xl md:text-9xl text-slate-900 leading-tight relative z-10 title-glow tracking-tight">
                万象生长
              </span>
            </h1>
            <div className="relative mt-10 mb-14">
               <div className="w-48 h-2 bg-gradient-to-r from-orange-500 via-rose-500 to-emerald-500 mx-auto rounded-full blur-[1px]"></div>
            </div>
            <p className="text-xl md:text-2xl text-slate-600 font-bold leading-relaxed max-w-4xl mx-auto px-4 italic">
              在云朵里做梦，在草地上奔跑，在每一个日出里重新生长。
            </p>
          </div>
        </div>
      </header>

      <nav className="sticky top-10 z-50 py-4 px-6 mb-20">
        <div className="max-w-5xl mx-auto glass-card rounded-[3.5rem] p-5 flex flex-col lg:flex-row items-center gap-10 border-2 border-white/90">
          <div className="flex bg-slate-200/50 p-2.5 rounded-[2.5rem] w-full lg:w-auto">
            {[SectionType.PRESENT, SectionType.DISTANT].map(section => (
              <button
                key={section}
                onClick={() => { setActiveSection(section); setActiveCategory('全部'); }}
                className={`flex-1 lg:flex-none px-16 py-5 rounded-[2rem] transition-all duration-500 text-xl font-black tracking-[0.1em] ${
                  activeSection === section 
                    ? 'bg-slate-900 text-white shadow-2xl scale-105' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {section}
              </button>
            ))}
          </div>

          <div className="flex gap-5 overflow-x-auto no-scrollbar py-2 px-2">
            {['全部', ...SECTION_CONFIG[activeSection]].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as Category | '全部')}
                className={`whitespace-nowrap px-10 py-3.5 rounded-2xl text-sm font-black transition-all border-2 tracking-widest ${
                  activeCategory === cat
                    ? 'border-orange-500 bg-orange-500 text-white shadow-xl'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-900 hover:text-slate-900'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-14 space-y-14">
          {filteredPosts.map((post, idx) => (
            <PostCard 
              key={post.id} 
              post={post} 
              index={idx} 
              onView={() => setViewingPost(post)}
              onEdit={() => { setEditingPost(post); setIsModalOpen(true); }}
              onDelete={() => handleDeletePost(post.id)}
            />
          ))}
        </div>
      </main>

      <button 
        onClick={() => { setEditingPost(null); setIsModalOpen(true); }}
        className="fixed bottom-14 right-14 w-28 h-28 bg-slate-900 text-white rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.3)] hover:shadow-[0_40px_90px_rgba(249,115,22,0.4)] transition-all hover:scale-110 active:scale-90 flex items-center justify-center z-50 group border-4 border-orange-400/20"
        title="爆发绽放 (Add Moment)"
      >
        <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
      </button>

      {viewingPost && (
        <PostDetailModal 
          post={viewingPost} 
          onClose={() => setViewingPost(null)} 
          onEdit={() => { setEditingPost(viewingPost); setIsModalOpen(true); }}
          onDelete={() => handleDeletePost(viewingPost.id)}
        />
      )}

      {isModalOpen && (
        <UploadModal 
          onClose={() => { setIsModalOpen(false); setEditingPost(null); }} 
          onSubmit={handleSavePost} 
          currentSection={activeSection}
          editData={editingPost}
        />
      )}

      <footer className="py-48 px-6 text-center mt-32 relative">
        <p className="font-brush text-5xl md:text-8xl text-slate-900 leading-normal italic inline-block title-glow">
          野蛮生长，不问西东
        </p>
      </footer>
    </div>
  );
};

const PostCard: React.FC<{ 
  post: Post, 
  index: number, 
  onView: () => void,
  onEdit: () => void, 
  onDelete: () => void 
}> = ({ post, index, onView, onEdit, onDelete }) => {
  const firstImage = post.blocks.find(b => b.type === 'image')?.value;
  const firstText = post.blocks.find(b => b.type === 'text')?.value;

  return (
    <article 
      onClick={onView}
      className="break-inside-avoid power-bloom group glass-card rounded-[3.5rem] p-8 cursor-pointer border-2 border-white/50 relative mb-14"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="absolute top-10 right-10 flex gap-3 z-20 opacity-0 group-hover:opacity-100 transition-all">
        <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="w-12 h-12 bg-white/90 rounded-2xl flex items-center justify-center text-slate-700 hover:text-orange-600 shadow-xl transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="w-12 h-12 bg-white/90 rounded-2xl flex items-center justify-center text-slate-700 hover:text-rose-600 shadow-xl transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2.0 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
      </div>

      {firstImage && (
        <div className="rounded-[2.8rem] overflow-hidden mb-10 aspect-[4/5] shadow-2xl">
          <img src={firstImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={post.title} />
        </div>
      )}
      <div className="px-2 text-left">
        <span className="px-6 py-2 bg-slate-900 text-white rounded-2xl text-[10px] font-black tracking-widest uppercase mb-6 inline-block">
          {post.category}
        </span>
        <h3 className="text-4xl font-black mb-6 text-slate-900 leading-tight group-hover:text-orange-600 transition-all">
          {post.title}
        </h3>
        <p className="text-slate-700 leading-relaxed text-lg line-clamp-3 italic opacity-80">
          {firstText}
        </p>
      </div>
    </article>
  );
};

const PostDetailModal: React.FC<{ 
  post: Post, 
  onClose: () => void, 
  onEdit: () => void,
  onDelete: () => void
}> = ({ post, onClose, onEdit, onDelete }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/95 backdrop-blur-3xl p-4 md:p-10 overflow-y-auto animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl rounded-[4rem] min-h-screen md:min-h-0 md:my-10 relative shadow-[0_100px_150px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-500">
        
        {/* Floating Close Button */}
        <div className="absolute top-10 right-10 flex gap-4 z-50">
          <button 
            onClick={onEdit} 
            className="p-6 bg-white shadow-2xl rounded-3xl text-slate-900 hover:text-orange-600 transition-all active:scale-90 hover:rotate-12"
            title="编辑文章 (Edit)"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </button>
          <button 
            onClick={onClose} 
            className="p-6 bg-slate-900 text-white rounded-3xl shadow-2xl hover:bg-orange-600 transition-all active:scale-90 group"
            title="退出阅读 (Esc)"
          >
            <svg className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-10 md:p-24">
          <header className="mb-20">
            <div className="flex flex-wrap items-center gap-6 mb-12">
               <span className="px-8 py-3 bg-slate-100 text-slate-900 rounded-2xl text-sm font-black tracking-widest uppercase">
                  {post.section} / {post.category}
               </span>
               <time className="text-xl font-black text-slate-300 italic">
                 {new Date(post.timestamp).toLocaleDateString()}
               </time>
            </div>
            <h2 className="text-6xl md:text-8xl font-cursive text-slate-900 leading-tight title-glow">
              {post.title}
            </h2>
          </header>

          <div className="space-y-16">
            {post.blocks.map((block) => (
              <div key={block.id} className="animate-in slide-in-from-bottom-10 fade-in duration-1000">
                {block.type === 'text' ? (
                  <p className="text-2xl md:text-3xl text-slate-800 leading-[1.8] font-medium whitespace-pre-wrap selection:bg-orange-100 italic">
                    {block.value}
                  </p>
                ) : (
                  <div className="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white group relative">
                    <img src={block.value} className="w-full object-cover max-h-[85vh]" alt="Captured Moment" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <footer className="mt-32 pt-16 border-t-4 border-slate-50 flex flex-col md:flex-row justify-between items-center gap-10 opacity-60">
             <div className="flex items-center gap-4">
                <div className="w-12 h-1 bg-orange-500 rounded-full"></div>
                <span className="font-brush text-3xl text-slate-900">自在奔放 · 万象共鸣</span>
             </div>
             <div className="flex gap-10">
                <button onClick={() => { if(window.confirm('要抹除这段珍贵的记忆吗？')) { onDelete(); onClose(); } }} className="text-rose-500 font-black tracking-widest text-xs uppercase hover:underline">ERASE MOMENT</button>
                <button onClick={onClose} className="text-slate-900 font-black tracking-widest text-xs uppercase hover:underline">BACK TO EARTH (ESC)</button>
             </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

const UploadModal: React.FC<{ 
  onClose: () => void; 
  onSubmit: (post: Omit<Post, 'id' | 'timestamp'>) => void;
  currentSection: SectionType;
  editData?: Post | null;
}> = ({ onClose, onSubmit, currentSection, editData }) => {
  const [title, setTitle] = useState(editData?.title || '');
  const [blocks, setBlocks] = useState<ContentBlock[]>(editData?.blocks || [{ id: '1', type: 'text', value: '' }]);
  const [category, setCategory] = useState<Category>(editData?.category || SECTION_CONFIG[currentSection][0] as Category);
  const [section, setSection] = useState<SectionType>(editData?.section || currentSection);

  const addBlock = (type: BlockType) => {
    setBlocks([...blocks, { id: Math.random().toString(), type, value: '' }]);
  };

  const updateBlock = (id: string, value: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, value } : b));
  };

  const removeBlock = (id: string) => {
    if (blocks.length > 1) setBlocks(blocks.filter(b => b.id !== id));
  };

  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateBlock(id, reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-3xl animate-in fade-in duration-500">
      <div className="bg-white w-full max-w-6xl rounded-[5rem] p-10 md:p-20 shadow-[0_60px_120px_rgba(0,0,0,0.5)] overflow-y-auto max-h-[95vh] relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose} 
          className="absolute top-10 right-10 p-6 text-slate-300 hover:text-slate-900 transition-all hover:rotate-90"
          title="关闭编辑 (Esc)"
        >
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        <header className="mb-20 text-center md:text-left">
          <h2 className="text-7xl font-cursive text-slate-900">{editData ? '重塑万象' : '万象创造'}</h2>
          <p className="text-slate-400 font-black mt-6 tracking-[0.3em] uppercase">无限生长 · 思想不设限</p>
        </header>

        <form onSubmit={(e) => { e.preventDefault(); if(title) onSubmit({ title, blocks, category, section }); }} className="space-y-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">主轴 Section</label>
              <select value={section} onChange={(e) => { setSection(e.target.value as SectionType); setCategory(SECTION_CONFIG[e.target.value as SectionType][0] as Category); }} className="w-full bg-slate-50 border-none rounded-[2.5rem] p-8 text-xl font-black focus:ring-4 focus:ring-orange-100 outline-none appearance-none transition-all">
                <option value={SectionType.PRESENT}>当下 PRESENT</option>
                <option value={SectionType.DISTANT}>远方 DISTANT</option>
              </select>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">格调 Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="w-full bg-slate-50 border-none rounded-[2.5rem] p-8 text-xl font-black focus:ring-4 focus:ring-orange-100 outline-none appearance-none transition-all">
                {SECTION_CONFIG[section].map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">命题 Title</label>
             <input placeholder="此刻的名字..." value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-transparent border-b-4 border-slate-100 py-6 text-6xl font-black outline-none focus:border-orange-500 placeholder:text-slate-100 text-slate-900 font-cursive transition-colors" required />
          </div>

          <div className="space-y-10">
            {blocks.map((block, idx) => (
              <div key={block.id} className="relative group bg-slate-50/50 p-6 md:p-10 rounded-[4rem] border-2 border-transparent hover:border-slate-100 transition-all">
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-slate-100 text-6xl font-black select-none italic hidden lg:block">0{idx + 1}</div>
                <button type="button" onClick={() => removeBlock(block.id)} className="absolute -right-4 -top-4 w-12 h-12 bg-white shadow-xl rounded-full text-rose-500 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center border-2 border-rose-50 hover:bg-rose-500 hover:text-white" title="移除该块">×</button>
                
                {block.type === 'text' ? (
                  <textarea 
                    placeholder="在此书写不设限的思想..."
                    value={block.value}
                    onChange={(e) => updateBlock(block.id, e.target.value)}
                    className="w-full bg-transparent p-6 text-2xl leading-relaxed min-h-[200px] outline-none placeholder:text-slate-200 italic"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-6 py-10">
                    {block.value ? (
                      <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group/img max-w-3xl mx-auto">
                        <img src={block.value} className="w-full object-cover max-h-[500px]" alt="Editor Content" />
                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white font-black uppercase tracking-widest">
                           更换影像 Change Image
                           <input type="file" accept="image/*" onChange={(e) => handleImageUpload(block.id, e)} className="hidden" />
                        </label>
                      </div>
                    ) : (
                      <label className="w-full h-64 bg-white border-4 border-dashed border-slate-200 rounded-[4rem] flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all group/upload">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover/upload:scale-125 transition-transform">
                          <span className="text-4xl text-slate-200">+</span>
                        </div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">注入影像 Fragment</span>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(block.id, e)} className="hidden" />
                      </label>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-6 justify-center pb-10">
            <button type="button" onClick={() => addBlock('text')} className="px-14 py-8 bg-slate-100 rounded-[2.5rem] font-black hover:bg-slate-900 hover:text-white transition-all scale-100 active:scale-95 uppercase tracking-widest text-sm shadow-sm border-2 border-transparent hover:border-white">+ 文字 Text Block</button>
            <button type="button" onClick={() => addBlock('image')} className="px-14 py-8 bg-slate-100 rounded-[2.5rem] font-black hover:bg-slate-900 hover:text-white transition-all scale-100 active:scale-95 uppercase tracking-widest text-sm shadow-sm border-2 border-transparent hover:border-white">+ 影像 Image Block</button>
          </div>

          <button type="submit" className="w-full bg-slate-900 text-white py-14 rounded-[4rem] text-4xl font-black hover:bg-orange-600 transition-all shadow-[0_40px_80px_rgba(0,0,0,0.2)] hover:shadow-[0_40px_80px_rgba(249,115,22,0.4)] tracking-[0.1em] uppercase group">
            {editData ? '更新生长 · UPDATE' : '爆发绽放 · BLOOM'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
