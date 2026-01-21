
import React, { useState, useMemo } from 'react';
import { 
  Users, 
  LayoutDashboard, 
  LogOut, 
  Plus, 
  Trash2, 
  Search,
  X,
  Building,
  Edit2,
  AlertTriangle,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { Employee, Role, AuthState } from './types';

const INITIAL_EMPLOYEES: Employee[] = [
  { id: 1, name: "John Doe", email: "employee@example.com", phone: "+1 (555) 123-4567", role: "Software Engineer", dept: "Engineering", salary: 85000, joinDate: '2022-01-15' },
  { id: 2, name: "Jane Smith", email: "jane.smith@company.com", phone: "+1 (555) 234-5678", role: "Product Manager", dept: "Product", salary: 92000, joinDate: '2021-11-03' },
  { id: 3, name: "Michael Brown", email: "michael.b@company.com", phone: "+1 (555) 345-6789", role: "UI/UX Designer", dept: "Design", salary: 78000, joinDate: '2023-02-20' },
  { id: 4, name: "Emily Davis", email: "emily.d@company.com", phone: "+1 (555) 456-7890", role: "QA Engineer", dept: "Engineering", salary: 75000, joinDate: '2022-05-10' },
];

const App: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [auth, setAuth] = useState<AuthState>({ isAuthenticated: false, role: null, user: null });
  const [activeView, setActiveView] = useState<'dashboard' | 'employees'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  const handleLogin = (e: React.FormEvent, role: Role) => {
    e.preventDefault();
    if (role === 'admin') {
      setAuth({ isAuthenticated: true, role: 'admin', user: null });
    } else {
      const user = employees[0]; // Default for demo
      setAuth({ isAuthenticated: true, role: 'employee', user });
    }
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, role: null, user: null });
    setActiveView('dashboard');
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(e => 
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [employees, searchQuery]);

  const totalPayroll = useMemo(() => {
    return employees.reduce((acc, emp) => acc + Number(emp.salary), 0);
  }, [employees]);

  const avgSalary = useMemo(() => {
    return employees.length > 0 ? Math.round(totalPayroll / employees.length) : 0;
  }, [employees, totalPayroll]);

  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen login-bg flex flex-col items-center justify-center p-4">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="bg-indigo-500 p-3 rounded-2xl shadow-lg mb-4">
            <Building className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">EMS Portal</h1>
          <p className="text-slate-600 mt-2 font-medium">Welcome back! Please enter your details.</p>
        </div>

        <div className="w-full max-w-md glass-card rounded-[2rem] p-8">
          <div className="flex bg-slate-100/50 p-1 rounded-xl mb-8">
            <button 
              onClick={() => setAuth(prev => ({ ...prev, role: 'employee' }))}
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${auth.role !== 'admin' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-500'}`}
            >
              Employee
            </button>
            <button 
              onClick={() => setAuth(prev => ({ ...prev, role: 'admin' }))}
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${auth.role === 'admin' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-500'}`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={(e) => handleLogin(e, auth.role === 'admin' ? 'admin' : 'employee')} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">@</span>
                <input 
                  type="email" 
                  defaultValue={auth.role === 'admin' ? 'admin@example.com' : 'employee@example.com'}
                  className="w-full pl-10 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-semibold shadow-sm transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <LayoutDashboard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input 
                  type="password" 
                  defaultValue="password123"
                  className="w-full pl-10 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-semibold shadow-sm transition-all"
                />
              </div>
            </div>
            <button className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98]">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col p-6 sticky top-0 h-screen shadow-sm">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-indigo-500 p-2 rounded-xl">
            <Building className="text-white w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-indigo-600">EMS</h2>
        </div>

        <nav className="flex-grow space-y-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Main Menu</p>
          {auth.role === 'admin' ? (
            <>
              <SidebarLink 
                active={activeView === 'dashboard'} 
                onClick={() => setActiveView('dashboard')}
                icon={<LayoutDashboard size={20} />} 
                label="Dashboard" 
              />
              <SidebarLink 
                active={activeView === 'employees'} 
                onClick={() => setActiveView('employees')}
                icon={<Users size={20} />} 
                label="Employees" 
              />
            </>
          ) : (
            <SidebarLink 
              active={true} 
              onClick={() => {}} 
              icon={<Users size={20} />} 
              label="My Details" 
            />
          )}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3 border border-slate-100">
            <div className="w-10 h-10 bg-slate-800 text-white flex items-center justify-center rounded-xl font-bold">
              {auth.role === 'admin' ? 'A' : 'JD'}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                {auth.role === 'admin' ? 'Alice Admin' : 'John Doe'}
              </p>
              <p className="text-[10px] text-slate-500 font-bold uppercase">
                {auth.role === 'admin' ? 'Admin' : 'Employee'}
              </p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-rose-50 hover:bg-rose-100 text-rose-500 font-bold rounded-xl transition-all active:scale-[0.98]"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 overflow-y-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            {auth.role === 'admin' ? 'Admin Dashboard' : 'Employee Dashboard'}
          </h1>
          {auth.role === 'admin' && (
            <div className="relative w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search employees by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all text-slate-900 font-medium"
              />
            </div>
          )}
        </header>

        {auth.role === 'admin' && activeView === 'dashboard' && (
          <div className="grid grid-cols-3 gap-6 mb-10">
            <StatBox label="TOTAL STAFF" value={employees.length.toString()} icon={<Users className="w-5 h-5" />} color="bg-indigo-600" />
            <StatBox label="TOTAL PAYROLL" value={`₹${totalPayroll.toLocaleString('en-IN')}`} icon={<DollarSign className="w-5 h-5" />} color="bg-emerald-500" />
            <StatBox label="AVG SALARY" value={`₹${avgSalary.toLocaleString('en-IN')}`} icon={<Briefcase className="w-5 h-5" />} color="bg-orange-500" />
          </div>
        )}

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900 border-l-4 border-indigo-500 pl-4">
              {auth.role === 'admin' ? 'Overview' : 'My Details'}
            </h3>
            {auth.role === 'admin' && (
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-lg active:scale-[0.98]"
              >
                <Plus size={18} />
                Add Employee
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">Employee</th>
                  <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">Contact</th>
                  <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">Role</th>
                  <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">Gender</th>
                  <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">Salary</th>
                  <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">Joined</th>
                  {auth.role === 'admin' && <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 text-center">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(auth.role === 'admin' ? filteredEmployees : [employees[0]]).map(emp => (
                  <tr key={emp.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-700 flex items-center justify-center rounded-full font-bold">
                          {emp.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <p className="font-bold text-slate-900">{emp.name}</p>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <div className="text-sm">
                        <p className="text-slate-600 font-medium">{emp.email}</p>
                        <p className="text-slate-400">{emp.phone}</p>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <div className="text-sm font-medium">
                        <p className="text-slate-900">{emp.role}</p>
                        <p className="text-slate-500 text-xs font-bold">{emp.dept}</p>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-sm text-slate-600">Male</td>
                    <td className="py-5 px-4">
                      <p className="font-bold text-slate-900">₹{Number(emp.salary).toLocaleString('en-IN')}</p>
                    </td>
                    <td className="py-5 px-4 text-sm text-slate-500">{emp.joinDate}</td>
                    {auth.role === 'admin' && (
                      <td className="py-5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setEditingEmployee(emp)} className="p-2 text-slate-400 hover:text-indigo-500 transition-colors">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => setDeletingEmployee(emp)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <Modal title="Add New Employee" onClose={() => setIsAddModalOpen(false)}>
          <EmployeeForm 
            onCancel={() => setIsAddModalOpen(false)} 
            onSubmit={(data) => {
              setEmployees([...employees, { ...data, id: Date.now(), joinDate: new Date().toISOString().split('T')[0] }]);
              setIsAddModalOpen(false);
            }} 
            submitLabel="Add Employee"
          />
        </Modal>
      )}

      {/* Edit Employee Modal */}
      {editingEmployee && (
        <Modal title="Edit Employee" onClose={() => setEditingEmployee(null)}>
          <EmployeeForm 
            initialData={editingEmployee}
            onCancel={() => setEditingEmployee(null)} 
            onSubmit={(data) => {
              setEmployees(employees.map(e => e.id === editingEmployee.id ? { ...editingEmployee, ...data } : e));
              setEditingEmployee(null);
            }} 
            submitLabel="Save Changes"
          />
        </Modal>
      )}

      {/* Delete Modal */}
      {deletingEmployee && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm p-8 rounded-3xl shadow-2xl animate-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 flex items-center justify-center rounded-2xl mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Employee</h3>
              <p className="text-slate-600 mb-8">
                Are you sure you want to delete <span className="font-bold text-slate-900">{deletingEmployee.name}</span>? This action cannot be undone.
              </p>
              <div className="flex w-full gap-4">
                <button onClick={() => setDeletingEmployee(null)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all">
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setEmployees(employees.filter(e => e.id !== deletingEmployee.id));
                    setDeletingEmployee(null);
                  }}
                  className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-components
const SidebarLink: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${active ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-indigo-500 hover:bg-indigo-50'}`}
  >
    {icon}
    {label}
  </button>
);

const StatBox: React.FC<{ label: string, value: string, icon: React.ReactNode, color: string }> = ({ label, value, icon, color }) => (
  <div className={`${color} p-8 rounded-[2rem] text-white relative overflow-hidden shadow-lg group hover:scale-[1.02] transition-transform cursor-default`}>
    <div className="relative z-10">
      <p className="text-[10px] font-bold opacity-70 mb-2 uppercase tracking-widest">{label}</p>
      <h4 className="text-4xl font-black">{value}</h4>
    </div>
    <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 group-hover:scale-110 transition-transform">
      {React.cloneElement(icon as React.ReactElement<any>, { size: 64 })}
    </div>
  </div>
);

const Modal: React.FC<{ title: string, onClose: () => void, children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
    <div className="bg-white w-full max-w-xl p-8 rounded-[2.5rem] shadow-2xl relative animate-in zoom-in duration-200 border border-slate-100">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <X className="text-slate-500" />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const EmployeeForm: React.FC<{ initialData?: Employee, onCancel: () => void, onSubmit: (data: any) => void, submitLabel: string }> = ({ initialData, onCancel, onSubmit, submitLabel }) => (
  <form onSubmit={(e) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    onSubmit(Object.fromEntries(fd.entries()));
  }} className="space-y-6">
    <div className="flex flex-col items-center mb-8">
      <div className="w-24 h-24 bg-slate-100 border-4 border-white flex flex-col items-center justify-center rounded-full text-slate-400 relative group cursor-pointer shadow-sm border border-slate-200">
        <div className="text-center">
          <Edit2 className="w-6 h-6 mx-auto mb-1 opacity-60" />
          <p className="text-[8px] font-bold uppercase px-2">Profile Photo</p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-6">
      <FormInput name="name" label="Name" placeholder="Full Name" defaultValue={initialData?.name} required />
      <FormInput name="phone" label="Phone" placeholder="+91..." defaultValue={initialData?.phone} required />
      <FormInput name="email" label="Email" placeholder="email@company.com" type="email" defaultValue={initialData?.email} required />
      <FormInput name="role" label="Role" placeholder="e.g. Engineer" defaultValue={initialData?.role} required />
      <FormInput name="dept" label="Department" placeholder="e.g. Engineering" defaultValue={initialData?.dept} required />
      <FormInput name="salary" label="Salary (₹)" placeholder="e.g. 45000" type="number" defaultValue={initialData?.salary} required />

      <div className="space-y-2 col-span-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Gender</label>
        <select name="gender" className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-900 transition-all">
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
      </div>
    </div>

    <div className="flex gap-4 pt-4">
      <button type="button" onClick={onCancel} className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all">
        Cancel
      </button>
      <button type="submit" className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-[0.98]">
        {submitLabel}
      </button>
    </div>
  </form>
);

const FormInput: React.FC<{ name: string, label: string, placeholder?: string, type?: string, defaultValue?: any, required?: boolean }> = ({ name, label, placeholder, type = "text", defaultValue, required }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
    <input 
      name={name}
      type={type}
      placeholder={placeholder}
      defaultValue={defaultValue}
      required={required}
      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-900 placeholder:text-slate-400 shadow-sm transition-all"
    />
  </div>
);

export default App;
