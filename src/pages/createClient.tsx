import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  X,
  Building2,
  FileText,
  UserCheck,
  Save,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { createClientSchema, type CreateClientInput } from "@/lib/validation/client";
import { useCreateClient } from "@/hooks/useCreateClient";
import { useStaffActivity } from "@/hooks/useStaffActivity";

interface CreateClientProps {
  open: boolean;
  onClose: () => void;
}

export function CreateClient({ open, onClose }: CreateClientProps) {
  const { mutate, isPending } = useCreateClient();
  const { data: staffList } = useStaffActivity();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateClientInput>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      business_name: "",
      pan: "",
      tan: "",
      gstin: "",
      address: "",
      assigned_to: undefined,
    },
  });

  if (!open) return null;

  const onSubmit = (data: CreateClientInput) => {
    setServerError(null);
    mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
      onError: (error: any) => {
        let errorMsg = error?.message || "Failed to create client";
        if (error?.response?.data) {
          const data = error.response.data;
          if (typeof data === "string") errorMsg = data;
          else if (typeof data === "object") {
            const msgs = Object.entries(data).map(([k, v]) => `${k}: ${Array.isArray(v) ? v[0] : v}`);
            errorMsg = msgs.join(" | ");
          }
        }
        setServerError(errorMsg);
      },
    });
  };

  const handleReset = () => {
    reset();
    setServerError(null);
  };

  return (
    /* ── Backdrop ── */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(6px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* ── Modal Card ── */}
      <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Building2 className="h-5 w-5" />
            Create New Client
          </CardTitle>
          <CardDescription>
            Fill in the client details to add them to your firm
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Server error */}
            {serverError && (
              <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">
                {serverError}
              </div>
            )}

            {/* ── Section 1: Business Information ── */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                <Building2 className="h-4 w-4" />
                Business Information
              </div>
              <Separator />

              <div className="grid gap-6 md:grid-cols-2">
                {/* Business Name */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="business_name">
                    Business Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="business_name"
                    placeholder="e.g. SkillUno Labs LLP"
                    className="h-10"
                    {...register("business_name")}
                  />
                  {errors.business_name && (
                    <p className="text-sm text-destructive">
                      {errors.business_name.message}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">
                    Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="address"
                    placeholder="e.g. Door 173, Pattambi"
                    className="h-10"
                    {...register("address")}
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Section 2: Tax Details ── */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                <FileText className="h-4 w-4" />
                Tax Details
              </div>
              <Separator />

              <div className="grid gap-6 md:grid-cols-3">
                {/* PAN */}
                <div className="space-y-2">
                  <Label htmlFor="pan">PAN</Label>
                  <Input
                    id="pan"
                    placeholder="e.g. ABCDE1234F"
                    className="h-10"
                    {...register("pan")}
                  />
                </div>

                {/* TAN */}
                <div className="space-y-2">
                  <Label htmlFor="tan">TAN</Label>
                  <Input
                    id="tan"
                    placeholder="e.g. DELA12345B"
                    className="h-10"
                    {...register("tan")}
                  />
                </div>

                {/* GSTIN */}
                <div className="space-y-2">
                  <Label htmlFor="gstin">GSTIN</Label>
                  <Input
                    id="gstin"
                    placeholder="e.g. 29ABCDE1234F1Z5"
                    className="h-10"
                    {...register("gstin")}
                  />
                </div>
              </div>
            </div>

            {/* ── Section 3: Assignment ── */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                <UserCheck className="h-4 w-4" />
                Assignment
              </div>
              <Separator />

              <div className="grid gap-6 md:grid-cols-2">
                {/* Assigned To */}
                <div className="space-y-2">
                  <Label htmlFor="assigned_to">
                    Assign To <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={watch("assigned_to")?.toString() || ""}
                    onValueChange={(value) =>
                      setValue("assigned_to", Number(value), {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger id="assigned_to" className="h-10 w-full">
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffList?.map((staff) => (
                        <SelectItem
                          key={staff.id}
                          value={staff.id.toString()}
                        >
                          {staff.fullName} ({staff.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.assigned_to && (
                    <p className="text-sm text-destructive">
                      {errors.assigned_to.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Form Actions ── */}
            <Separator />
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="gap-2"
                disabled={isPending}
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button type="submit" className="gap-2" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isPending ? "Creating..." : "Create Client"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
