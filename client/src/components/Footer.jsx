import React from 'react';
import { ShieldAlert, Github, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">Smart Complaint</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              AI-powered campus complaint resolution system. Categorize, track, and resolve grievances with Gemini AI & automated workflows.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Frontend Stack</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>React 18 + Vite</li>
              <li>Tailwind CSS</li>
              <li>React Router</li>
              <li>Axios & Lucide React</li>
              <li>Recharts Data Visualization</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Backend & Database</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Node.js + Express.js</li>
              <li>MongoDB & Mongoose</li>
              <li>Gemini AI SDK</li>
              <li>JWT & bcryptjs Auth</li>
              <li>Multer File Storage</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Hackathon Status</h4>
            <div className="glass-card p-4 rounded-xl space-y-2 border border-indigo-500/20">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Core Setup</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">Active</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Health API</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-semibold">Ready</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Phase</span>
                <span className="text-indigo-400 font-medium">Stage 1 Initialized</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Smart Complaint Management System. Built for College Hackathon.</p>
          <div className="flex items-center gap-1">
            <span>Powered by Node.js & React</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
