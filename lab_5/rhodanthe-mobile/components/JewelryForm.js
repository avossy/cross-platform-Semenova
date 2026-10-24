import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors, fonts } from "../theme";

const MATERIALS = ["Золото 585", "Золото 750", "Срібло 925"];
const GEMSTONES = ["Без каменю", "Діамант", "Рубін", "Сапфір", "Смарагд", "Топаз", "Перли"];

export default function JewelryForm({ onAdd }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [weight, setWeight] = useState("");
    const [material, setMaterial] = useState(MATERIALS[0]);
    const [gemstone, setGemstone] = useState(GEMSTONES[0]);
    const [description, setDescription] = useState("");
    const [size, setSize] = useState("");

    function handleAdd() {
        const added = onAdd({ name, price, weight, material, gemstone, description, size });
        if (added) {
            setName("");
            setPrice("");
            setWeight("");
            setDescription("");
            setSize("");
        }
    }

    return (
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Додати новий виріб</Text>

            <TextInput
                style={styles.input}
                placeholder="Назва виробу..."
                placeholderTextColor={colors.sky}
                value={name}
                onChangeText={setName}
                returnKeyType="next"
            />

            <View style={styles.row}>
                <TextInput
                    style={[styles.input, styles.half]}
                    placeholder="Ціна, грн"
                    placeholderTextColor={colors.sky}
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                />
                <TextInput
                    style={[styles.input, styles.half]}
                    placeholder="Вага, г"
                    placeholderTextColor={colors.sky}
                    keyboardType="decimal-pad"
                    value={weight}
                    onChangeText={setWeight}
                />
            </View>

            <Text style={styles.label}>Матеріал:</Text>
            <View style={styles.chips}>
                {MATERIALS.map((m) => (
                    <TouchableOpacity
                        key={m}
                        style={[styles.chip, material === m && styles.chipActive]}
                        onPress={() => setMaterial(m)}
                    >
                        <Text style={[styles.chipText, material === m && styles.chipTextActive]}>{m}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Камінь:</Text>
            <View style={styles.chips}>
                {GEMSTONES.map((g) => (
                    <TouchableOpacity
                        key={g}
                        style={[styles.chip, gemstone === g && styles.chipActive]}
                        onPress={() => setGemstone(g)}
                    >
                        <Text style={[styles.chipText, gemstone === g && styles.chipTextActive]}>{g}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="Опис виробу..."
                placeholderTextColor={colors.sky}
                value={description}
                onChangeText={setDescription}
                multiline
            />

            <TextInput
                style={styles.input}
                placeholder="Розмір (необов'язково)"
                placeholderTextColor={colors.sky}
                value={size}
                onChangeText={setSize}
                onSubmitEditing={handleAdd}
                returnKeyType="done"
            />

            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                <Text style={styles.addButtonText}>Додати виріб</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
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
    label: {
        fontFamily: fonts.italic,
        fontSize: 14,
        color: colors.textMuted,
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.sky,
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        fontFamily: fonts.regular,
        marginBottom: 12,
        backgroundColor: colors.white,
        color: colors.brand,
    },
    textarea: {
        minHeight: 80,
        textAlignVertical: "top",
    },
    row: {
        flexDirection: "row",
        gap: 12,
    },
    half: {
        flex: 1,
    },
    chips: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 12,
        gap: 8,
    },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.sky,
        alignItems: "center",
        backgroundColor: colors.white,
    },
    chipActive: {
        backgroundColor: colors.brand,
        borderColor: colors.brand,
    },
    chipText: {
        fontFamily: fonts.regular,
        fontSize: 14,
        color: colors.brand,
    },
    chipTextActive: {
        fontFamily: fonts.bold,
        color: colors.white,
    },
    addButton: {
        backgroundColor: colors.brand,
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 4,
    },
    addButtonText: {
        fontFamily: fonts.bold,
        color: colors.white,
        fontSize: 16,
    },
});
