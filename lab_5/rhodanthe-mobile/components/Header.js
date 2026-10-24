import { StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../theme";

export default function Header({ total, sold }) {
    return (
        <View style={styles.headerContainer}>
            <Text style={styles.title}>rhodanthe</Text>
            <Text style={styles.stats}>
                Усього виробів: {total} · Продано: {sold}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        marginBottom: 24,
    },
    title: {
        fontFamily: fonts.header,
        fontSize: 56,
        color: colors.brand,
        textAlign: "center",
        marginBottom: 4,
    },
    stats: {
        fontFamily: fonts.italic,
        fontSize: 16,
        color: colors.textMuted,
        textAlign: "center",
    },
});
