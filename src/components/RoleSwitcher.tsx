import React from 'react';
import { UserRole } from '../types';
import { User } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  return (
    <div className="flex items-center space-x-3">
      <User className="w-5 h-5 text-gray-600" />
      <select
        value={currentRole}
        onChange={(e) => onRoleChange(e.target.value as UserRole)}
        className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {Object.values(UserRole).map(role => (
          <option key={role} value={role}>{role}</option>
        ))}
      </select>
    </div>
  );
}