import { Employee } from '@/types/employee';

export const mockEmployees: Employee[] = [
  {
    id: '1',
    fullName: 'John Anderson',
    gender: 'Male',
    dateOfBirth: '1990-05-15',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    state: 'California',
    isActive: true,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    fullName: 'Sarah Mitchell',
    gender: 'Female',
    dateOfBirth: '1988-11-22',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    state: 'New York',
    isActive: true,
    createdAt: '2024-02-10'
  },
  {
    id: '3',
    fullName: 'Michael Chen',
    gender: 'Male',
    dateOfBirth: '1995-03-08',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    state: 'Texas',
    isActive: false,
    createdAt: '2024-01-20'
  },
  {
    id: '4',
    fullName: 'Emily Rodriguez',
    gender: 'Female',
    dateOfBirth: '1992-07-30',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    state: 'Florida',
    isActive: true,
    createdAt: '2024-03-05'
  },
  {
    id: '5',
    fullName: 'David Kim',
    gender: 'Male',
    dateOfBirth: '1987-12-18',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    state: 'Washington',
    isActive: true,
    createdAt: '2024-02-28'
  }
];
