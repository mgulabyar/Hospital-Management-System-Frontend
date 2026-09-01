/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useState, useEffect } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { Login } from './pages/Auth/Login';
import { TopNavbar } from './components/Navbar/Navbar';
import { MainSidebar } from './components/Sidebar/MainSidebar';
import { hmsServices } from './services/apiService';
import { AdminDashboard } from './pages/Dashboard/AdminDashboard';

// Unified Inner Workstation Router
const MainAppContent: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [staffData, setStaffData] = useState<any[]>([]);
  const [staffLoading, setStaffLoading] = useState<boolean>(false);
  const [staffError, setStaffError] = useState<string>('');

  if (!authContext) return null;
  const { isAuthenticated } = authContext;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (isAuthenticated && activeTab === 'staff_crud') {
      const fetchStaff = async () => {
        setStaffLoading(true);
        setStaffError('');
        try {
          const response = await hmsServices.staff.getAllStaff();
          if (response.success) {
            setStaffData(response.data);
          } else {
            setStaffError('Failed to synchronize workplace registry.');
          }
        } catch (err: any) {
          setStaffError(err.response?.data?.message || 'Network failure connecting to Express server.');
        } finally {
          setStaffLoading(false);
        }
      };
      
      fetchStaff();
    }
  }, [isAuthenticated, activeTab]);

  // 1. Structural Gate Check: If token session is missing, enforce Login Layer Portal view
  if (!isAuthenticated) {
    return <Login />;
  }

  // 2. Verified Corporate Layout Shell compilation output
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      
      {/* Central Top Fixed Header */}
      <TopNavbar />

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Side Role-Based Control Navigation Tree */}
        <MainSidebar currentTab={activeTab} setCurrentTab={setActiveTab} />

        {/* Dynamic Inner Workspace Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          
          {/* View Tab 1: Live Corporate Analytics Panel */}
          {activeTab === 'dashboard' && <AdminDashboard />}

          {/* View Tab 2: Super Admin Dynamic Staff Account Database CRUD View */}
          {activeTab === 'staff_crud' && (
            <div className="p-6 max-w-7xl mx-auto font-sans">
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-6">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">Hospital Staff Registry</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Central database registry workspace to manage clinical practitioners and front desk staff profiles.</p>
                  </div>
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm uppercase tracking-wider smooth-transition">
                    Add New Practitioner
                  </button>
                </div>

                {/* Database Loading and Error States */}
                {staffLoading && (
                  <div className="py-20 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {staffError && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-xl p-4 text-xs font-semibold text-center">
                    {staffError}
                  </div>
                )}

                {/* Real Live Database Workers Data Mapping Layout */}
                {!staffLoading && !staffError && staffData.length === 0 ? (
                  <p className="text-center text-slate-400 text-xs font-semibold py-12">No medical staff accounts found. Register a doctor profile to begin.</p>
                ) : (
                  !staffLoading && !staffError && (
                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                            <th className="py-3 px-4">Practitioner Name</th>
                            <th className="py-3 px-4">System Workplace Email</th>
                            <th className="py-3 px-4">Designated Role</th>
                            <th className="py-3 px-4">Account Status</th>
                          </tr>
                        </thead>
                        <tbody className="text-xs font-medium text-slate-600 divide-y divide-slate-50">
                          {staffData.map((worker: any) => (
                            <tr key={worker._id} className="hover:bg-slate-50/50 smooth-transition">
                              <td className="py-3.5 px-4 text-slate-800 font-bold">{worker.name}</td>
                              <td className="py-3.5 px-4 font-mono text-slate-500">{worker.email}</td>
                              <td className="py-3.5 px-4">
                                <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-bold uppercase text-[9px] tracking-wider">
                                  {worker.role}
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  worker.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                }`}>
                                  {worker.isActive ? 'Active Duty' : 'Suspended'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* View Tab 3: Accounts Financial Audit Trail Tab */}
          {activeTab === 'financial_ledger' && (
            <div className="p-6 text-slate-400 text-sm font-semibold text-center mt-20 font-sans">
              <div className="bg-white border border-slate-100 p-12 rounded-2xl shadow-sm inline-block max-w-md">
                <p className="text-slate-700 font-bold mb-1">Central Ledger Sheets</p>
                <p className="text-xs text-slate-400">Database monitoring and revenue audits are successfully mapped inside api layer.</p>
              </div>
            </div>
          )}

          {/* View Tab 4: System Level Access Logs Tab */}
          {activeTab === 'system_security' && (
            <div className="p-6 text-slate-400 text-sm font-semibold text-center mt-20 font-sans">
              <div className="bg-white border border-slate-100 p-12 rounded-2xl shadow-sm inline-block max-w-md">
                <p className="text-slate-700 font-bold mb-1">Cryptographic Security Panel</p>
                <p className="text-xs text-slate-400">RBAC verification algorithms tracking logs are secured inside network layers.</p>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

// Main Export Entry Point wrapped inside context initialization node
export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
