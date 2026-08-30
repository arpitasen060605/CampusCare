import React from 'react';
import { Check, Clock, BrainCircuit, UserCheck, Wrench, CheckCircle2 } from 'lucide-react';

const ComplaintTimeline = ({ status = 'Pending', aiAnalyzed = true, timestamps = {} }) => {
  // Determine active stage index (1-based)
  // Stage 1: Complaint Submitted
  // Stage 2: AI Analyzed
  // Stage 3: Assigned
  // Stage 4: In Progress
  // Stage 5: Resolved
  let currentStageIndex = 2; // Default Submitted + AI Analyzed

  if (status === 'Pending') {
    currentStageIndex = 2;
  } else if (status === 'Assigned') {
    currentStageIndex = 3;
  } else if (status === 'In Progress') {
    currentStageIndex = 4;
  } else if (status === 'Resolved') {
    currentStageIndex = 5;
  }

  const stages = [
    {
      id: 1,
      name: 'Complaint Submitted',
      description: 'Logged in database',
      icon: Clock,
      date: timestamps.createdAt,
    },
    {
      id: 2,
      name: 'AI Analyzed',
      description: 'Gemini AI triage',
      icon: BrainCircuit,
      date: timestamps.createdAt,
    },
    {
      id: 3,
      name: 'Assigned',
      description: 'Routed to technician',
      icon: UserCheck,
      date: timestamps.assignedAt,
    },
    {
      id: 4,
      name: 'In Progress',
      description: 'Service underway',
      icon: Wrench,
      date: timestamps.startedAt,
    },
    {
      id: 5,
      name: 'Resolved',
      description: 'Work completed',
      icon: CheckCircle2,
      date: timestamps.resolvedAt,
    },
  ];

  return (
    <div className="py-4">
      {/* Desktop Stepper View (sm and up) */}
      <div className="hidden sm:flex items-center justify-between relative">
        {/* Connecting Line background */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-800 rounded-full -z-0" />

        {/* Progress Fill Line */}
        <div 
          className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500 -z-0"
          style={{ width: `${((currentStageIndex - 1) / (stages.length - 1)) * 92}%` }}
        />

        {stages.map((stage) => {
          const isCompleted = stage.id <= currentStageIndex;
          const isCurrent = stage.id === currentStageIndex;
          const StageIcon = stage.icon;

          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center group">
              {/* Step Circle */}
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                isCurrent
                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/30 scale-110 shadow-lg shadow-indigo-600/40 animate-pulse'
                  : isCompleted
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900 border border-slate-700 text-slate-500'
              }`}>
                {isCompleted && !isCurrent ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <StageIcon className={`w-5 h-5 ${isCurrent ? 'text-white' : ''}`} />
                )}
              </div>

              {/* Step Title & Subtitle */}
              <div className="mt-3 text-center space-y-0.5">
                <div className={`text-xs font-bold transition-colors ${
                  isCurrent ? 'text-cyan-300' : isCompleted ? 'text-white' : 'text-slate-500'
                }`}>
                  {stage.name}
                </div>
                <div className="text-[10px] text-slate-400">
                  {stage.date ? new Date(stage.date).toLocaleDateString() : stage.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical Stepper View (xs screen) */}
      <div className="sm:hidden space-y-4 relative pl-4 border-l-2 border-slate-800 ml-2">
        {stages.map((stage) => {
          const isCompleted = stage.id <= currentStageIndex;
          const isCurrent = stage.id === currentStageIndex;
          const StageIcon = stage.icon;

          return (
            <div key={stage.id} className="relative flex items-start gap-3">
              {/* Icon Marker */}
              <div className={`absolute -left-[27px] top-0 w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                isCurrent
                  ? 'bg-indigo-600 text-white ring-2 ring-indigo-400/40 animate-pulse'
                  : isCompleted
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 border border-slate-700 text-slate-500'
              }`}>
                {isCompleted && !isCurrent ? <Check className="w-4 h-4" /> : <StageIcon className="w-4 h-4" />}
              </div>

              {/* Mobile Info */}
              <div className="pl-4">
                <div className={`text-xs font-bold ${isCurrent ? 'text-cyan-300' : isCompleted ? 'text-white' : 'text-slate-500'}`}>
                  {stage.name}
                </div>
                <div className="text-[10px] text-slate-400">
                  {stage.date ? new Date(stage.date).toLocaleString() : stage.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComplaintTimeline;
