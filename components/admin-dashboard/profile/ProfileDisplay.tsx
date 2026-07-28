// components/profile/ProfileDisplay.tsx
"use client";

import { Camera, Mail, Phone, User } from "lucide-react";

interface ProfileDisplayProps {
  user: any;
}

export default function ProfileDisplay({ user }: ProfileDisplayProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <User className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Full Name</p>
            <p className="font-medium">{user.name || "Not provided"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <Mail className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user.email || "Not provided"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <Phone className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="font-medium">{user.phone || "Not provided"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <User className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="font-medium">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </p>
          </div>
        </div>

        {user.image && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Camera className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Profile Picture</p>
              <p className="font-medium text-sm">Uploaded</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}