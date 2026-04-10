import { useLogin } from "@/hooks/useLogin";
import {
  useLogIn,
  useLogOut,
  useAttendanceStatus,
} from "@/hooks/useAttendance";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * LOGIN EXAMPLE COMPONENT
 * Shows how to use useLogin hook with form validation
 */
export const LoginExample = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const loginMutation = useLogin();
  const { user } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginMutation.mutateAsync(formData);
      // Success! User logged in and token stored
      console.log("Login successful");
    } catch (error: any) {
      console.error("Login failed:", error.message);
    }
  };

  if (user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user.full_name}!</CardTitle>
          <CardDescription>You are now logged in</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Input
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </Button>
          {loginMutation.error && (
            <p className="text-red-500 text-sm">
              Error: {(loginMutation.error as any).message}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

/**
 * ATTENDANCE EXAMPLE COMPONENT
 * Shows how to log in/out and check attendance status
 */
export const AttendanceExample = () => {
  const logInMutation = useLogIn();
  const logOutMutation = useLogOut();
  const { data: status, isLoading } = useAttendanceStatus();
  const { user } = useAuth();

  if (!user) {
    return <p>Please login first</p>;
  }

  const handleLogIn = async () => {
    try {
      await logInMutation.mutateAsync();
      console.log("Logged in successfully");
    } catch (error: any) {
      console.error("Log in error:", error.message);
    }
  };

  const handleLogOut = async () => {
    try {
      await logOutMutation.mutateAsync();
      console.log("Logged out successfully");
    } catch (error: any) {
      console.error("Log out error:", error.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Tracking</CardTitle>
        <CardDescription>Manage your daily attendance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status && (
          <div className="space-y-2">
            <p>
              <strong>Status:</strong> {status.status || "Not marked"}
            </p>
            {status.log_in_time && (
              <p>
                <strong>Logged In:</strong> {status.log_in_time}
              </p>
            )}
            {status.log_out_time && (
              <p>
                <strong>Logged Out:</strong> {status.log_out_time}
              </p>
            )}
            {status.duration && (
              <p>
                <strong>Duration:</strong> {status.duration}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleLogIn}
            disabled={logInMutation.isPending || isLoading}
            variant="default"
          >
            {logInMutation.isPending ? "Logging In..." : "Log In"}
          </Button>
          <Button
            onClick={handleLogOut}
            disabled={logOutMutation.isPending || isLoading}
            variant="destructive"
          >
            {logOutMutation.isPending ? "Logging Out..." : "Log Out"}
          </Button>
        </div>

        {logInMutation.error && (
          <p className="text-red-500 text-sm">
            Log in error: {(logInMutation.error as any).message}
          </p>
        )}
        {logOutMutation.error && (
          <p className="text-red-500 text-sm">
            Log out error: {(logOutMutation.error as any).message}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

