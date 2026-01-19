import Filter1 from "@/Components/DashboardFilterComponent/Filter1";
import RDatatable from "@/Components/Datatable/RDatatable";
import DialogComponent from "@/Components/DialogComponent";
import RNInput from "@/Components/RNInput";
import { useAlert } from "@/Services/AlertContext";
import { useData } from "@/Services/dataProvider";
import {
  Approval12Api,
  ChangeReqApproval2,
  PlantData,
} from "@/src/services/MdmAPPApi";
import { AppMDMThemeColors } from "@/src/theme/color";
import { MaterialMaster, PlantMaster } from "@/src/types/ApprovalType";
import { handleNullUndefined } from "@/utils/errorHandler";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator, Avatar, useTheme } from "react-native-paper";

type DialogStep = "NONE" | "CHOOSE" | "REMARKS";

const Approval2 = () => {
  const { showAlert } = useAlert();
  const today = useMemo(() => new Date(), []);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [plant, setPlant] = useState<string | null>(null);

  // const [plantApiData, setPlantApiData] = useData();

  const [dialogStep, setDialogStep] = useState<DialogStep>("NONE");
  const [selectedItem, setSelectedItem] = useState<MaterialMaster | null>(null);
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

  const [submitLoading, setSubmitLoading] = useState(false);
  
  const { colors } = useTheme();

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
      fDate: fromDate.toISOString()?.split("T")[0],
      tDate: toDate.toISOString()?.split("T")[0],
      plantIds,
    };

    try {
      setLoading(true);
      const response = await ChangeReqApproval2.post(payload);
      setApiData(response);
    } catch (err) {
      console.error("Error fetching Approval1 data:", err);
    } finally {
      setLoading(false);
    }
  };

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

    if (!selectedItem) {
      showAlert("No item selected", "error");
      return;
    }

    const now = new Date();
    const localIso =
      new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, -1);

    setSubmitLoading(true);

    try {
      const req = await Approval12Api.post({
        ...selectedItem,
        appR1_STATUS: actionType === "Accepted" ? 1 : 0,
        appR1_REMARK: remarks,
        appR1_ON: localIso,
        appR1_BY: currentUser?.username || "user",
        mode: "CH",
      });

      showAlert(req, "success", 5000);
      console.log(req, "Response", "Api Fit");
      await ApiDataFunc();
      closeDialog();
    } catch (error: any) {
      console.error("Submit failed", error);
      showAlert(
        error?.message || "Something went wrong while submitting",
        "error"
      );
    } finally {
      setSubmitLoading(false);
    }
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
              `${handleNullUndefined(row.storage_Code)} - ${handleNullUndefined(
                row.storage
              )}`,
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
            key: "Created_By",
            title: "Created By",
            render: (row) =>
              `${handleNullUndefined(row.entereD_BY)} - ${handleNullUndefined(
                row.entereD_ON?.split("T")[0]
              )} - ${handleNullUndefined(
                row.entereD_ON?.split("T")[1]?.split(".")[0]
              )}`,
          },
          {
            key: "Approved",
            title: "Approved",
            render: (row) =>
              `${handleNullUndefined(row.appR1_BY)} - ${handleNullUndefined(
                row.appR1_ON?.split("T")[0]
              )} - ${handleNullUndefined(
                row.appR1_ON?.split("T")[1]?.split(".")[0]
              )}`,
          },
          {
            key: "Rejected",
            title: "Rejected",
            render: (row) =>
              `${handleNullUndefined(row.rejecteD_BY)} - ${handleNullUndefined(
                row.rejecteD_ON?.split("T")[0]
              )} - ${handleNullUndefined(
                row.rejecteD_ON?.split("T")[1]?.split(".")[0]
              )}`,
          },
        ]}
        pagination={true}
        searchable={true}
        searchKeys={["plant"]}
      />
      </ScrollView>
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
              value={selectedItem.appR1_REMARK} // doubt
              icon="format-list-numbered"
            />
            <RNInput
              label="Enter Remark*"
              value={remarks}
              icon="grease-pencil"
              onChangeText={setRemarks}
            />
            {
              submitLoading && 
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            }
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
