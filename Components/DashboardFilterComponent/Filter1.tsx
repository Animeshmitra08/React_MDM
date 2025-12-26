import React, { useEffect, useMemo, useState } from "react";
import DateTimeComponent from "../DateTimeComponent";

function Filter1() {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    const firstDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    setFromDate(firstDayOfMonth);
    setToDate(today); // optional but sensible default
  }, [today]);

  return (
    <>
      {/* From Date */}
      <DateTimeComponent
        label="From Date"
        date={fromDate}
        type="date"
        setDate={setFromDate}
        maximumDate={today}
      />

      {/* To Date */}
      <DateTimeComponent
        label="To Date"
        date={toDate}
        type="date"
        setDate={setToDate}
        disabled={!fromDate}
        minimumDate={fromDate ?? undefined}
        maximumDate={today}
      />
    </>
  );
}

export default Filter1;