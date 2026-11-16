import React, { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import type { User, UserRole, UserStatus } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search,
  Plus,
  Users as UsersIcon,
  Shield,
  GraduationCap,
  UserCheck,
  UserX,
} from "lucide-react";

export const UsersView: React.FC = () => {
  const { users, inviteUser, service, refreshData } = useAdmin();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("learner");

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !inviteName.trim()) return;
    await inviteUser(inviteEmail.trim(), inviteName.trim(), inviteRole);
    setInviteOpen(false);
    setInviteEmail("");
    setInviteName("");
  };

  const handleToggleStatus = async (user: User) => {
    const nextStatus: UserStatus =
      user.status === "active" ? "suspended" : "active";
    await service.updateUserStatus(user.id, nextStatus);
    await refreshData();
  };

  const handleChangeRole = async (user: User, newRole: UserRole) => {
    await service.updateUserRole(user.id, newRole);
    await refreshData();
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-md relative">
          <Search size={15} className="absolute left-3 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>

        <Button
          onClick={() => setInviteOpen(true)}
          className="gap-2 h-9 text-xs font-semibold shrink-0"
        >
          <Plus size={15} />
          Invite User
        </Button>
      </div>

      {/* Role Filters */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        {(["all", "admin", "instructor", "learner"] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
              roleFilter === r
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            {r === "all" ? "All Users" : `${r}s`}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground">
                  <th className="py-3 px-4 font-medium">User Profile</th>
                  <th className="py-3 px-4 font-medium">Role</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Joined Date</th>
                  <th className="py-3 px-4 font-medium">Last Login</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-accent/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center font-bold text-xs text-foreground shrink-0">
                          {user.full_name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">
                            {user.full_name}
                          </div>
                          <div className="text-[11px] text-muted-foreground font-mono">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleChangeRole(user, e.target.value as UserRole)
                        }
                        className="h-7 text-[11px] rounded border border-input bg-background px-2 text-foreground font-medium capitalize"
                      >
                        <option value="admin">Admin</option>
                        <option value="instructor">Instructor</option>
                        <option value="learner">Learner</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={user.status === "active" ? "default" : "destructive"}
                        className="text-[10px] capitalize"
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground font-mono text-[11px]">
                      {new Date(user.last_login_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(user)}
                        className={`h-7 text-xs ${
                          user.status === "active"
                            ? "text-destructive hover:bg-destructive/10"
                            : "text-emerald-600 hover:bg-emerald-500/10"
                        }`}
                      >
                        {user.status === "active" ? "Suspend" : "Activate"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Invite Modal */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Invite User to Platform
            </DialogTitle>
            <DialogDescription className="text-xs">
              Assign staff privileges or pre-enroll a student.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Full Name</Label>
              <Input
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="e.g. John Doe"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Email Address</Label>
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="e.g. user@organization.com"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Role Assignment</Label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as UserRole)}
                className="w-full h-8 rounded-md border border-input bg-background px-3 text-xs text-foreground"
              >
                <option value="learner">Learner (Courses only)</option>
                <option value="instructor">Instructor (Course editor)</option>
                <option value="admin">Admin (Full portal control)</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInviteOpen(false)}
              className="text-xs h-8"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleInvite}
              disabled={!inviteEmail.trim() || !inviteName.trim()}
              className="text-xs h-8"
            >
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
