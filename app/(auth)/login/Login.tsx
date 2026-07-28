"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useSession } from "@/lib/auth-context";
import { notify } from "@/utils";
import Image from "next/image";
import { ROLE_ROUTE } from "@/utils/role-route";

// Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { setSession } = useSession();
  const from = searchParams.get("from");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const res = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      if (res.data) {
        const session = await authClient.getSession();
        setSession(session?.data);

        const user = res.data.user;
        notify.success("Log in successful!");

        router.push(
          from ||
            ROLE_ROUTE[user?.role as keyof typeof ROLE_ROUTE] ||
            "/",
        );
      } else {
        setServerError(res?.error?.message || "Login failed");
        notify.error(res?.error?.message || "Login failed");
      }
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Login failed",
      );
      notify.error(
        error instanceof Error ? error.message : "Login failed",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="flex flex-col items-center pt-8 px-8 pb-0">
          <Link href="/" className="inline-block mb-4">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={200}
              height={200}
              className="mx-auto w-30"
            />
          </Link>
          <CardTitle className="text-3xl font-bold tracking-tight text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground text-center">
            Log in to your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8 space-y-6">
          {/* Server Error */}
          {serverError && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
              {serverError}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <FieldSet>
                {/* Email Field */}
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    autoComplete="email"
                    disabled={isLoading}
                    {...register("email")}
                  />
                  <FieldDescription>Enter your email address</FieldDescription>
                  {errors.email && (
                    <FieldError>{errors.email.message}</FieldError>
                  )}
                </Field>

                {/* Password Field */}
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      disabled={isLoading}
                      {...register("password")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <FieldDescription>Enter your account password</FieldDescription>
                  {errors.password && (
                    <FieldError>{errors.password.message}</FieldError>
                  )}
                </Field>

                {/* Remember Me & Forgot Password */}
                <Field className="flex flex-row items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setValue("rememberMe", checked === true)
                      }
                      disabled={isLoading}
                    />
                    <FieldLabel
                      htmlFor="rememberMe"
                      className="font-normal text-sm cursor-pointer"
                    >
                      Remember me
                    </FieldLabel>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Forgot password?
                  </Link>
                </Field>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Log in"
                  )}
                </Button>
              </FieldSet>
            </FieldGroup>
          </form>

          {/* Register Link */}
          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-primary hover:underline font-medium"
              >
                Create an account
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}