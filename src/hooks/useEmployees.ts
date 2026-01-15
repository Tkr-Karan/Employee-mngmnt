import { useState, useEffect } from 'react';
import { Employee, EmployeeFormData } from '@/types/employee';
import { mockEmployees } from '@/data/mockEmployees';

const STORAGE_KEY = 'employees_data';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setEmployees(JSON.parse(stored));
    } else {
      setEmployees(mockEmployees);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockEmployees));
    }
    setIsLoading(false);
  }, []);

  const saveToStorage = (data: Employee[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const addEmployee = (data: EmployeeFormData) => {
    const newEmployee: Employee = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [...employees, newEmployee];
    setEmployees(updated);
    saveToStorage(updated);
    return newEmployee;
  };

  const updateEmployee = (id: string, data: EmployeeFormData) => {
    const updated = employees.map(emp => 
      emp.id === id ? { ...emp, ...data } : emp
    );
    setEmployees(updated);
    saveToStorage(updated);
  };

  const deleteEmployee = (id: string) => {
    const updated = employees.filter(emp => emp.id !== id);
    setEmployees(updated);
    saveToStorage(updated);
  };

  const toggleStatus = (id: string) => {
    const updated = employees.map(emp =>
      emp.id === id ? { ...emp, isActive: !emp.isActive } : emp
    );
    setEmployees(updated);
    saveToStorage(updated);
  };

  const getEmployee = (id: string) => {
    return employees.find(emp => emp.id === id);
  };

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.isActive).length,
    inactive: employees.filter(e => !e.isActive).length
  };

  return {
    employees,
    isLoading,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    toggleStatus,
    getEmployee,
    stats
  };
};
