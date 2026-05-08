
import React, { useState, useRef } from 'react';
import { analyzeCricketVideo } from '../services/gemini';

const VideoAnalysis: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setVideoUrl(URL.createObjectURL(selectedFile));
      setAnalysis('');
    }
  };

  const processVideo = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const result = await analyzeCricketVideo(base64String, file.type);
        setAnalysis(result || 'No analysis available.');
        setLoading(false);
      };
    } catch (error) {
      console.error(error);
      setAnalysis('Error connecting to RCA AI node. Check configuration.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center mb-12">
        <h3 className="text-4xl font-black text-[#252968] heading-font uppercase tracking-tighter italic">RCA AI Lab</h3>
        <p className="text-slate-500 font-medium">Biomechanical breakdown and technical analysis powered by Gemini Pro</p>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-2">
        <div className="p-10">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-4 border-dashed border-[#252968]/10 rounded-2xl p-16 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/50 hover:border-[#252968]/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-[#252968] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              accept="video/*" 
              onChange={handleFileChange}
            />
            <div className="w-20 h-20 bg-[#252968] rounded-2xl flex items-center justify-center text-[#f2ad3f] mb-6 group-hover:rotate-12 transition-all shadow-lg border-2 border-[#f2ad3f]/30">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            </div>
            <p className="font-black text-[#252968] uppercase tracking-widest text-lg">{file ? file.name : 'Upload Training Footage'}</p>
            <p className="text-[10px] text-slate-400 mt-3 font-black uppercase tracking-widest opacity-80">Supported: MP4, MOV • Max 10MB</p>
          </div>

          {videoUrl && (
            <div className="mt-10 rounded-2xl overflow-hidden shadow-2xl aspect-video bg-black border-4 border-[#252968]">
              <video src={videoUrl} controls className="w-full h-full" />
            </div>
          )}

          {file && !loading && !analysis && (
            <button 
              onClick={processVideo}
              className="mt-8 w-full bg-[#252968] text-[#f2ad3f] py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-[#1a1d4a] transition-all hover:-translate-y-1 uppercase tracking-widest border border-[#f2ad3f]/30"
            >
              Analyze Mechanics
            </button>
          )}

          {loading && (
            <div className="mt-10 text-center space-y-6 py-10">
              <div className="relative inline-block">
                  <div className="inline-block animate-spin rounded-full h-20 w-20 border-[6px] border-[#252968]/20 border-t-[#f2ad3f]"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-black text-[10px] text-[#252968]">RCA</div>
              </div>
              <p className="text-[#252968] text-xl font-black italic animate-pulse">Computing Elite Analytics...</p>
              <div className="flex justify-center space-x-6">
                <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">Limb Tracking</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">Impact Mapping</span>
              </div>
            </div>
          )}
        </div>

        {analysis && (
          <div className="bg-[#252968] p-12 border-t-8 border-[#f2ad3f]">
            <h4 className="font-black text-[#f2ad3f] text-xl mb-8 flex items-center space-x-4 uppercase tracking-tighter">
              <span className="text-3xl">📊</span>
              <span>Elite Breakdown Report</span>
            </h4>
            <div className="prose prose-invert max-w-none text-blue-50 leading-relaxed whitespace-pre-wrap font-medium bg-white/5 p-8 rounded-2xl border border-white/10 italic">
              {analysis}
            </div>
            <div className="mt-8 flex justify-end">
                <p className="text-[10px] font-black text-[#f2ad3f] uppercase tracking-widest border-b border-[#f2ad3f]/30">Certified RCA Technical Review</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoAnalysis;
