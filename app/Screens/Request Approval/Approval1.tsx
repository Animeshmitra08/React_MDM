import Filter1 from '@/Components/DashboardFilterComponent/Filter1'
import RDatatable from '@/Components/Datatable/RDatatable';
import React, { useEffect, useMemo, useState } from 'react'
import { Avatar } from 'react-native-paper';

export interface SampleTransactionProps {
  sampleCode: string;
  sampleName?: string;
  sample_Name?: string;

  plantName?: string;
  plant_Name?: string;

  deptName?: string;
  dept_Name?: string;

  subDeptName?: string;
  subDpt_Name?: string;

  analysisCode: string;
  shift: string;

  sampleCollectionDate: string; // ISO
  sampleCollectionTime: string;

  status: number; // 10 = Registered, 20 = Received
}


const SAMPLE_DATA: SampleTransactionProps[] = [
    {
        sampleCode: "SMP-1001",
        sample_Name: "Raw Water Intake",
        plant_Name: "Plant A",
        dept_Name: "Quality",
        subDpt_Name: "Water Testing",
        analysisCode: "ANL-WT-01",
        shift: "A",
        sampleCollectionDate: "2025-09-01T08:30:00",
        sampleCollectionTime: "08:30",
        status: 10,
    },
    {
        sampleCode: "SMP-1002",
        sampleName: "Boiler Feed Water",
        plantName: "Plant A",
        deptName: "Utilities",
        subDeptName: "Boiler",
        analysisCode: "ANL-BL-02",
        shift: "B",
        sampleCollectionDate: "2025-09-01T14:15:00",
        sampleCollectionTime: "14:15",
        status: 20,
    },
    {
        sampleCode: "SMP-1003",
        sample_Name: "Cooling Tower Water",
        plant_Name: "Plant B",
        dept_Name: "Maintenance",
        subDpt_Name: "Cooling Systems",
        analysisCode: "ANL-CT-03",
        shift: "C",
        sampleCollectionDate: "2025-09-02T22:45:00",
        sampleCollectionTime: "22:45",
        status: 10,
    },
    {
        sampleCode: "SMP-1004",
        sampleName: "Process Effluent",
        plantName: "Plant C",
        deptName: "Production",
        subDeptName: "Chemical Line",
        analysisCode: "ANL-PE-04",
        shift: "A",
        sampleCollectionDate: "2025-09-03T09:10:00",
        sampleCollectionTime: "09:10",
        status: 20,
    },
    {
        sampleCode: "SMP-1005",
        sample_Name: "RO Permeate",
        plant_Name: "Plant B",
        dept_Name: "Quality",
        subDpt_Name: "RO Plant",
        analysisCode: "ANL-RO-05",
        shift: "B",
        sampleCollectionDate: "2025-09-03T16:50:00",
        sampleCollectionTime: "16:50",
        status: 10,
    },
    ];

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
    <>
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

    <RDatatable
    data={SAMPLE_DATA}
    actions={[
    {
      key: "view",
      render: row => (
        <Avatar.Icon
          size={28}
          icon="eye"
          style={{ backgroundColor: "#2563eb" }}
        />
      ),
      onPress: row => console.log("View", row),
    },
    {
      key: "edit",
      render: row => (
        <Avatar.Icon
          size={28}
          icon="pencil"
          style={{ backgroundColor: "#16a34a" }}
        />
      ),
      onPress: row => console.log("Edit", row),
    },
  ]}
    columns={[
        {
        key: "sampleCode",
        title: "Sample Code",
        width: 160,
        },
        {
        key: "sampleName",
        title: "Sample",
        width: 240,
        render: row => row.sample_Name || row.sampleName,
        },
        {
        key: "plantName",
        title: "Plant",
        render: row => row.plant_Name || row.plantName,
        },
        {
        key: "sampleCollectionDate",
        title: "Sample Date",
        render: row => row.sampleCollectionDate.split("T")[0],
        },
        {
        key: "status",
        title: "Status",
        render: row =>
            row.status === 10 ? "Registered" : "Received",
        },
    ]}
    />
    </>
  );
}

export default Approval1