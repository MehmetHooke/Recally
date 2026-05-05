import { SuccessAnimation } from "@/src/components/common/SuccessAnimation";
import { CompletedSetDetail } from "@/src/components/set/CompletedSetDetail";
import { FailedSetDetail } from "@/src/components/set/FailedSetDetail";
import { ProcessingSetDetail } from "@/src/components/set/ProcessingSetDetail";
import { useAppAlert } from "@/src/hooks/useAppAlert";
import { auth, db } from "@/src/services/firebase";
import { createTextSetJob, createYoutubeSetJob } from "@/src/services/functions";
import { normalizeSetItem } from "@/src/services/setService";
import { useAppTheme } from "@/src/theme/useTheme";
import type { StudySet } from "@/src/types/study-set";
import { router, useLocalSearchParams } from "expo-router";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  writeBatch
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

export default function SetDetailScreen() {
  const { setId } = useLocalSearchParams<{ setId: string }>();
  const { colors } = useAppTheme();
  const { t } = useTranslation("set");
  const { showAlert } = useAppAlert();

  const [setData, setSetData] = useState<StudySet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const previousStatusRef = useRef<StudySet["status"] | null>(null);
  const hasPlayedSuccessRef = useRef(false);
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

        const newData = normalizeSetItem(
          snap.id,
          snap.data() as Omit<StudySet, "id">
        );

        const previousStatus = previousStatusRef.current;

        const shouldPlaySuccess =
          previousStatus === "processing" &&
          newData.status === "completed" &&
          !hasPlayedSuccessRef.current;

        previousStatusRef.current = newData.status;

        setSetData(newData);
        setError(null);
        setLoading(false);

        if (shouldPlaySuccess) {
          hasPlayedSuccessRef.current = true;
          setShowSuccess(true);

          if (successTimeoutRef.current) {
            clearTimeout(successTimeoutRef.current);
          }

          successTimeoutRef.current = setTimeout(() => {
            setShowSuccess(false);
          }, 1700);
        }
      },
      (snapshotError) => {
        console.error("SET DETAIL SNAPSHOT ERROR:", snapshotError);
        setError(t("detail.errors.loadFailed"));
        setLoading(false);
      }
    );

    return () => {
      unsub();

      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, [setId, t]);


  const deleteSetWithCards = async (targetSetId: string) => {
    const user = auth.currentUser;

    if (!user) {
      throw new Error(t("detail.errors.userNotFound"));
    }

    const setDocRef = doc(db, "users", user.uid, "sets", targetSetId);
    const cardsCollectionRef = collection(
      db,
      "users",
      user.uid,
      "sets",
      targetSetId,
      "cards"
    );

    const cardsSnapshot = await getDocs(cardsCollectionRef);
    const batch = writeBatch(db);

    cardsSnapshot.docs.forEach((cardDoc) => {
      batch.delete(cardDoc.ref);
    });

    batch.delete(setDocRef);

    await batch.commit();
  };

  const handleStartReview = () => {
    if (!setId || typeof setId !== "string") return;
    router.push(`/set/${setId}/review`);
  };

  const handleDeleteFailedSet = async () => {
    if (!setData || retrying || deleting) return;

    try {
      setDeleting(true);

      await deleteSetWithCards(setData.id);

      router.replace("/(tabs)/library");
    } catch (error) {
      console.error("FAILED SET DELETE ERROR:", error);

      showAlert({
        type: "error",
        title: t("detail.failed.deleteErrorTitle"),
        message:
          error instanceof Error
            ? error.message
            : t("detail.failed.deleteFailedMessage"),
      });
    } finally {
      setDeleting(false);
    }
  };
  const handleRetryFailedSet = async () => {
    if (!setData || retrying || deleting) return;

    const sourceText = setData.sourceText?.trim();


    if (!sourceText) {
      showAlert({
        type: "error",
        title: t("detail.failed.retryErrorTitle"),
        message: t("detail.failed.missingSourceMessage"),
      });
      return;
    }

    try {
      setRetrying(true);

      const result =
        setData.sourceType === "youtube"
          ? await createYoutubeSetJob(sourceText)
          : await createTextSetJob(sourceText);

      if (!result.ok || !result.setId) {
        throw new Error(t("detail.failed.retryFailedMessage"));
      }

      try {
        await deleteSetWithCards(setData.id);
      } catch (deleteError) {
        console.error("OLD FAILED SET DELETE AFTER RETRY ERROR:", deleteError);
      }

      router.replace(`/set/${result.setId}`);
    } catch (error) {
      console.error("FAILED SET RETRY ERROR:", error);

      showAlert({
        type: "error",
        title: t("detail.failed.retryErrorTitle"),
        message:
          error instanceof Error
            ? error.message
            : t("detail.failed.retryFailedMessage"),
      });
    } finally {
      setRetrying(false);
    }
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

  let content: React.ReactNode;

  if (setData.status === "processing") {
    content = <ProcessingSetDetail set={setData} />;
  } else if (setData.status === "failed") {
    content = (
      <FailedSetDetail
        set={setData}
        onRetry={handleRetryFailedSet}
        onDelete={handleDeleteFailedSet}
        retrying={retrying}
        deleting={deleting}
      />
    );
  } else {
    content = <CompletedSetDetail set={setData} onOpenReview={handleStartReview} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {content}

      {showSuccess ? (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: "rgba(255,255,255,0.72)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <SuccessAnimation transparent />
        </View>
      ) : null}
    </View>
  );
}