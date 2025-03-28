"use client";

import { useTranslation } from "@/app/i18n/client";
import { Button } from "@/components/ui/button";
import { handleRequest } from "@/utils/auth-helpers/client";
import { signInWithPassword } from "@/utils/auth-helpers/server";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { Input } from "../input";

// Define prop type with allowEmail boolean
interface PasswordSignInProps {
  allowEmail: boolean;
  redirectMethod: string;
  lng: string;
}

export default function PasswordSignIn({
  allowEmail,
  redirectMethod,
  lng,
}: PasswordSignInProps) {
  const { t } = useTranslation(lng, "common");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(
      e,
      signInWithPassword,
      redirectMethod === "client" ? router : null,
    );
    setIsSubmitting(false);
  };

  return (
    <div className="mt-8">
      <form
        noValidate={true}
        className="mb-4"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="email">{t("email-label")}</label>
            <Input
              id="email"
              placeholder={t("email-input-placeholder")}
              type="email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
            />
            <label
              className="flex items-center justify-between"
              htmlFor="password"
            >
              <p>{t("password-label")}</p>
              <Link
                href="/signin/forgot_password"
                className="text-sm font-light underline"
              >
                {t("password-link-text")}
              </Link>
            </label>
            <Input
              id="password"
              placeholder={t("password-input-placeholder")}
              type="password"
              name="password"
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="mt-1">
            {t("sign-in")}
          </Button>
        </div>
      </form>

      {allowEmail && (
        <p className="text-center text-sm font-light">
          <Link href="/signin/email_signin">{t("sign-in-magic")}</Link>
        </p>
      )}
      <p className="space-x-2 text-center text-sm font-light">
        <span>{t("link-text-2")}</span>
        <Link href="/signin/signup" className="underline">
          {t("sign-up")}
        </Link>
      </p>
    </div>
  );
}
