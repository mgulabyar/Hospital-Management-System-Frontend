import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
  isGreenTheme?: boolean; 
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: IconComponent,
  description,
  isGreenTheme = false,
}) => {
  const brandTextColor = isGreenTheme ? 'text-[#029352]' : 'text-[#1a4b8c]';
  const brandBgColor = isGreenTheme ? 'bg-[#029352]/8' : 'bg-[#1a4b8c]/8';
  const brandHoverShadow = isGreenTheme ? 'hover:shadow-emerald-600/5' : 'hover:shadow-blue-900/5';

  return (
    <div className={`bg-white rounded-lg p-5 border border-slate-200/70 shadow-sm ${brandHoverShadow} hover:shadow-md hover:border-slate-300/80 transition-all duration-300 font-sans group antialiased select-none flex flex-col justify-between min-h-35.5`}>
      
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 flex-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
            {title}
          </span>
          <h3 className={`text-2xl font-bold text-slate-800 tracking-tight transition-colors duration-300 group-hover:${brandTextColor}`}>
            {value}
          </h3>
        </div>
        
        <div className={`p-2.5 rounded-lg ${brandBgColor} transition-all duration-300 group-hover:scale-105 shrink-0 flex items-center justify-center`}>
          <IconComponent className={`w-5 h-5 ${brandTextColor} transition-transform duration-300`} />
        </div>
      </div>
      
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center">
        <p className="text-xs font-medium text-slate-400/90 leading-relaxed line-clamp-2 transition-colors duration-300 group-hover:text-slate-500">
          {description}
        </p>
      </div>

    </div>
  );
};
