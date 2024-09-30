
const address = document.getElementById('address');
const deliveryFee = document.getElementById('deliveryFee');
const orderType = document.getElementById('orderType');
const cashTip = document.getElementById('cashTip');
const gratuity = document.getElementById('gratuity');
const orderTotal = document.getElementById('orderTotal');
const submitButton = document.getElementById('submit');

let stopNumber = 1;

submitButton.onclick = function() {submitDelivery()};

function submitDelivery(){
    const newDelivery = new ConstructDelivery(address.value, orderType.value/*, orderTotal, gratuity, deliveryFee*/);
    newDelivery.delivery();
}

function ConstructDelivery(address, type /*, total, tip, fee*/) {
    this.address = address;
    this.orderType = type;
    /*this.orderTotal = total;
    this.gratuity = tip;
    this.deliveryFee = fee;*/
    this.delivery = function() {
        console.log("Delivery Number: " + stopNumber);
        console.log("Address: " + this.address);
        console.log("Order Type: " + this.orderType);
        /*console.log("Order Total: " + this.orderTotal);
        console.log("Gratuity: " + this.gratuity);
        console.log("Fee: " + this.deliveryFee);*/
    };
}