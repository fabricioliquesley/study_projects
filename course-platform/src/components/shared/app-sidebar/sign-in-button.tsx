"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import Link from "next/link";

interface SignInButtonProps {
  variant?: "default" | "outline";
}

export const SignInButton = ({ variant = "default" }: SignInButtonProps) => {
  const { user } = useUser();

  if (user) {
    return null;
  }

  return (
    <Link
      href="/auth/sign-in"
      passHref
      className={variant === "default" ? "" : "w-full"}
    >
      <Button
        size="sm"
        variant={variant}
        className={variant === "default" ? "" : "w-full"}
      >
        <LogIn />
        Sign In
      </Button>
    </Link>
  );
};
