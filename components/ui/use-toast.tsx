"use client"

import { toast as sonnerToast } from "sonner"

export function toast({ title, description }: { title: string; description?: string }) {
  return sonnerToast(
    <div>
      <strong>{title}</strong>
      {description && <div style={{ fontSize: 13 }}>{description}</div>}
    </div>
  );
}
