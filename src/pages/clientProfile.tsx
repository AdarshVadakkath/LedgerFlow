import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClient } from "@/hooks/useClient";
import { EditClient } from "@/pages/editClient";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  FileText,
  UserCheck,
  ArrowLeft,
  MapPin,
  ClipboardList,
  CalendarDays,
  Loader2,
  Mail,
  User,
} from "lucide-react";

export default function ClientProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // If id is not present, we can just optionally handle it or let the query fail gracefully
  const { data: client, isLoading, isError } = useClient(id as string);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !client) {
    return (
      <div className="flex flex-col h-[50vh] w-full items-center justify-center space-y-4">
        <p className="text-xl font-semibold">Client not found</p>
        <Button variant="outline" onClick={() => navigate("/clients")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go back
        </Button>
      </div>
    );
  }

  const createdDate = new Date(client.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="container max-w-full space-y-8 p-4 lg:p-6 pb-16">
      {/* ── Header Section ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/clients")}
            className="hidden sm:flex"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Building2 className="h-6 w-6 text-muted-foreground" />
              {client.businessName}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {client.address}
              <span className="px-1">•</span>
              <CalendarDays className="h-3.5 w-3.5" />
              Created on {createdDate}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>Edit Details</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* ── Left Column: Basic & Tax Details ── */}
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/30">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Tax Identity Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x border-t">
                <div className="p-6 flex flex-col gap-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    PAN
                  </span>
                  <span className="text-lg font-semibold">
                    {client.pan || "N/A"}
                  </span>
                </div>
                <div className="p-6 flex flex-col gap-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    TAN
                  </span>
                  <span className="text-lg font-semibold">
                    {client.tan || "N/A"}
                  </span>
                </div>
                <div className="p-6 flex flex-col gap-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    GSTIN
                  </span>
                  <span className="text-lg font-semibold">
                    {client.gstin || "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                Active Tasks Overview
              </CardTitle>
              <CardDescription>
                A high-level view of ongoing and total workloads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 p-4 rounded-xl border bg-muted/20">
                  <span className="text-sm font-medium text-muted-foreground">
                    Open Tasks
                  </span>
                  <div className="flex items-end gap-3">
                    <span className="text-3xl font-bold">
                      {client.openTasks}
                    </span>
                    {client.openTasks > 0 && (
                      <Badge variant="secondary" className="mb-1">
                        Pending Actions
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 p-4 rounded-xl border bg-muted/20">
                  <span className="text-sm font-medium text-muted-foreground">
                    Total Historical Tasks
                  </span>
                  <div className="flex items-end gap-3">
                    <span className="text-3xl font-bold">
                      {client.totalTasks}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Right Column: Assigned Staff & Documents ── */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                Assigned Expert
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {client.assignedToDetail.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      {client.assignedToDetail.fullName}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {client.assignedToDetail.role}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {client.assignedToDetail.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      Staff ID: #{client.assignedToDetail.id}
                    </span>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-2">
                  Reassign Staff
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Edit Client Modal */}
      {client && (
        <EditClient
          open={isEditModalOpen}
          client={client}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
}
