const colorRadioDiv = document.querySelector('.custom-color'); 
const currentProduct = document.querySelector('.active'); 
const colorRadio = document.querySelector('.select-color');
const customColorInput = document.querySelector('#favcolor');
let existingInput = document.querySelector('#customColorName');
colorRadioDiv.addEventListener('click',function(e) {
  e.preventDefault();
  colorRadio.classList.remove("hide");
});
currentProduct.addEventListener('click',function(e) {
  e.preventDefault();
  colorRadio.classList.add("hide");
  existingInput.remove();
});


customColorInput?.addEventListener('input', () => {
    appendOrUpdateInput(customColorInput.value);
});
function appendOrUpdateInput(val) {
    if (!existingInput || existingInput == null) {
        existingInput = document.createElement('input');
        existingInput.id = 'customColorName';
        existingInput.name = 'properties[Custom Color]';
        existingInput.value = val;
        existingInput.type = 'hidden';
        document.querySelector('.product-form form[action="/cart/add"]').appendChild(existingInput);
    }else{
      existingInput.remove();
      existingInput = document.createElement('input');
      existingInput.id = 'customColorName';
      existingInput.name = 'properties[Custom Color]';
      existingInput.value = val;
      existingInput.type = 'hidden';
      document.querySelector('.product-form form[action="/cart/add"]').appendChild(existingInput);
    }
}