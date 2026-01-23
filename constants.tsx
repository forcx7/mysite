
import React from 'react';
import { SectionType } from './types';

export const COLORS = {
  primary: '#f97316', 
  secondary: '#0ea5e9', 
  accent: '#10b981', 
  gold: '#fbbf24', 
  text: '#1e293b',
};

export const SECTION_CONFIG = {
  [SectionType.PRESENT]: ['齐七的诗', '蝶野漫步', '周身光影'],
  [SectionType.DISTANT]: ['米悬的梦', '未至草原', '晨曦初现', '待定']
};

export const HeroIcon = () => (
  <div className="relative group cursor-pointer">
    <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-rose-400 rounded-full blur-[50px] group-hover:blur-[80px] transition-all opacity-40 animate-pulse"></div>
    <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center relative z-10 border-4 border-orange-100 shadow-[0_25px_50px_rgba(249,115,22,0.3)] group-hover:scale-110 transition-transform duration-700">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-rose-500 to-emerald-500 rounded-full animate-spin-slow"></div>
    </div>
  </div>
);
