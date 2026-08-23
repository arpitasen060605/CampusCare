import React from 'react';
import { Link2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const DuplicateBadge = ({ duplicateOf, similarity }) => {
  if (!duplicateOf) return null;

  const targetId = typeof duplicateOf === 'object' ? (duplicateOf.complaintId || duplicateOf._id) : duplicateOf;
  const targetMongoId = typeof duplicateOf === 'object' ? duplicateOf._id : duplicateOf;
  const matchPct = similarity ? Math.round(similarity * 100) : 94;

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm">
      <Link2 className="w-3.5 h-3.5 text-amber-400" />
      <span>Duplicate of </span>
      <Link 
        to={`/complaint/${targetMongoId}`}
        className="font-mono text-amber-200 underline hover:text-white"
      >
        #{targetId}
      </Link>
      <span className="text-[10px] opacity-80">({matchPct}% Match)</span>
    </div>
  );
};

export default DuplicateBadge;
