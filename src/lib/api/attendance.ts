import { api } from "./axios";
import {
  logInResponseSchema,
  logOutResponseSchema,
  attendanceStatusResponseSchema,
} from "@/lib/validation/attendance";
import type {
  LogInResponse,
  LogOutResponse,
  AttendanceStatusResponse,
} from "@/lib/validation/attendance";

export const logInAttendance = async (): Promise<LogInResponse> => {
  try {
    const res = await api.post("/attendance/log-in/");
    const validated = logInResponseSchema.parse(res.data);
    return validated;
  } catch (error: any) {
    throw {
      message: error.message || "Log in failed",
      details: error,
    };
  }
};

export const logOutAttendance = async (): Promise<LogOutResponse> => {
  try {
    const res = await api.post("/attendance/log-out/");
    const validated = logOutResponseSchema.parse(res.data);
    return validated;
  } catch (error: any) {
    throw {
      message: error.message || "Log out failed",
      details: error,
    };
  }
};

export const getAttendanceStatus =
  async (): Promise<AttendanceStatusResponse> => {
    try {
      const res = await api.get("/attendance/my-status/");
      const validated = attendanceStatusResponseSchema.parse(res.data);
      return validated;
    } catch (error: any) {
      throw {
        message: error.message || "Failed to fetch attendance status",
        details: error,
      };
    }
  };
