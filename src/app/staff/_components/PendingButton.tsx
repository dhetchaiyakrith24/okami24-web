"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

/**
 * Submit button for the staff forms (owner 30/10: "กดปุ่มแล้วหน่วง ๆ"). A staff action is a server round trip that ends in a
 * redirect to a dynamic page ("ส่งเข้าคลัง Shipnity" also waits for the warehouse's system), and until now nothing on screen
 * changed meanwhile — it felt stuck and invited a second press. While the form is submitting the button says so and is
 * disabled; the action itself is unchanged (the browser reads the form data, including this button's own name/value,
 * before the button is disabled).
 */
export function PendingButton({
  children,
  className,
  pendingText = "กำลังทำ…",
  name,
  value,
  disabled = false,
}: {
  children: ReactNode;
  className?: string;
  pendingText?: string;
  name?: string;
  value?: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      name={name}
      value={value}
      disabled={pending || disabled}
      aria-busy={pending}
      className={`${className ?? ""}${pending ? " cursor-wait opacity-60" : ""}`}
    >
      {pending ? pendingText : children}
    </button>
  );
}
