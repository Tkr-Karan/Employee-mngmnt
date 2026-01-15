import { useState, useMemo, useRef } from 'react';
import { useEmployees } from '@/hooks/useEmployees';
import { Employee, EmployeeFormData } from '@/types/employee';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { EmployeeTable } from '@/components/dashboard/EmployeeTable';
import { EmployeeFilters } from '@/components/dashboard/EmployeeFilters';
import { EmployeeFormDialog } from '@/components/dashboard/EmployeeFormDialog';
import { DeleteConfirmDialog } from '@/components/dashboard/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, UserX, Plus, Printer, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useReactToPrint } from 'react-to-print';

const Dashboard = () => {
  const {
    employees,
    isLoading,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    toggleStatus,
    stats,
  } = useEmployees();

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dialog state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Print ref
  const printRef = useRef<HTMLDivElement>(null);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch = employee.fullName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      
      const matchesGender =
        genderFilter === 'all' || employee.gender === genderFilter;
      
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && employee.isActive) ||
        (statusFilter === 'inactive' && !employee.isActive);

      return matchesSearch && matchesGender && matchesStatus;
    });
  }, [employees, searchQuery, genderFilter, statusFilter]);

  // Handlers
  const handleAddNew = () => {
    setSelectedEmployee(null);
    setIsFormOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsFormOpen(true);
  };

  const handleDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedEmployee) {
      deleteEmployee(selectedEmployee.id);
      toast.success(`${selectedEmployee.fullName} has been deleted`);
      setIsDeleteOpen(false);
      setSelectedEmployee(null);
    }
  };

  const handleFormSubmit = (data: EmployeeFormData) => {
    if (selectedEmployee) {
      updateEmployee(selectedEmployee.id, data);
      toast.success(`${data.fullName}'s information has been updated`);
    } else {
      addEmployee(data);
      toast.success(`${data.fullName} has been added to the team`);
    }
  };

  const handleToggleStatus = (id: string) => {
    toggleStatus(id);
    const employee = employees.find((e) => e.id === id);
    if (employee) {
      toast.success(
        `${employee.fullName} is now ${employee.isActive ? 'inactive' : 'active'}`
      );
    }
  };

  const handlePrintSingle = (employee: Employee) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Employee Details - ${employee.fullName}</title>
            <style>
              body { font-family: system-ui, sans-serif; padding: 40px; color: #1a1a2e; }
              .header { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; }
              .avatar { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid #e5e7eb; }
              .avatar-placeholder { width: 100px; height: 100px; border-radius: 50%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: bold; color: #6b7280; }
              h1 { margin: 0; font-size: 24px; }
              .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
              .active { background: #dcfce7; color: #166534; }
              .inactive { background: #f3f4f6; color: #6b7280; }
              .details { margin-top: 20px; }
              .detail-row { display: flex; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
              .label { width: 150px; color: #6b7280; font-weight: 500; }
              .value { color: #1a1a2e; }
            </style>
          </head>
          <body>
            <div class="header">
              ${employee.profileImage 
                ? `<img src="${employee.profileImage}" class="avatar" alt="${employee.fullName}" />`
                : `<div class="avatar-placeholder">${employee.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}</div>`
              }
              <div>
                <h1>${employee.fullName}</h1>
                <span class="status ${employee.isActive ? 'active' : 'inactive'}">
                  ${employee.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div class="details">
              <div class="detail-row"><span class="label">Employee ID</span><span class="value">#${employee.id.slice(-4).padStart(4, '0')}</span></div>
              <div class="detail-row"><span class="label">Gender</span><span class="value">${employee.gender}</span></div>
              <div class="detail-row"><span class="label">Date of Birth</span><span class="value">${new Date(employee.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
              <div class="detail-row"><span class="label">State</span><span class="value">${employee.state}</span></div>
              <div class="detail-row"><span class="label">Joined</span><span class="value">${new Date(employee.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handlePrintAll = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Employee List',
  });

  const clearFilters = () => {
    setSearchQuery('');
    setGenderFilter('all');
    setStatusFilter('all');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container px-4 md:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Total Employees"
            value={stats.total}
            icon={Users}
            variant="default"
          />
          <StatCard
            title="Active"
            value={stats.active}
            icon={UserCheck}
            variant="success"
          />
          <StatCard
            title="Inactive"
            value={stats.inactive}
            icon={UserX}
            variant="muted"
          />
        </div>

        {/* Employee List Section */}
        <div className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden">
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Employees</h2>
                <p className="text-sm text-muted-foreground">
                  {filteredEmployees.length} of {employees.length} employees
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => handlePrintAll()} className="no-print">
                  <Printer className="h-4 w-4 mr-2" />
                  Print List
                </Button>
                <Button onClick={handleAddNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 md:px-6 border-b border-border bg-muted/30 no-print">
            <EmployeeFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              genderFilter={genderFilter}
              onGenderChange={setGenderFilter}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Table */}
          <div ref={printRef} className="p-4 md:p-6">
            <EmployeeTable
              employees={filteredEmployees}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              onPrint={handlePrintSingle}
            />
          </div>
        </div>
      </main>

      {/* Dialogs */}
      <EmployeeFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        employee={selectedEmployee}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        employee={selectedEmployee}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Dashboard;
