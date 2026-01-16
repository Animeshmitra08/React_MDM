import Filter1 from "@/Components/DashboardFilterComponent/Filter1";
import RDatatable from "@/Components/Datatable/RDatatable";
import DialogComponent from "@/Components/DialogComponent";
import RNInput from "@/Components/RNInput";
import { useAlert } from "@/Services/AlertContext";
import { useData } from "@/Services/dataProvider";
import {
  Approval12Api,
  Approval2Extension,
  PlantData,
} from "@/src/services/MdmAPPApi";
import { AppMDMThemeColors } from "@/src/theme/color";
import {
  ApprovalMaster,
  MaterialMaster,
  PlantMaster,
} from "@/src/types/ApprovalType";
import { handleNullUndefined } from "@/utils/errorHandler";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator, Avatar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type DialogStep = "NONE" | "CHOOSE" | "REMARKS";

const Approval2 = () => {
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
  const [ApiData, setApiData] = useState<MaterialMaster[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { currentUser, plantApiData } = useData();
  const router = useRouter();

  const [navigating, setNavigating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
          
        useFocusEffect(
          useCallback(() => {
            setNavigating(false);
          }, [])
        );

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
      const response = await Approval2Extension.post(payload);
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
    const now = new Date();
    const localIso =
      new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, -1);
    const payload: ApprovalMaster = {
      ...selectedItem,
      extensionApproval2Status: actionType === "Accepted" ? 1 : 0,
      extApp2_Remark: remarks,
      extensionApproval2On: localIso,
      extensionApproval2: currentUser?.username || "user",
      mode: "E",
    };
    const req = await Approval12Api.post(payload);
    showAlert(req, "success", 5000);
    await ApiDataFunc();
    console.log(req, "Response", "Api Fit");
    closeDialog();
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await ApiDataFunc();
    } finally {
      setRefreshing(false);
    }
  };

  // useEffect(() => {
  //   ApiDataFunc();
  // }, [plantApiData]);

  // console.log(ApiData, "Api Data rr");

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
        }}
        refreshControl={
          <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={AppMDMThemeColors.approval}   // iOS
          colors={[AppMDMThemeColors.approval]}
          />
        }
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
                <Avatar.Text
                  size={28}
                  label="A"
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
                if (navigating) return;
                setNavigating(true);
                router.push({
                  pathname: "/Screens/MaterialTransactionPage/MatTransPage",
                  params: { trnsId: row?.trN_ID },
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
              // width: 170,
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
              key: "Extension info",
              title: "Extension info",
              render: (row) =>
                `${handleNullUndefined(
                  row.extensionBy
                )} - ${handleNullUndefined(
                  row.extension_On?.split("T")[0]
                )} - ${handleNullUndefined(
                  row.extension_On?.split("T")[1].split(".")[0]
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
              value={selectedItem.extApp1_Remark}
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

      {navigating && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </>
  );
};

export default Approval2;

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
});