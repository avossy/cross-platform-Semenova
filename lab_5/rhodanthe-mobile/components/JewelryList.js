import { FlatList, StyleSheet, Text, View } from "react-native";
import JewelryItem from "./JewelryItem";
import { colors, fonts } from "../theme";

export default function JewelryList({ items, emptyText, onToggle, onDelete }) {
    return (
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Список виробів</Text>

            {items.length === 0 ? (
                <Text style={styles.emptyText}>{emptyText}</Text>
            ) : (
                <>
                    <Text style={styles.hint}>
                        Торкніться виробу, щоб позначити його проданим.
                    </Text>
                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.id}
                        keyboardShouldPersistTaps="handled"
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <JewelryItem
                                item={item}
                                onToggle={onToggle}
                                onDelete={onDelete}
                            />
                        )}
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    sectionTitle: {
        fontFamily: fonts.bold,
        fontSize: 20,
        color: colors.brandDark,
        marginBottom: 12,
    },
    hint: {
        fontFamily: fonts.italic,
        fontSize: 14,
        color: colors.textMuted,
        marginBottom: 12,
    },
    emptyText: {
        fontFamily: fonts.italic,
        color: colors.textMuted,
        fontSize: 16,
        textAlign: "center",
        padding: 10,
    },
});
