import { zodResolver } from "@hookform/resolvers/zod";
import logo from "@/assets/logo.svg";
import FieldWrapper from "@/components/partials/field-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSignInMutation } from "@/features/auth/api/mutation";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const signInMutation = useSignInMutation();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { handleSubmit } = form;
  const redirectTo =
    typeof location.state === "object" &&
    location.state !== null &&
    "from" in location.state &&
    typeof location.state.from === "object" &&
    location.state.from !== null &&
    "pathname" in location.state.from &&
    typeof location.state.from.pathname === "string"
      ? location.state.from.pathname
      : "/candidates";

  const signIn = async (data: LoginFormValues) => {
    try {
      await signInMutation.mutateAsync(data);
      toast.success("Signed in successfully");
      navigate(redirectTo);
    } catch {
      toast.error("Unable to sign in. Check your credentials and try again.");
    }
  };

  return (
    <FormProvider {...form}>
      <Card className="w-full max-w-lg border-[#ccd1ff] bg-white/95 shadow-[0_24px_80px_rgba(0,26,255,0.12)] backdrop-blur">
        <CardHeader>
          <div className="text-center">
            <img src={logo} className="mx-auto mb-4 " alt="techkraft logo" />
            <CardTitle>Sign in to your account</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit(signIn)}>
            <FieldWrapper
              type="email"
              label="Email"
              name="username"
              placeholder="you@example.com"
              required
            />
            <FieldWrapper
              type="password"
              label="Password"
              name="password"
              placeholder="Enter your password"
              required
            />
            <Button
              className="mt-6"
              type="submit"
              disabled={signInMutation.isPending}
            >
              {signInMutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
}
