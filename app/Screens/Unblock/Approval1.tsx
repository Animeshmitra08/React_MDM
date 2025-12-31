import Filter1 from "@/Components/DashboardFilterComponent/Filter1";
import RDatatable from "@/Components/Datatable/RDatatable";
import DialogComponent from "@/Components/DialogComponent";
import RNInput from "@/Components/RNInput";
import { useAlert } from "@/Services/AlertContext";
import { useData } from "@/Services/dataProvider";
import {
  Approval12Api,
  PlantData,
  UnBlock1Api,
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

const Approval1 = () => {
  const { showAlert } = useAlert();
  const today = useMemo(() => new Date(), []);
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
  const [ApiData, setApiData] = useState<MaterialMaster[] | null>();
  const [loading, setLoading] = useState(false);
  const { currentUser, plantApiData } = useData();
  const router = useRouter();

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
      fDate: fromDate.toISOString().split("T")[0],
      tDate: toDate.toISOString().split("T")[0],
      plantIds,
    };

    try {
      setLoading(true);
      const response = await UnBlock1Api.post(payload);
      setApiData(response);
    } catch (err) {
      console.error("Error fetching Approval1 data:", err);
    } finally {
      setLoading(false);
    }
  };
  // const ApiDataPlant = async () => {
  //   try {
  //     const response = await PlantData.GetAll();
  //     setPlantApiData(response);
  //   } catch (error) {
  //     console.error("Error fetching Approval1 data:", error);
  //   }
  // };
  // useEffect(() => {
  //   ApiDataPlant();
  // }, []);

  useEffect(() => {
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    setFromDate(firstDay);
    setToDate(today);
  }, [today]);

  useEffect(() => {
    if (plantApiData?.length) {
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
      isUnBlock: actionType === "Accepted" ? 1 : 0,
      unBlockApp1Remark: remarks,
      unBlockApp1On: new Date().toISOString(),
      unBlockApp1By: currentUser?.username || "user",
      mode: "UB",
    });
    await ApiDataFunc();
    showAlert(req, "success");
    console.log(req, "Response", "Api Fit");
    closeDialog();
  };

  // useEffect(() => {
  //   ApiDataFunc();
  // }, [plantApiData]);

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
              key: "book-lock-open",
              render: () => (
                <Avatar.Text
                  size={28}
                  label="Un"
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
              key: "cancel",
              render: () => (
                <Avatar.Text
                  size={28}
                  label="R"
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
                `${handleNullUndefined(
                  row.storage_Code
                )} - ${handleNullUndefined(row.storage)}`,
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
                ` ${handleNullUndefined(
                  row.blockOn?.split("T")[0]
                )} - ${handleNullUndefined(
                  row.blockOn?.split("T")[1].split(".")[0]
                )}`,
            },
            {
              key: "UNBlock_By",
              title: "UnBloack By",
              render: (row) => `${handleNullUndefined(row.unBlockBy)}`,
            },
            {
              key: "UnBloack_on",
              title: "UnBloack On",
              render: (row) =>
                ` ${handleNullUndefined(
                  row.unBlockOn?.split("T")[0]
                )} - ${handleNullUndefined(
                  row.unBlockOn?.split("T")[1].split(".")[0]
                )}`,
            },
            {
              key: "blockApprove1Info",
              title: "Block Approve1 Info",
              render: (row) =>
                `${handleNullUndefined(
                  row.blockAppr1By
                )} - ${handleNullUndefined(
                  row.blockAppr1On?.split("T")[0]
                )} - ${handleNullUndefined(
                  row.blockAppr1On?.split("T")[1].split(".")[0]
                )}`,
            },
            {
              key: "blockApprove2Info",
              title: "Block Approve2 Info",
              render: (row) =>
                `${handleNullUndefined(
                  row.blockAppr2On?.split("T")[0]
                )} - ${handleNullUndefined(
                  row.blockAppr2On?.split("T")[1].split(".")[0]
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
