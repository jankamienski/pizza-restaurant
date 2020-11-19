import {select, settings} from './../settings.js';
import BaseWidget from './BaseWidget.js';  
class AmountWidget extends BaseWidget{
  constructor(element){
    super(element, settings.amountWidget.defaultValue);  
    const thisWidget = this;

    thisWidget.getElements(element);
  
    thisWidget.initActions();

    // console.log('AmountWidget:', thisWidget);
    // console.log('constructor arguments:', element);
  }

  getElements(){  
    const thisWidget = this;
  
    
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }

  isValid(value){  
    return !isNaN(value) //sprawdza czy przekazana wartosc nie jest liczba i mamy zaprzeczenie 
    && value >= settings.amountWidget.defaultMin 
    && value <= settings.amountWidget.defaultMax;
  }

  renderValue() {   
    const thisWidget = this;
   
    thisWidget.dom.input.value = thisWidget.value;  
  }

  initActions(){
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function() {
      (thisWidget.dom.input.value);
    });
  
    thisWidget.dom.linkDecrease.addEventListener('click', function(event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });
    thisWidget.dom.linkIncrease.addEventListener('click', function(event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  }
}

export default AmountWidget;