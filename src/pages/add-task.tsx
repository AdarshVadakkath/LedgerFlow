import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  ArrowLeft,
  Building2,
  User,
  FileText,
  Save,
  RotateCcw,
} from "lucide-react";

interface AddTaskProps {
  onBack: () => void;
}

const entityTypes = [
  "Individual",
  "Proprietorship",
  "Partnership Firm",
  "LLP (Limited Liability Partnership)",
  "Private Limited Company",
  "Public Limited Company",
  "HUF (Hindu Undivided Family)",
  "Trust",
  "Society",
  "AOP/BOI",
  "Government Entity",
  "Other",
];

const assignedManagers = [
  "CA Rajesh Kumar",
  "CA Priya Sharma",
  "CA Amit Patel",
  "CA Sneha Gupta",
  "CA Vikram Singh",
  "CA Deepa Nair",
  "CA Arjun Mehta",
  "CA Kavita Joshi",
];

export function AddTask({ onBack }: AddTaskProps) {
  const [formData, setFormData] = useState({
    fullEntityName: "",
    entityType: "",
    panNumber: "",
    gstinNumber: "",
    emailAddress: "",
    phoneNumber: "",
    registeredAddress: "",
    assignedManager: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Future: API integration
    console.log("Task submitted:", formData);
  };

  const handleReset = () => {
    setFormData({
      fullEntityName: "",
      entityType: "",
      panNumber: "",
      gstinNumber: "",
      emailAddress: "",
      phoneNumber: "",
      registeredAddress: "",
      assignedManager: "",
    });
  };

  return (
    <div className="container max-w-full space-y-6 p-4 lg:p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Add New Task</h1>
            <p className="text-muted-foreground">
              Create a new task by filling in the entity details below
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5" />
              Entity Details
            </CardTitle>
            <CardDescription>
              Enter the complete details of the entity for this task
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* ── Section 1: Basic Information ── */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                <Building2 className="h-4 w-4" />
                Basic Information
              </div>
              <Separator />

              <div className="grid gap-6 md:grid-cols-2">
                {/* Full Entity Name */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="fullEntityName">
                    Full Entity Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="fullEntityName"
                    placeholder="e.g. ABC Enterprises Pvt. Ltd."
                    value={formData.fullEntityName}
                    onChange={(e) =>
                      handleInputChange("fullEntityName", e.target.value)
                    }
                    className="h-10"
                    required
                  />
                </div>

                {/* Entity Type */}
                <div className="space-y-2">
                  <Label htmlFor="entityType">
                    Entity Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.entityType}
                    onValueChange={(value) =>
                      handleInputChange("entityType", value)
                    }
                    required
                  >
                    <SelectTrigger id="entityType" className="h-10 w-full">
                      <SelectValue placeholder="Select entity type" />
                    </SelectTrigger>
                    <SelectContent>
                      {entityTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* PAN Number */}
                <div className="space-y-2">
                  <Label htmlFor="panNumber">
                    PAN Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="panNumber"
                    placeholder="e.g. ABCDE1234F"
                    value={formData.panNumber}
                    onChange={(e) =>
                      handleInputChange(
                        "panNumber",
                        e.target.value.toUpperCase(),
                      )
                    }
                    maxLength={10}
                    className="h-10 uppercase"
                    required
                  />
                </div>

                {/* GSTIN Number */}
                <div className="space-y-2">
                  <Label htmlFor="gstinNumber">GSTIN Number</Label>
                  <Input
                    id="gstinNumber"
                    placeholder="e.g. 22ABCDE1234F1Z5"
                    value={formData.gstinNumber}
                    onChange={(e) =>
                      handleInputChange(
                        "gstinNumber",
                        e.target.value.toUpperCase(),
                      )
                    }
                    maxLength={15}
                    className="h-10 uppercase"
                  />
                </div>
              </div>
            </div>

            {/* ── Section 2: Contact Information ── */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                <User className="h-4 w-4" />
                Contact Information
              </div>
              <Separator />

              <div className="grid gap-6 md:grid-cols-2">
                {/* Email Address */}
                <div className="space-y-2">
                  <Label htmlFor="emailAddress">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="emailAddress"
                    type="email"
                    placeholder="e.g. contact@abcenterprises.com"
                    value={formData.emailAddress}
                    onChange={(e) =>
                      handleInputChange("emailAddress", e.target.value)
                    }
                    className="h-10"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    maxLength={15}
                    className="h-10"
                    required
                  />
                </div>

                {/* Registered Address */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="registeredAddress">
                    Registered Address{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="registeredAddress"
                    placeholder="Enter the full registered address of the entity"
                    value={formData.registeredAddress}
                    onChange={(e) =>
                      handleInputChange("registeredAddress", e.target.value)
                    }
                    rows={3}
                    className="resize-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* ── Section 3: Assignment ── */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                <User className="h-4 w-4" />
                Assignment
              </div>
              <Separator />

              <div className="grid gap-6 md:grid-cols-2">
                {/* Assigned Manager (CA) */}
                <div className="space-y-2">
                  <Label htmlFor="assignedManager">
                    Assigned Manager (CA){" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.assignedManager}
                    onValueChange={(value) =>
                      handleInputChange("assignedManager", value)
                    }
                    required
                  >
                    <SelectTrigger id="assignedManager" className="h-10 w-full">
                      <SelectValue placeholder="Select a manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {assignedManagers.map((manager) => (
                        <SelectItem key={manager} value={manager}>
                          {manager}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button type="submit" className="gap-2">
                <Save className="h-4 w-4" />
                Create Task
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
