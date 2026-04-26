import { CompletedSetDetail } from "@/src/components/set/CompletedSetDetail";
import { FailedSetDetail } from "@/src/components/set/FailedSetDetail";
import { ProcessingSetDetail } from "@/src/components/set/ProcessingSetDetail";
import { auth, db } from "@/src/services/firebase";
import { normalizeSetItem } from "@/src/services/setService";
import { useAppTheme } from "@/src/theme/useTheme";
import type { StudySet } from "@/src/types/study-set";
import { router, useLocalSearchParams } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

export default function SetDetailScreen() {
  const { setId } = useLocalSearchParams<{ setId: string }>();
  const { colors } = useAppTheme();
  const { t } = useTranslation("set");

  const [setData, setSetData] = useState<StudySet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!setId || typeof setId !== "string") {
      setError(t("detail.errors.setNotFound"));
      setLoading(false);
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      setError(t("detail.errors.userNotFound"));
      setLoading(false);
      return;
    }

    const setDocRef = doc(db, "users", user.uid, "sets", setId);

    const unsub = onSnapshot(
      setDocRef,
      (snap) => {
        if (!snap.exists()) {
          setError(t("detail.errors.setNotFound"));
          setLoading(false);
          return;
        }

        setSetData(
          normalizeSetItem(snap.id, snap.data() as Omit<StudySet, "id">)
        );
        setError(null);
        setLoading(false);
      },
      (snapshotError) => {
        console.error("SET DETAIL SNAPSHOT ERROR:", snapshotError);
        setError(t("detail.errors.loadFailed"));
        setLoading(false);
      }
    );

    return unsub;
  }, [setId, t]);

  const handleStartReview = () => {
    if (!setId || typeof setId !== "string") return;
    router.push(`/set/${setId}/review`);
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (error || !setData) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
          gap: 12,
        }}
      >
        <Text style={{ color: colors.text, fontWeight: "800" }}>
          {error || t("detail.errors.setNotFound")}
        </Text>

        <Pressable
          onPress={() => router.back()}
          style={{
            backgroundColor: colors.primary,
            paddingVertical: 13,
            paddingHorizontal: 18,
            borderRadius: 14,
          }}
        >
          <Text
            style={{
              color: colors.primaryForeground,
              fontWeight: "800",
            }}
          >
            {t("detail.backButton")}
          </Text>
        </Pressable>
      </View>
    );
  }

  if (setData.status === "processing") {
    return <ProcessingSetDetail set={setData} />;
  }

  if (setData.status === "failed") {
    return <FailedSetDetail set={setData} />;
  }

  return <CompletedSetDetail set={setData} onOpenReview={handleStartReview} />;
}