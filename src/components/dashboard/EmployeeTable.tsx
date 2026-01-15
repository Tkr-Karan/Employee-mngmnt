import { Employee } from '@/types/employee';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2, Printer, User } from 'lucide-react';
import { format } from 'date-fns';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onToggleStatus: (id: string) => void;
  onPrint: (employee: Employee) => void;
}

export const EmployeeTable = ({
  employees,
  onEdit,
  onDelete,
  onToggleStatus,
  onPrint,
}: EmployeeTableProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <User className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No employees found</h3>
        <p className="text-muted-foreground mt-1">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>State</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee, index) => (
            <TableRow 
              key={employee.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TableCell className="font-mono text-sm text-muted-foreground">
                #{employee.id.slice(-4).padStart(4, '0')}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-border">
                    <AvatarImage src={employee.profileImage} alt={employee.fullName} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getInitials(employee.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{employee.fullName}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-normal">
                  {employee.gender}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(employee.dateOfBirth), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>{employee.state}</TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2">
                  <Switch
                    checked={employee.isActive}
                    onCheckedChange={() => onToggleStatus(employee.id)}
                  />
                  <Badge 
                    variant={employee.isActive ? 'default' : 'secondary'}
                    className={employee.isActive 
                      ? 'bg-success/10 text-success border-success/20 hover:bg-success/20' 
                      : 'bg-muted text-muted-foreground'
                    }
                  >
                    {employee.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(employee)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(employee)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onPrint(employee)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
