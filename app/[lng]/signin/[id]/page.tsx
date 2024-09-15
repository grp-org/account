import { useTranslation } from "@/app/i18n";
import Logo from "@/components/logo";
import EmailSignIn from "@/components/ui/AuthForms/EmailSignIn";
import ForgotPassword from "@/components/ui/AuthForms/ForgotPassword";
import OauthSignIn from "@/components/ui/AuthForms/OauthSignIn";
import PasswordSignIn from "@/components/ui/AuthForms/PasswordSignIn";
import Separator from "@/components/ui/AuthForms/Separator";
import SignUp from "@/components/ui/AuthForms/Signup";
import UpdatePassword from "@/components/ui/AuthForms/UpdatePassword";
import {
  getAuthTypes,
  getDefaultSignInView,
  getRedirectMethod,
  getViewTypes,
} from "@/utils/auth-helpers/settings";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SignIn({
  params,
  searchParams,
}: {
  params: { id: string; lng: string };
  searchParams: { disable_button: boolean };
}) {
  const { t } = await useTranslation(params.lng, "common");
  const { allowOauth, allowEmail, allowPassword } = getAuthTypes();
  const viewTypes = getViewTypes();
  const redirectMethod = getRedirectMethod();

  // Declare 'viewProp' and initialize with the default value
  let viewProp: string;

  // Assign url id to 'viewProp' if it's a valid string and ViewTypes includes it
  if (typeof params.id === "string" && viewTypes.includes(params.id)) {
    viewProp = params.id;
  } else {
    const preferredSignInView =
      cookies().get("preferredSignInView")?.value || null;
    viewProp = getDefaultSignInView(preferredSignInView);
    return redirect(`/signin/${viewProp}`);
  }

  // Check if the user is already logged in and redirect to the account page if so
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && viewProp !== "update_password") {
    return redirect("/me");
  } else if (!user && viewProp === "update_password") {
    return redirect("/signin");
  }

  return (
    <div className="w-full lg:grid lg:grid-cols-2 min-h-[calc(100vh-65px)]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">
              {viewProp === "forgot_password"
                ? t("reset-password")
                : viewProp === "update_password"
                  ? t("update-password")
                  : viewProp === "signup"
                    ? t("sign-up")
                    : t("sign-in")}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {t("email-sign-in")}
            </p>
          </div>
          <div className="grid gap-2">
            {viewProp === "password_signin" && (
              <PasswordSignIn
                lng={params.lng}
                allowEmail={allowEmail}
                redirectMethod={redirectMethod}
              />
            )}
            {viewProp === "email_signin" && (
              <EmailSignIn
                lng={params.lng}
                allowPassword={allowPassword}
                redirectMethod={redirectMethod}
                disableButton={searchParams.disable_button}
              />
            )}
            {viewProp === "forgot_password" && (
              <ForgotPassword
                lng={params.lng}
                allowEmail={allowEmail}
                redirectMethod={redirectMethod}
                disableButton={searchParams.disable_button}
              />
            )}
            {viewProp === "update_password" && (
              <UpdatePassword
                lng={params.lng}
                redirectMethod={redirectMethod}
              />
            )}
            {viewProp === "signup" && (
              <>
                <SignUp
                  lng={params.lng}
                  allowEmail={allowEmail}
                  redirectMethod={redirectMethod}
                />
                <OauthSignIn />
                <Separator text={t("sign-in-link-text-2")} />

                <p className="font-light text-sm text-center">
                  <Link href="/signin/password_signin">
                    {t("sign-email-password")}
                  </Link>
                </p>
                {allowEmail && (
                  <p className="font-light text-sm text-center">
                    <Link href="/signin/email_signin">
                      {t("sign-in-magic")}
                    </Link>
                  </p>
                )}
              </>
            )}
            {viewProp !== "update_password" &&
              viewProp !== "signup" &&
              allowOauth && (
                <>
                  <Separator text={t("third-party-providers")} />
                  <OauthSignIn />
                </>
              )}
          </div>
        </div>
      </div>
      <div className="hidden lg:flex bg-slate-100 dark:bg-slate-800 justify-center items-center">
        <Logo height={75} />
      </div>
    </div>
  );
}
