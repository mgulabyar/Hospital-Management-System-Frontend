import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
  iconColorClass: string;
  badgeColorClass: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: IconComponent,
  description,
  iconColorClass,
  badgeColorClass
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 font-sans group">
      <div className="flex items-center justify-between">
        
        {/* Core Calculated Numerical Value Fields */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-2 tracking-tight transition-all duration-150 group-hover:text-emerald-600">
            {value}
          </h3>
        </div>
        
        {/* Functional Visual Icon Vector Context */}
        <div className={`p-3.5 rounded-xl ${badgeColorClass} transition-transform duration-150 group-hover:scale-105`}>
          <IconComponent className={`w-5 h-5 ${iconColorClass}`} />
        </div>
      </div>
      
      {/* Lower Secondary Subtext Description Field */}
      <div className="mt-4 pt-3 border-t border-slate-50 flex items-center">
        <span className="text-[11px] text-slate-400 font-medium tracking-wide">{description}</span>
      </div>
    </div>
  );
};
