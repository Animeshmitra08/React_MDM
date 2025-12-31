import Filter1 from "@/Components/DashboardFilterComponent/Filter1";
import RDatatable from "@/Components/Datatable/RDatatable";
import DialogComponent from "@/Components/DialogComponent";
import RNInput from "@/Components/RNInput";
import { useAlert } from "@/Services/AlertContext";
import { useData } from "@/Services/dataProvider";
import {
  Approval12Api,
  Approval2Api,
  PlantData,
} from "@/src/services/MdmAPPApi";
import { AppMDMThemeColors } from "@/src/theme/color";
import { MaterialMaster, PlantMaster } from "@/src/types/ApprovalType";
import { handleNullUndefined } from "@/utils/errorHandler";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Avatar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type DialogStep = "NONE" | "CHOOSE" | "REMARKS";

const Approval2 = () => {
  const { showAlert } = useAlert();
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [plant, setPlant] = useState<string | null>(null);
  // const [plantApiData, setPlantApiData] = useState<PlantMaster[]>([]);

  const [dialogStep, setDialogStep] = useState<DialogStep>("NONE");
  const [selectedItem, setSelectedItem] = useState<any>();
  const [actionType, setActionType] = useState<"Accepted" | "Rejected" | "">(
    ""
  );
  const [remarks, setRemarks] = useState("");
  const [ApiData, setApiData] = useState<MaterialMaster[]>([]);
  const [loading, setLoading] = useState(false);

  const { currentUser, plantApiData } = useData();

  const ApiDataFunc = async () => {
    if (!fromDate || !toDate || !plantApiData.length) return;

    let plantIds: string[] = [];

    if (!plant || plant === "all") {
      plantIds = plantApiData.map((p) => p.id).filter(Boolean);
    } else {
      plantIds = [plant];
    }

    if (!plantIds.length) return;

    const payload = {
      fDate: fromDate.toISOString().split("T")[0],
      tDate: toDate.toISOString().split("T")[0],
      plantIds,
    };

    try {
      setLoading(true);
      const response = await Approval2Api.post(payload);
      setApiData(response);
    } catch (err) {
      console.error("Error fetching Approval2 data:", err);
    } finally {
      setLoading(false);
    }
  };

  // set default dates
  useEffect(() => {
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    setFromDate(firstDay);
    setToDate(today);
  }, [today]);

  // auto-fetch when filters are ready (optional)
  useEffect(() => {
    if (fromDate && toDate && plantApiData.length) {
      ApiDataFunc();
    }
  }, [plantApiData]);

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
    if (!selectedItem) {
      showAlert("No item selected", "error");
      return;
    }
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

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
        }}
      >
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
                router.push({
                  pathname: "/Screens/MaterialTransactionPage/MatTransPage",
                  params: { trnsId: row.trN_ID },
                });
              },
            },
          ]}
          columns={[
            {
              key: "reQ_CODE",
              title: "Request Code",
              render: (row) => handleNullUndefined(row.reQ_CODE),
              marginLeft: 20,
            },
            {
              key: "PlantName&Code",
              title: "Plant Code & Name",
              // width: 240,
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
                  row.updateD_ON?.split("T")[0]
                )} - ${handleNullUndefined(
                  row.updateD_ON?.split("T")[1].split(".")[0]
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
                `${handleNullUndefined(
                  row.rejecteD_BY
                )} - ${handleNullUndefined(
                  row.rejecteD_ON?.split("T")[0]
                )} - ${handleNullUndefined(
                  row.rejecteD_ON?.split("T")[1].split(".")[0]
                )}`,
            },
          ]}
          pagination={true}
          searchable={true}
          searchKeys={["plant"]}
        />
      </ScrollView>
      <SafeAreaView style={{ marginTop: -30 }}></SafeAreaView>
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
              value={selectedItem.appR1_REMARK}
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
