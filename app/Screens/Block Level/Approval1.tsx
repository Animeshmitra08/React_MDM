import Filter1 from "@/Components/DashboardFilterComponent/Filter1";
import RDatatable from "@/Components/Datatable/RDatatable";
import DialogComponent from "@/Components/DialogComponent";
import RNInput from "@/Components/RNInput";
import { useAlert } from "@/Services/AlertContext";
import { useData } from "@/Services/dataProvider";
import {
  Approval12Api,
  Approval1Api,
  BlockMaterialApproval1,
  PlantData,
} from "@/src/services/MdmAPPApi";
import { AppMDMThemeColors } from "@/src/theme/color";
import { handleNullUndefined } from "@/utils/errorHandler";
import React, { useEffect, useMemo, useState } from "react";
import { Avatar } from "react-native-paper";

type DialogStep = "NONE" | "CHOOSE" | "REMARKS";

const Approval1 = () => {
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
  console.log(currentUser, "Current User");

  const ApiDataFunc = async () => {
    try {
      if (plant !== null && plant !== undefined) {
        setLoading(true);
        const response = await BlockMaterialApproval1.post({
          fDate: fromDate ? fromDate.toISOString().split("T")[0] : "string",
          tDate: toDate ? toDate.toISOString().split("T")[0] : "string",
          plantIds: plant === "all" ? ["string"] : [plant],
        });
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
  // useEffect(() => {
  //   if (plantApiData && Array.isArray(plantApiData)) {
  //     setPlant(plantApiData?.map((each) => each?.id));
  //   }
  // }, [plant]);

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
      isblock: actionType === "Accepted" ? 1 : 0,
      blockApp1Remark: remarks,
      blockAppr1On: new Date().toISOString(),
      blockAppr1By: currentUser?.username || "user",
      mode: "B",
    });
    console.log(req, "Response", "Api Fit");
    showAlert(req, "success");
    closeDialog();
    await ApiDataFunc();
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
                icon="block-helper"
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
                icon="cancel"
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
            key: "materiaL_Code",
            title: " Material Code",
            render: (row) => `${handleNullUndefined(row.maT_CODE)}`,
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
              `${handleNullUndefined(row.storage_Code)} - ${handleNullUndefined(
                row.storage
              )}`,
            width: 170,
          },
          {
            key: "materiaL_Type",
            title: " Material Type",
            render: (row) =>
              `${handleNullUndefined(
                row.materialType_Code
              )} - ${handleNullUndefined(row.materialTypeName)}`,
          },
          {
            key: "Block_By",
            title: "Bloack By",
            render: (row) => `${handleNullUndefined(row.blockBy)}`,
          },
          {
            key: "Bloack_on",
            title: "Bloack On",
            render: (row) =>
              ` ${handleNullUndefined(row.blockOn)?.split("T")[0]} - ${
                handleNullUndefined(row.blockOn)?.split("T")[1].split(".")[0]
              }`,
          },
          {
            key: "User_Block_Remark",
            title: "User Block Remark",
            render: (row) => `${handleNullUndefined(row.blockUserRemark)}`,
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
