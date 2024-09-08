// Data tunggal
const data = [
    68, 58, 58, 61, 54, 49, 56, 64, 79,
    58, 56, 60, 56, 56, 60, 59, 61, 58,
    57, 60, 62, 60, 49, 52, 54, 60, 56,
    60, 58, 55, 48, 50, 51, 61, 48, 56,
    68, 60, 49, 56, 48, 70, 63, 68, 62,
    79, 58, 56, 56, 62, 62, 72, 71, 71,
    81, 81, 86, 76, 72, 72, 72, 73, 71,
    72, 76, 70, 70, 69, 68, 62, 72, 71
];

// Batas bawah dan panjang kelas
const lowerValue = 48;
const ceilNumClasses = 5;
const ceilClassLength = 8;

// Inisialisasi array frekuensi
const frequencies = new Array(ceilClassLength).fill(0);

// Iterasi data untuk menghitung frekuensi pada setiap kelas
data.forEach(value => {
    const classIndex = Math.floor((value - lowerValue) / ceilNumClasses);
    if (classIndex >= 0 && classIndex < ceilClassLength) {
        frequencies[classIndex]++;
    }
});

// Output frekuensi pada setiap kelas
frequencies.forEach((freq, index) => {
    const classStart = lowerValue + index * classWidth;
    const classEnd = classStart + classWidth - 1;
    console.log(`Kelas ${index + 1} [${classStart} - ${classEnd}]: ${freq}`);
});
