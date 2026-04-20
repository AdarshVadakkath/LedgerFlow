import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/provider/modeToggle";
import { TimeLogModal } from "@/components/time-log-modal";
import { BellIcon, Clock } from "lucide-react";
import { useLocation } from "react-router-dom";

export function SiteHeader() {
  const location = useLocation();
  const path = location.pathname;
  const [timeLogOpen, setTimeLogOpen] = useState(false);

  let title = "Dashboard";
  if (path.startsWith("/clients")) title = "Clients";
  else if (path.startsWith("/tasks/add")) title = "Add Task";
  else if (path.startsWith("/tasks/new")) title = "New Task";
  else if (path.startsWith("/tasks")) title = "Tasks";
  else if (path.startsWith("/documents")) title = "Documents";
  else if (path.startsWith("/attendance")) title = "Attendance";
  else if (path.startsWith("/profile")) title = "Profile";

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">{title}</h1>

          {/* Right side - Time Log, Notifications, Mode Toggle */}
          <div className="ml-auto flex items-center gap-2">
            <Button
              id="time-log-open-btn"
              variant="outline"
              size="sm"
              className="gap-2 font-medium"
              onClick={() => setTimeLogOpen(true)}
            >
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Time Log</span>
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <BellIcon className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <ModeToggle />
          </div>
        </div>
      </header>

      <TimeLogModal open={timeLogOpen} onOpenChange={setTimeLogOpen} />
    </>
  );
}
