import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, fonts } from "../theme";

export default function JewelryItem({ item, onToggle, onDelete }) {
    return (
        <View style={[styles.item, item.sold && styles.itemDone]}>
            <TouchableOpacity
                style={styles.textArea}
                onPress={() => onToggle(item.id)}
            >
                <Text style={[styles.nameText, item.sold && styles.textDone]}>
                    {item.name}
                </Text>
                {item.description ? (
                    <Text style={[styles.descriptionText, item.sold && styles.textDone]}>
                        {item.description}
                    </Text>
                ) : null}
                <Text style={[styles.detailsText, item.sold && styles.textDone]}>
                    {item.material} · {item.gemstone}
                </Text>
                <Text style={[styles.detailsText, item.sold && styles.textDone]}>
                    {item.weight}{"\u00A0"}г{item.size ? ` · розмір\u00A0${item.size}` : ""}
                </Text>
                <Text style={styles.price}>
                    {item.price} грн
                </Text>
                {item.sold ? <Text style={styles.statusText}>Продано</Text> : null}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDelete(item.id)}
            >
                <Text style={styles.deleteButtonText}>Видалити</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: colors.skySoft,
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
    },
    itemDone: {
        backgroundColor: colors.sand,
    },
    textArea: {
        flex: 1,
    },
    nameText: {
        fontFamily: fonts.bold,
        fontSize: 18,
        color: colors.brandDark,
        marginBottom: 2,
    },
    descriptionText: {
        fontFamily: fonts.italic,
        fontSize: 14,
        color: colors.textMuted,
        marginBottom: 2,
    },
    detailsText: {
        fontFamily: fonts.regular,
        fontSize: 14,
        color: colors.brandDark,
    },
    price: {
        fontFamily: fonts.bold,
        fontSize: 16,
        color: colors.brand,
        marginTop: 6,
    },
    statusText: {
        fontFamily: fonts.boldItalic,
        fontSize: 13,
        color: colors.brandDark,
        marginTop: 2,
    },
    textDone: {
        textDecorationLine: "line-through",
        opacity: 0.7,
    },
    deleteButton: {
        backgroundColor: colors.danger,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    deleteButtonText: {
        fontFamily: fonts.bold,
        color: colors.white,
        fontSize: 14,
    },
});
