import React from 'react';
import Sidebar from '../components/Sidebar';

const MasterLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('hms_user') || '{}');

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role={user.role_category} />
      <div className="flex-1">
        <header className="h-20 bg-white border-bottom border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wider">Hospital Global Control</h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500 uppercase">{user.specific_role}</p>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full border-2 border-primary flex items-center justify-center font-bold text-primary">
              {user.name?.[0]}
            </div>
          </div>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MasterLayout;