import type { MockEmployee } from '@/domain/employees/types';
import { prisma } from '@/lib/prisma';

export async function getEmployees(): Promise<MockEmployee[]> {
  const employees = await prisma.employee.findMany({
    where: {
      status: 'ACTIVE',
    },
    orderBy: {
      name: 'asc',
    },
  });

  return employees.map((employee) => ({
    id: employee.id,
    name: employee.name,
    initials: employee.initials ?? employee.name.slice(0, 2).toUpperCase(),
    hourlyPayRate: employee.hourlyPayRate.toNumber(),
    status: employee.status,
  }));
}
