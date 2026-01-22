
import React from 'react';
import { GeneratedImage } from '../types';

interface WitchCardProps {
  image: GeneratedImage;
  onDownload: (url: string, id: string) => void;
}

const WitchCard: React.FC<WitchCardProps> = ({ image, onDownload }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 transition-all duration-500 hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-900/30">
      <div className="aspect-square w-full overflow-hidden bg-slate-950">
        <img 
          src={image.url} 
          alt={image.prompt}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100 p-6">
        <p className="text-xs text-slate-200 line-clamp-3 italic mb-4 font-inter font-light leading-relaxed">
          "{image.prompt}"
        </p>
        <div className="flex justify-between items-center border-t border-slate-800/50 pt-4">
          <span className="text-[10px] text-slate-500 font-cinzel tracking-wider">
            {new Date(image.timestamp).toLocaleDateString()}
          </span>
          <button 
            onClick={() => onDownload(image.url, image.id)}
            className="rounded-full bg-violet-600/20 p-2 text-violet-400 border border-violet-500/30 hover:bg-violet-600 hover:text-white transition-all duration-300"
            title="Download Conjuration"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WitchCard;
