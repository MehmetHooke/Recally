import {
    getSetById,
    getSetCardsStats,
    type SetItem,
} from "@/src/services/setService";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, Text, View } from "react-native";

type Stats = {
    totalCards: number;
    dueCards: number;
};

export default function SetDetailScreen() {
    const { setId } = useLocalSearchParams<{ setId: string }>();

    const [setData, setSetData] = useState<SetItem | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!setId || typeof setId !== "string") return;

        const loadSetDetail = async () => {
            try {
                setLoading(true);

                const [setResult, statsResult] = await Promise.all([
                    getSetById(setId),
                    getSetCardsStats(setId),
                ]);

                setSetData(setResult);
                setStats(statsResult);
            } catch (error) {
                console.error("SET DETAIL ERROR:", error);
            } finally {
                setLoading(false);
            }
        };

        loadSetDetail();
    }, [setId]);

    const handleStartReview = () => {
        if (!setId || typeof setId !== "string") return;
        router.push(`/set/${setId}/review`);
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator />
            </View>
        );
    }

    if (!setData) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 24,
                    gap: 12,
                }}
            >
                <Text>Set bulunamadı.</Text>
                <Button title="Back" onPress={() => router.back()} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, padding: 20, gap: 16 }}>
            <Text style={{ fontSize: 26, fontWeight: "700" }}>{setData.title}</Text>

            <Text style={{ color: "#666" }}>Type: {setData.sourceType}</Text>

            <View
                style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 12,
                    padding: 16,
                    gap: 8,
                }}
            >
                <Text style={{ fontSize: 18, fontWeight: "600" }}>Stats</Text>
                <Text>Total Cards: {stats?.totalCards ?? 0}</Text>
                <Text>Due Cards: {stats?.dueCards ?? 0}</Text>
            </View>

            {setData.summary ? (
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: "#ddd",
                        borderRadius: 12,
                        padding: 16,
                        gap: 8,
                    }}
                >
                    <Text style={{ fontSize: 18, fontWeight: "600" }}>Summary</Text>
                    <Text>{setData.summary}</Text>
                </View>
            ) : null}

            {setData.keyConcepts && setData.keyConcepts.length > 0 ? (
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: "#ddd",
                        borderRadius: 12,
                        padding: 16,
                        gap: 8,
                    }}
                >
                    <Text style={{ fontSize: 18, fontWeight: "600" }}>Key Concepts</Text>
                    {setData.keyConcepts.map((item, index) => (
                        <Text key={`${item}-${index}`}>• {item}</Text>
                    ))}
                </View>
            ) : null}

            <View
                style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 12,
                    padding: 16,
                    gap: 8,
                }}
            >
                <Text style={{ fontSize: 18, fontWeight: "600" }}>Source Preview</Text>
                <Text numberOfLines={8}>{setData.sourceText}</Text>
            </View>

            <Button
                title={stats && stats.dueCards > 0 ? "Start Due Review" : "No Cards Due"}
                onPress={handleStartReview}
                disabled={!stats || stats.dueCards === 0}
            />
        </View>
    );
}