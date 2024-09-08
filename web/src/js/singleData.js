document.addEventListener("DOMContentLoaded", () => {
    processData();
});

document.getElementById("numberInput").addEventListener("input", processData);
document.getElementById("decimalPlaces").addEventListener("input", processData);

function formatNumber(value, decimalPlaces) {
    if (isNaN(value) || value === null) {
        return '';
    }

    const formatted = value.toFixed(decimalPlaces);
    return formatted.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
}

function resModus(data) {
    let modus = data[0];
    let maxCount = 1;
    let currentCount = 1;

    for (let i = 1; i < data.length; ++i) {
        if (data[i] == data[i - 1]) {
            currentCount++;
        } else {
            currentCount = 1;
        }
        if (currentCount > maxCount) {
            maxCount = currentCount;
            modus = data[i];
        }
    }
    return modus;
}

function resMedian(data) {
    let n = data.length;
    if (n % 2 == 0) {
        return (data[Math.floor(n / 2) - 1] + data[Math.floor(n / 2)]) / 2.0;
    } else {
        return data[Math.floor(n / 2)];
    }
}

function resetTable() {
    if (confirm("Apakah Anda yakin ingin mengatur ulang tabel? Semua data akan hilang.")) {
        document.getElementById('numberInput').value = "";
        processData(); 
    }
}

function populateTableComplete(
    lowerValue, 
    upperValue, 
    Fi, 
    cumulative,
    ci,
    FiCi,
    xi,
    ximinx,
    fiximinx,
    powximinx,
    powfiximinx,
    sumF,
    sumFiCi,
    sumFiximinx,
    sumPowfiximinx
) {
    const tableBody = document.getElementById("dprTableContainerComplete").getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    for (let i = 0; i < lowerValue.length; i++) {
        const row = tableBody.insertRow();
        row.insertCell(0).innerText = lowerValue[i];
        row.insertCell(1).innerText = upperValue[i];
        row.insertCell(2).innerText = Fi[i];
        row.insertCell(3).innerText = cumulative[i];
        row.insertCell(4).innerText = ci[i];
        row.insertCell(5).innerText = FiCi[i];
        row.insertCell(6).innerText = xi[i];
        row.insertCell(7).innerText = ximinx[i];
        row.insertCell(8).innerText = fiximinx[i];
        row.insertCell(9).innerText = powximinx[i];
        row.insertCell(10).innerText = powfiximinx[i];
    }

    // Populate footer
    document.querySelector(".sumF").innerText = sumF;
    document.querySelector(".sumFici").innerText = sumFiCi;
    document.querySelector(".sumFiximinx").innerText = sumFiximinx;
    document.querySelector(".sumPowFiximinx").innerText = sumPowfiximinx;
}

function populateTable(lowerValue, upperValue, frequencies, range) {
    const tableBody = document.getElementById("dprTable").getElementsByTagName('tbody')[0];
    
    // Kosongkan tbody sebelum menambahkan baris baru
    tableBody.innerHTML = '';

    for (let i = 0; i < lowerValue.length; i++) {
        const row = tableBody.insertRow();
        let cell1 = row.insertCell(0); // Sel untuk nilai
        let cell2 = row.insertCell(1); // Sel untuk frekuensi
        let cell3 = row.insertCell(2); // Sel untuk turus

        cell1.innerText = formatNumber(lowerValue[i], 0) + ' - ' + formatNumber(upperValue[i], 0);
        cell2.innerText = frequencies[i] || 0;
        
        // Generate tally marks
        let tally = '';
        for (let j = 0; j < frequencies[i]; j++) {
            if ((j + 1) % 5 === 0) {
                tally += '\\ '; // Menggunakan '\\' untuk membuat garis miring
            } else {
                tally += '|';
            }
        }
        cell3.innerText = tally.trim();
        cell3.classList.add("text-start")
    }
}

