// src/context/ProcessingSetWatcherProvider.tsx

import { db } from "@/src/services/firebase";
import { notifySetReady } from "@/src/services/notificationService";
import { collection, onSnapshot, query } from "firebase/firestore";
import React, { createContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "./AuthContext";

type SetStatus = "processing" | "completed" | "failed" | string;

export const ProcessingSetWatcherContext = createContext<undefined>(undefined);

export function ProcessingSetWatcherProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const { t } = useTranslation("set");

  const previousStatusesRef = useRef<Map<string, SetStatus>>(new Map());
  const bootstrappedRef = useRef(false);
  const notifiedSetIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    previousStatusesRef.current.clear();
    notifiedSetIdsRef.current.clear();
    bootstrappedRef.current = false;

    if (!user) {
      return;
    }

    const setsRef = collection(db, "users", user.uid, "sets");
    const setsQuery = query(setsRef);

    const unsubscribe = onSnapshot(
      setsQuery,
      (snapshot) => {
        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();
          const setId = docSnap.id;

          const currentStatus =
            typeof data.status === "string" ? data.status : "completed";

          const previousStatus = previousStatusesRef.current.get(setId);

          previousStatusesRef.current.set(setId, currentStatus);

          if (!bootstrappedRef.current) {
            return;
          }

          const movedFromProcessingToCompleted =
            previousStatus === "processing" && currentStatus === "completed";

          const movedFromProcessingToFailed =
            previousStatus === "processing" && currentStatus === "failed";

          if (
            movedFromProcessingToCompleted &&
            !notifiedSetIdsRef.current.has(setId)
          ) {
            notifiedSetIdsRef.current.add(setId);

            const setTitle =
              typeof data.title === "string" && data.title.trim().length > 0
                ? data.title
                : t("detail.processing.notifications.readyBody");

            notifySetReady({
              title: t("detail.processing.notifications.readyTitle"),
              body: setTitle,
              setId,
            }).catch((error) => {
              console.log("set ready notification error:", error);
            });
          }

          if (
            movedFromProcessingToFailed &&
            !notifiedSetIdsRef.current.has(setId)
          ) {
            notifiedSetIdsRef.current.add(setId);

            notifySetReady({
              title: t("detail.processing.notifications.failedTitle"),
              body: t("detail.processing.notifications.failedBody"),
              setId,
            }).catch((error) => {
              console.log("set failed notification error:", error);
            });
          }
        });

        bootstrappedRef.current = true;
      },
      (error) => {
        console.log("processing set watcher error:", error);
      }
    );

    return unsubscribe;
  }, [user, t]);

  return (
    <ProcessingSetWatcherContext.Provider value={undefined}>
      {children}
    </ProcessingSetWatcherContext.Provider>
  );
}