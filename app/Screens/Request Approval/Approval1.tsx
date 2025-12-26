import Filter1 from "@/Components/DashboardFilterComponent/Filter1";
import RDatatable from "@/Components/Datatable/RDatatable";
import DialogComponent from "@/Components/DialogComponent";
import RNInput from "@/Components/RNInput";
import {
  Approval12Api,
  Approval1Api,
  PlantData,
} from "@/src/services/MdmAPPApi";
import React, { useEffect, useMemo, useState } from "react";
import { Avatar } from "react-native-paper";

type DialogStep = "NONE" | "CHOOSE" | "REMARKS";

const Approval1 = () => {
  const today = useMemo(() => new Date(), []);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [plant, setPlant] = useState<any>();
  const [plantApiData, setPlantApiData] = useState<any>();

  const [dialogStep, setDialogStep] = useState<DialogStep>("NONE");
  const [selectedItem, setSelectedItem] = useState<any>();
  const [actionType, setActionType] = useState<"Accepted" | "Rejected" | "">(
    ""
  );
  const [remarks, setRemarks] = useState("");
  const [ApiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const ApiDataFunc = async () => {
    try {
      setLoading(true);
      const response = await Approval1Api.post({
        fDate: fromDate ? fromDate.toISOString().split("T")[0] : "string",
        tDate: toDate ? toDate.toISOString().split("T")[0] : "string",
        plantIds: plant === "all" ? ["string"] : [plant],
      });
      setApiData(response);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching Approval1 data:", err);
    }
  };
  const ApiDataPlant = async () => {
    try {
      const response = await PlantData.GetAll();
      setPlantApiData(response);
    } catch (error) {
      console.error("Error fetching Approval1 data:", error);
    }
  };
  useEffect(() => {
    ApiDataPlant();
    ApiDataFunc();
  }, []);

  useEffect(() => {
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    setFromDate(firstDay);
    setToDate(today);
  }, [today]);

  const closeDialog = () => {
    setDialogStep("NONE");
    setSelectedItem(null);
    setActionType("");
    setRemarks("");
  };

  const submitAction = async () => {
    console.log({
      item: selectedItem,
      action: actionType,
      remarks,
    });
    const req = await Approval12Api.post({
      ...selectedItem,
      appR1_STATUS: actionType === "Accepted" ? 1 : 0,
      appR1_REMARKS: remarks,
      appR1_ON: new Date().toISOString(),
      // appR1_BY: "CurrentUser",
    });
    console.log(req, "Response", "Api Fit");
    closeDialog();
  };
  return (
    <>
      <Filter1
        today={today}
        fromDate={fromDate}
        toDate={toDate}
        plant={plant}
        plantData={plantApiData}
        onFromDateChange={(d) => {
          setFromDate(d);
          if (toDate && d > toDate) setToDate(d);
        }}
        onToDateChange={setToDate}
        onPlantChange={setPlant}
        onApply={async () => ApiDataFunc()}
      />

      <RDatatable
        loading={loading}
        data={ApiData || []}
        actions={[
          {
            key: "edit-accept",
            render: () => (
              <Avatar.Icon
                size={28}
                icon="thumb-up"
                style={{ backgroundColor: "#16a34a" }}
              />
            ),
            onPress: (row) => {
              setSelectedItem(row);
              setDialogStep("CHOOSE");
              setActionType("Accepted");
              setDialogStep("REMARKS");
            },
          },
          {
            key: "edit-reject",
            render: () => (
              <Avatar.Icon
                size={28}
                icon="thumb-down"
                style={{ backgroundColor: "#16a34a" }}
              />
            ),
            onPress: (row) => {
              setSelectedItem(row);
              setDialogStep("CHOOSE");
              setActionType("Rejected");
              setDialogStep("REMARKS");
            },
          },
          {
            key: "view",
            render: () => (
              <Avatar.Icon
                size={28}
                icon="eye"
                style={{ backgroundColor: "#2563eb" }}
              />
            ),
            onPress: (row) => {
              setSelectedItem(row);
            },
          },
        ]}
        columns={[
          {
            key: "reQ_CODE",
            title: "RequestCode",
            render: (row) => row.reQ_CODE,
            marginLeft: 20,
          },
          {
            key: "PlantName&Code",
            title: "Plant Code & Name",
            width: 240,
            render: (row) => `${row.plant_code} - ${row.plant}`,
          },
          {
            key: "StorageCode&Name",
            title: "Storage Code & Name",
            render: (row) => `${row.storage_Code} - ${row.storage}`,
            width: 170,
          },
          {
            key: "materiaL_TYPE",
            title: " Material Type",
            render: (row) =>
              `${row.materialType_Code} - ${row.materialTypeName}`,
          },
          {
            key: "Created",
            title: "Created",
            render: (row) =>
              `${row.entereD_BY} - ${row.entereD_ON?.split("T")[0]} - ${
                row.entereD_ON?.split("T")[1].split(".")[0]
              }`,
          },
        ]}
        pagination={true}
        searchable={true}
        pageSize={5}
        searchKeys={["plant"]}
      />
      <DialogComponent
        visible={dialogStep !== "NONE"}
        title={`${actionType} Confirmation`}
        onDismiss={closeDialog}
        actions={[
          {
            label: "Submit",
            mode: "contained",
            onPress: submitAction,
          },
          {
            label: "Close",
            onPress: closeDialog,
          },
        ]}
      >
        {dialogStep === "REMARKS" && selectedItem && (
          <>
            <RNInput
              label="Request Number"
              disabled
              value={selectedItem.reQ_CODE}
              icon="format-list-numbered"
            />

            <RNInput
              label="Enter Remarks**"
              value={remarks}
              icon="grease-pencil"
              onChangeText={setRemarks}
            />
          </>
        )}
      </DialogComponent>
    </>
  );
};

export default Approval1;
