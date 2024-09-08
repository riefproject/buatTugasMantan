document.addEventListener('DOMContentLoaded', () => {
    const inputValue = document.getElementById('inputValue');
    const inputUnit = document.getElementById('inputUnit');
    const outputValue = document.getElementById('outputValue');
    const outputUnit = document.getElementById('outputUnit');
    const swapBtn = document.getElementById('swapBtn');
  
    const conversionRates = {
      meter: 1,
      kilometer: 0.001,
      centimeter: 100,
      millimeter: 1000
    };
  
    function convert() {
      const inputVal = parseFloat(inputValue.value);
      const inputUnitVal = inputUnit.value;
      const outputUnitVal = outputUnit.value;
  
      if (!isNaN(inputVal)) {
        const convertedValue = (inputVal * conversionRates[inputUnitVal]) / conversionRates[outputUnitVal];
        outputValue.value = convertedValue;
      } else {
        outputValue.value = '';
      }
    }
  
    function swapUnits() {
      const tempUnit = inputUnit.value;
      inputUnit.value = outputUnit.value;
      outputUnit.value = tempUnit;
      convert();
    }
  
    inputValue.addEventListener('input', convert);
    inputUnit.addEventListener('change', convert);
    outputUnit.addEventListener('change', convert);
    swapBtn.addEventListener('click', swapUnits);
  });
  