import Filter1 from "@/Components/DashboardFilterComponent/Filter1";
import RDatatable from "@/Components/Datatable/RDatatable";
import DialogComponent from "@/Components/DialogComponent";
import RNInput from "@/Components/RNInput";
import { useAlert } from "@/Services/AlertContext";
import { useData } from "@/Services/dataProvider";
import {
  Approval12Api,
  Approval1Api,
  Approval2Api,
  PlantData,
} from "@/src/services/MdmAPPApi";
import { AppMDMThemeColors } from "@/src/theme/color";
import { handleNullUndefined } from "@/utils/errorHandler";
import React, { useEffect, useMemo, useState } from "react";
import { Avatar } from "react-native-paper";

type DialogStep = "NONE" | "CHOOSE" | "REMARKS";

const Approval2 = () => {
  const { showAlert } = useAlert();
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

  const { currentUser } = useData();

  const ApiDataFunc = async () => {
    try {
      if (plant !== null && plant !== undefined) {
        setLoading(true);
        const response = await Approval2Api.post({
          fDate: fromDate ? fromDate.toISOString().split("T")[0] : "string",
          tDate: toDate ? toDate.toISOString().split("T")[0] : "string",
          plantIds: plant === "all" ? ["string"] : [plant],
        });
        console.log(fromDate, toDate, plant, "Plants");

        setApiData(response);
        setLoading(false);
      }
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
    if (remarks === "") {
      showAlert("Enter Remarks", "error");
      return;
    }
    console.log({
      item: selectedItem,
      action: actionType,
      remarks,
    });
    const req = await Approval12Api.post({
      ...selectedItem,
      appR2_STATUS: actionType === "Accepted" ? 1 : 0,
      appR2_REMARKS: remarks,
      appR2_ON: new Date().toISOString(),
      appR2_BY: currentUser?.username || "user",
      mode: "C",
    });
    await ApiDataFunc();
    showAlert(req, "success");
    console.log(req, "Response", "Api Fit");
    closeDialog();
  };

  // console.log("Apidata", ApiData, "Apidata");
  console.log(selectedItem, "selected");

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
                style={{ backgroundColor: AppMDMThemeColors.approval }}
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
                style={{ backgroundColor: AppMDMThemeColors.rejected }}
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
            render: (row) => handleNullUndefined(row.reQ_CODE),
            marginLeft: 20,
          },
          {
            key: "PlantName&Code",
            title: "Plant Code & Name",
            width: 240,
            render: (row) =>
              `${handleNullUndefined(row.plant_code)} - ${handleNullUndefined(
                row.plant
              )}`,
          },
          {
            key: "StorageCode&Name",
            title: "Storage Code & Name",
            render: (row) =>
              `${
                handleNullUndefined(row.storage_Code) === null
                  ? ""
                  : handleNullUndefined(row.storage_Code)
              } - ${
                handleNullUndefined(row.storage) === null
                  ? ""
                  : handleNullUndefined(row.storage)
              }`,
            width: 170,
          },
          {
            key: "materiaL_TYPE",
            title: " Material Type",
            render: (row) =>
              `${handleNullUndefined(
                row.materialType_Code
              )} - ${handleNullUndefined(row.materialTypeName)}`,
          },
          {
            key: "Created",
            title: "Created",
            render: (row) =>
              `${handleNullUndefined(row.entereD_BY)} - ${handleNullUndefined(
                row.entereD_ON?.split("T")[0]
              )} - ${handleNullUndefined(
                row.entereD_ON?.split("T")[1].split(".")[0]
              )}`,
          },
          {
            key: "Updated",
            title: "Updated",
            render: (row) =>
              `${handleNullUndefined(row.updateD_BY)} - ${handleNullUndefined(
                row.updated_ON?.split("T")[0]
              )} - ${handleNullUndefined(
                row.updated_ON?.split("T")[1].split(".")[0]
              )}`,
          },

          {
            key: "Approved",
            title: "Approved",
            render: (row) =>
              `${handleNullUndefined(row.appR1_BY)} - ${handleNullUndefined(
                row.appR1_ON?.split("T")[0]
              )} - ${handleNullUndefined(
                row.appR1_ON?.split("T")[1].split(".")[0]
              )}`,
          },
          {
            key: "Rejected",
            title: "Rejected",
            render: (row) =>
              `${handleNullUndefined(row.rejecteD_By)} - ${handleNullUndefined(
                row.rejecteD_ON?.split("T")[0]
              )} - ${handleNullUndefined(
                row.rejecteD_ON?.split("T")[1].split(".")[0]
              )}`,
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
              label="Approval Remark 1"
              disabled
              value={selectedItem.appR1_REMARKS}
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

export default Approval2;
