import Filter1 from '@/Components/DashboardFilterComponent/Filter1'
import React, { useEffect, useMemo, useState } from 'react'

const Approval1 = () => {
  const today = useMemo(() => new Date(), []);

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [plant, setPlant] = useState("all");

  useEffect(() => {
    const firstDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    setFromDate(firstDay);
    setToDate(today);
  }, [today]);

  return (
    <Filter1
      today={today}
      fromDate={fromDate}
      toDate={toDate}
      plant={plant}
      onFromDateChange={(d) => {
        setFromDate(d);
        if (toDate && d > toDate) setToDate(d);
      }}
      onToDateChange={setToDate}
      onPlantChange={setPlant}
      onApply={() => {
        console.log({ fromDate, toDate, plant });
      }}
    />
  );
}

export default Approval1