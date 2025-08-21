import { useState, useEffect, useCallback } from "react";
import scheduleService from "../api/scheduleService";

export const useSchedule = (userType, email) => {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get schedule for a specific month
  const getSchedule = useCallback(
    async (month) => {
      if (!userType || !email || !month) return;

      setLoading(true);
      setError(null);

      try {
        const response = await scheduleService.getAvailableDays(
          userType,
          email,
          month
        );
        setSchedule(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch schedule");
      } finally {
        setLoading(false);
      }
    },
    [userType, email]
  );

  // Mark days as unavailable
  const markUnavailable = async (dates) => {
    setLoading(true);
    setError(null);

    try {
      const response = await scheduleService.markUnavailable(
        userType,
        email,
        dates
      );
      return response;
    } catch (err) {
      setError(err.message || "Failed to mark days unavailable");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mark days as available
  const markAvailable = async (dates) => {
    setLoading(true);
    setError(null);

    try {
      const response = await scheduleService.unmarkAvailable(
        userType,
        email,
        dates
      );
      return response;
    } catch (err) {
      setError(err.message || "Failed to mark days available");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Lock days
  const lockDays = async (dates, tripId = null) => {
    setLoading(true);
    setError(null);

    try {
      const response = await scheduleService.lockDays(
        userType,
        email,
        dates,
        tripId
      );
      return response;
    } catch (err) {
      setError(err.message || "Failed to lock days");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    schedule,
    loading,
    error,
    getSchedule,
    markUnavailable,
    markAvailable,
    lockDays,
    setError,
  };
};
