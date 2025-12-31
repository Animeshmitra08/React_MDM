import Filter1 from "@/Components/DashboardFilterComponent/Filter1";
import RDatatable from "@/Components/Datatable/RDatatable";
import DialogComponent from "@/Components/DialogComponent";
import RNInput from "@/Components/RNInput";
import { useAlert } from "@/Services/AlertContext";
import { useData } from "@/Services/dataProvider";
import {
  Approval12Api,
  Approval1Api,
  PlantData,
} from "@/src/services/MdmAPPApi";
import { AppMDMThemeColors } from "@/src/theme/color";
import { MaterialMaster, PlantMaster } from "@/src/types/ApprovalType";
import { handleNullUndefined } from "@/utils/errorHandler";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Avatar, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type DialogStep = "NONE" | "CHOOSE" | "REMARKS";

const Approval1 = () => {
  const { showAlert } = useAlert();
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [plant, setPlant] = useState<string | null>(null);
  // const [plantApiData, setPlantApiData] = useState<PlantMaster[]>();

  const [dialogStep, setDialogStep] = useState<DialogStep>("NONE");
  const [selectedItem, setSelectedItem] = useState<MaterialMaster | null>();
  const [actionType, setActionType] = useState<"Accepted" | "Rejected" | "">(
    ""
  );
  const [remarks, setRemarks] = useState("");
  const [ApiData, setApiData] = useState<MaterialMaster[]>([]);
  const [loading, setLoading] = useState(false);

  const { currentUser, plantApiData } = useData();

  const router = useRouter();

  useEffect(() => {
    const firstDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
      0,
      0,
      0,
      0
    );
    setFromDate(firstDay);
    setToDate(today);
  }, [today]);

  useEffect(() => {
    if (plantApiData?.length) {
      ApiDataFunc();
    }
  }, [plantApiData]);

  const toISODate = (d: Date) =>
    new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];

  const ApiDataFunc = async () => {
    if (!fromDate || !toDate) return;

    let plantIds: string[] = [];

    if (!plant) {
      // cleared → all plants
      plantIds = plantApiData?.map((p) => p.id).filter(Boolean) ?? [];
    } else if (plant === "all") {
      plantIds = plantApiData?.map((p) => p.id).filter(Boolean) ?? [];
    } else {
      plantIds = [plant];
    }

    // ⛔ stop API call if plantIds is empty
    if (!plantIds.length) return;

    const payload = {
      fDate: toISODate(fromDate),
      tDate: toISODate(toDate),
      plantIds,
    };

    try {
      setLoading(true);
      const response = await Approval1Api.post(payload);
      setApiData(response);
    } catch (err) {
      console.error("Error fetching Approval1 data:", err);
    } finally {
      setLoading(false);
    }
  };

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
      appR1_STATUS: actionType === "Accepted" ? 1 : 0,
      appR1_REMARK: remarks,
      appR1_ON: new Date().toISOString(),
      appR1_BY: currentUser?.username || "user",
      mode: "C",
    });

    showAlert(req, "success");
    await ApiDataFunc();
    // console.log(req, "Response", "Api Fit");
    closeDialog();
  };
  // useEffect(() => {
  //   ApiDataFunc();
  // }, [plantApiData]);

  return (
    <>
      <ScrollView style={{ flex: 1 }}>
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
          onApply={ApiDataFunc}
        />
        <RDatatable
          loading={loading}
          data={ApiData}
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
                `${handleNullUndefined(
                  row.storage_Code
                )} - ${handleNullUndefined(row.storage)}`,
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