function processData() {
    const dprTable1 = document.getElementById("dataProcessingResult1").getElementsByTagName('tbody')[0];
    const dprTable2 = document.getElementById("dataProcessingResult2").getElementsByTagName('tbody')[0];
    const dprTable3 = document.getElementById("dataProcessingResult3").getElementsByTagName('tbody')[0];
    const turusTable = document.getElementById("dprTable").getElementsByTagName('tbody')[0];
    const decimalPlaces = parseInt(document.getElementById('decimalPlaces').value) || 2;
    const container = document.getElementById("dprTableContainer");
    
    // Tampilkan atau sembunyikan tabel berdasarkan input
    
    let data = [];
    let cumulative = 0;
    const input = document.getElementById('numberInput').value;
    const inputArray = input.split(/\s+/).map(parseFloat);
    const hiddenValue = input;
    if (input.trim() === "") {
        container.classList.add("hidden");
    } else {
        container.classList.remove("hidden");
    }

    const validNumbers = inputArray.filter(value => !isNaN(value));
    if (Array.isArray(validNumbers)) {
        data.push(...validNumbers);
    }

    for (let i = 0; i < data.length; i++) {
        cumulative += data[i];
    }
    
    let amountData = data.length;
    let mean = cumulative / amountData || 0;
    let dataSorted = [...data].sort((a, b) => a - b);
    let modus = resModus(dataSorted) || 0;
    let median = resMedian(dataSorted) || 0;

    let min = 0;
    let max = 0;
    
    if (dataSorted.length > 0) {
        min = Math.min(...dataSorted);
        max = Math.max(...dataSorted);
    }

    const range = (max - min) || 0;
    const numClasses = 1 + 3.3 * Math.log10(amountData) || 0;
    const ceilNumClassesTemp = Math.ceil(numClasses) || 0;
    const ceilNumClasses = ceilNumClassesTemp === -Infinity ? 0 : ceilNumClassesTemp;
    const classLength = (range / ceilNumClasses);
    const ceilClassLength = Math.ceil(classLength) || 0;
    

    let lowerValue = [];
    let upperValue = [];
    let lowerBounds = [];
    let upperBounds = [];
    let avg = [];
    let Fi = [];
    let cumFi = [];
    let ci = [];
    let FiCi = [];
    let xi = [];
    let ximinx=[];
    let fiximinx = [];
    let powximinx = [];
    let powfiximinx = [];


    let tempLowerValue = min;
    let tempUpperValue = ceilClassLength > 0 ? min+ceilClassLength-1: "...";
    
    let sumF = 0;
    let sumFiCi = 0;
    let sumFiximinx = 0;
    let sumPowfiximinx = 0;
    for (let i = 0; i < ceilNumClasses; i++) {
        lowerValue.push(tempLowerValue);
        upperValue.push(tempUpperValue);
        avg.push((upperValue[i] + lowerValue[i]) / 2);
        lowerBounds.push(lowerValue[i] - 0.5);
        upperBounds.push(upperValue[i] + 0.5);
        tempUpperValue += ceilClassLength;
        tempLowerValue += ceilClassLength;
        ci.push(i);
        xi.push((upperValue[i]+lowerValue[i])/2);
        ximinx.push(Math.ceil(xi[i]-mean));
        powximinx.push(Math.pow(ximinx[i],2));
    }

    const frequencies = new Array(lowerValue.length).fill(0);
    data.forEach(value => {
        const classIndex = lowerValue.findIndex((lower, i) => value >= lower && value <= upperValue[i]);
        if (classIndex !== -1) {
            frequencies[classIndex]++;
        }
    });
    for (let i = 0; i < frequencies.length; i++) {
        Fi.push(frequencies[i]);
        sumF += Fi[i];
        cumFi.push(sumF);
        FiCi.push(Fi[i]*ci[i])
        sumFiCi += FiCi[i];
        fiximinx.push(Fi[i]*ximinx);
        powfiximinx.push(Math.pow(fiximinx[i], 2));
        sumFiximinx += fiximinx[i];
        sumPowfiximinx += powfiximinx[i];
    }
    
    // Data Processing Result -- 1
    const dataSortedArray = dataSorted.join('  ');
    dprTable1.rows[1].innerText = dataSortedArray;
    // Data Processing Result -- 2
    dprTable2.rows[0].cells[2].innerText = formatNumber(amountData, decimalPlaces);
    dprTable2.rows[1].cells[2].innerText = formatNumber(cumulative, decimalPlaces);
    dprTable2.rows[2].cells[2].innerText = formatNumber(mean, decimalPlaces);
    dprTable2.rows[4].cells[2].innerText = formatNumber(modus, decimalPlaces);
    dprTable2.rows[3].cells[2].innerText = formatNumber(median, decimalPlaces);
    // Data Processing Result -- 3
    dprTable3.rows[0].cells[2].innerText = formatNumber(min, decimalPlaces);
    dprTable3.rows[1].cells[2].innerText = formatNumber(max, decimalPlaces);
    dprTable3.rows[2].cells[2].innerText = formatNumber(range, decimalPlaces);
    dprTable3.rows[3].cells[2].innerText = formatNumber(ceilNumClasses, decimalPlaces) || 0;
    dprTable3.rows[4].cells[2].innerText = formatNumber(ceilClassLength, decimalPlaces) || 0;
    // Data Processing Result -- 4
    populateTable(lowerValue, upperValue, frequencies, range);
    populateTableComplete(
        lowerValue, 
        upperValue, 
        Fi, 
        cumFi,
        ci,
        FiCi,
        xi,
        ximinx,
        fiximinx,
        powximinx,
        powfiximinx,
        sumF,
        sumFiCi,
        sumFiximinx,
        sumPowfiximinx
    )
}
