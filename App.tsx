
import React, { useState, useCallback, useEffect } from 'react';
import { WitchArchetype, GeneratedImage, GenerationParams } from './types';
import { generateWitchImage } from './services/geminiService';
import WitchCard from './components/WitchCard';

const ARCHETYPES = Object.values(WitchArchetype);
const ASPECT_RATIOS = ["1:1", "4:3", "16:9", "9:16"] as const;

const App: React.FC = () => {
  const [params, setParams] = useState<GenerationParams>({
    prompt: '',
    archetype: WitchArchetype.MOON,
    aspectRatio: '1:1'
  });
  
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Consulting the crystal ball...');

  const loadingMessages = [
    'Brewing the elixir...',
    'Summoning the spirits...',
    'Aligning the constellations...',
    'Whispering to the ravens...',
    'Incanting the sacred verses...',
    'Drawing the ritual circle...'
  ];

  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingMessage(prev => {
          const currentIndex = loadingMessages.indexOf(prev);
          return loadingMessages[(currentIndex + 1) % loadingMessages.length];
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!params.prompt && !params.archetype) return;

    setIsGenerating(true);
    setError(null);
    
    try {
      const imageUrl = await generateWitchImage(params);
      const newImage: GeneratedImage = {
        id: crypto.randomUUID(),
        url: imageUrl,
        prompt: params.prompt || params.archetype,
        timestamp: Date.now(),
        model: 'gemini-2.5-flash-image'
      };
      setImages(prev => [newImage, ...prev]);
    } catch (err: any) {
      setError(err.message || "The ritual failed. The spirits are silent.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = useCallback((url: string, id: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `witching-hour-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-violet-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center glow-purple">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-cinzel font-bold tracking-widest uppercase text-violet-400">Witching Hour</h1>
          </div>
          <p className="text-slate-400 text-sm italic font-cinzel">"Conjure your mystical vision..."</p>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12 space-y-16">
        
        {/* Generator Section */}
        <section>
          <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-[100px] -z-10 rounded-full"></div>
            
            <form onSubmit={handleGenerate} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                
                {/* Archetype Selection */}
                <div className="space-y-3">
                  <label className="text-xs font-cinzel uppercase tracking-wider text-slate-500 font-bold">Witch Archetype</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ARCHETYPES.map(arch => (
                      <button
                        key={arch}
                        type="button"
                        onClick={() => setParams(p => ({ ...p, archetype: arch }))}
                        className={`px-3 py-2 text-[10px] sm:text-xs rounded-md border transition-all duration-300 uppercase tracking-tighter ${
                          params.archetype === arch 
                            ? 'bg-violet-600/20 border-violet-500 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
                            : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 text-slate-400'
                        }`}
                      >
                        {arch}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prompt Input */}
                <div className="lg:col-span-2 space-y-3">
                  <label className="text-xs font-cinzel uppercase tracking-wider text-slate-500 font-bold">Custom Incantation</label>
                  <textarea
                    value={params.prompt}
                    onChange={(e) => setParams(p => ({ ...p, prompt: e.target.value }))}
                    placeholder="Describe her magic, her familiar, her surroundings..."
                    className="w-full h-[114px] bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50 resize-none transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-800">
                <div className="flex flex-wrap gap-6 items-center">
                  <div className="flex gap-4 items-center">
                    <span className="text-[10px] font-cinzel uppercase tracking-wider text-slate-500">Aspect Ratio</span>
                    <div className="flex gap-1">
                      {ASPECT_RATIOS.map(ratio => (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() => setParams(p => ({ ...p, aspectRatio: ratio }))}
                          className={`w-10 h-8 flex items-center justify-center text-[10px] rounded border transition-all ${
                            params.aspectRatio === ratio 
                              ? 'bg-violet-600 text-white border-violet-500' 
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                          }`}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className={`group relative flex items-center gap-3 px-10 py-4 rounded-full font-cinzel font-bold tracking-[0.2em] uppercase transition-all overflow-hidden ${
                    isGenerating 
                      ? 'bg-slate-800 cursor-not-allowed text-slate-500 shadow-inner' 
                      : 'bg-violet-600 hover:bg-violet-500 text-white glow-purple active:scale-95'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-violet-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-xs">{loadingMessage}</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 01-.586 1.414l-2.828 2.828A2 2 0 0012 15.828V20" />
                      </svg>
                      <span>Cast Spell</span>
                    </>
                  )}
                </button>
              </div>
              
              {error && (
                <div className="bg-red-950/40 border border-red-900/50 p-4 rounded-xl text-red-400 text-xs text-center font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                  {error}
                </div>
              )}
            </form>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-cinzel font-bold tracking-[0.3em] uppercase text-slate-400">The Grimoire</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-800 to-transparent"></div>
          </div>

          {images.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
              <div className="mb-4 text-slate-700 flex justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                 </svg>
              </div>
              <p className="text-slate-600 font-cinzel italic tracking-wider">No visions have been summoned from the void yet...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {images.map(img => (
                <WitchCard 
                  key={img.id} 
                  image={img} 
                  onDownload={handleDownload}
                />
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900/50 bg-black/20 py-12 px-4 text-center mt-20">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
          <p className="text-slate-500 text-[10px] font-cinzel tracking-[0.4em] uppercase">
            Witching Hour &bull; Crafted by Gemini Flash Magicks
          </p>
          <p className="text-slate-700 text-[8px] max-w-sm">
            Harnessing the celestial alignment of Gemini 2.5 Flash Image. All summoned spirits are manifestations of digital consciousness.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
