import {select, classNames, templates} from './../settings.js';
import utils from './../utils.js';
import AmountWidget from './AmountWidget.js';


class Product{
  constructor(id, data){
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
    // console.log('new Product:', thisProduct);
  }

  renderInMenu(){
    const thisProduct = this;
  

    /* generate HTML based on tempalte */
    const generatedHTML = templates.menuProduct(thisProduct.data);
    // console.log(generatedHTML);

    /* create element using utils.createElementFromHTML */
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);

    /* find menu container */
    const menuContainer = document.querySelector(select.containerOf.menu);

    /* add element to menu */
    menuContainer.appendChild(thisProduct.element);

  }

  getElements(){
    const thisProduct = this;
  
    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    // console.log(thisProduct.accordionTrigger);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    // console.log(thisProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    // console.log(thisProduct.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    // console.log(thisProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    // console.log(thisProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    // console.log(thisProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    // console.log(thisProduct.amountWidgetElem);
  }
  
  initAccordion(){
    const thisProduct = this;

    /* find the clickable trigger (the element that should react to clicking) */
    const clickableTrigger =  thisProduct.accordionTrigger;  //It is changed with getElement, previously was thisProduct.element.querySelector(select.menuProduct.clickable)

    /* START: click event listener to trigger */
    clickableTrigger.addEventListener('click', function(){
      // console.log('clicked product');
   

      /* prevent default action for event */
      event.preventDefault();

      /* toggle active class on element of thisProduct */
      thisProduct.element.classList.toggle('active');

      /* find all active products */
      let activeProducts = document.querySelectorAll('.product.active');

      /* START LOOP: for each active product */
      for (let activeProduct of activeProducts){

        /* START: if the active product isn't the element of thisProduct */
        if (activeProduct !== thisProduct.element) {

          /* remove class active for the active product */
          activeProduct.classList.remove('active');
        
          /* END: if the active product isn't the element of thisProduct */
        } 
          
      /* END LOOP: for each active product */
      }
      
      /* END: click event listener to trigger */
    });
  }

  initOrderForm(){       //będzie uruchamiana tylko raz dla każdego produktu. Będzie odpowiedzialna za dodanie listenerów eventów do formularza, jego kontrolek, oraz guzika dodania do koszyka.
    const thisProduct = this;
    // console.log(thisProduct.initOrderForm);
    
    thisProduct.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisProduct.processOrder();
    });
    
    for(let input of thisProduct.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }
    
    thisProduct.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }

  processOrder(){
    const thisProduct = this;
    // console.log(this.processOrder);
  
    /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
    const formData = utils.serializeFormToObject(thisProduct.form);  //tutaj ma odczytywac wartosci z formularza (name,value) aby wiedziec jakie opcje w menu zostaly zaznaczone laczy sie to z funkcja i index i data.js
    // console.log('formData', formData);

    thisProduct.params = {};

    /* set variable price to equal thisProduct.data.price */
    let price = thisProduct.data.price;     // PYTANIE ale gdzie jest ten obiekt data.price???

    /* START LOOP: for each paramId in thisProduct.data.params */
    for(let paramId in thisProduct.data.params){

      /* save the element in thisProduct.data.params with key paramId as const param */
      const param = thisProduct.data.params[paramId];

      /* START LOOP: for each optionId in param.options */
      for(let optionId in param.options){

        /* save the element in param.options with key optionId as const option */
        const option = param.options[optionId];

       
        /* START IF: if option is selected and option is not default */
        const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
        if (optionSelected && !option.default) {

          /* add price of option to variable price */
          price = price + option.price;
      
          /* END IF: if option is selected and option is not default */
        /* START ELSE IF: if option is not selected and option is default */
        } else if (!optionSelected && option.default){

          /* deduct price of option from price */
          price = price - option.price;

        /* END ELSE IF: if option is not selected and option is default */
        }

        const activeImages = thisProduct.imageWrapper.querySelectorAll('.' + paramId + '-' + optionId);

        /* Condition If: option is marked - all images for this option should get class from classNames.menuProduct.imageVisible */
        if(optionSelected) {

          if (!thisProduct.params[paramId]) {
            thisProduct.params[paramId] = {
              label: param.label,
              options: {},
            };
          }
          thisProduct.params[paramId].options[optionId] = option.label;

          for (let activeImage of activeImages){
            activeImage.classList.add(classNames.menuProduct.imageVisible);
          }
          /* Condition else: all images should lose class saved in classNames.menuProduct.imageVisible */

        } else  {
          for (let activeImage of activeImages) {
            activeImage.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
        /* END LOOP: for each optionId in param.options */
      }

    /* END LOOP: for each paramId in thisProduct.data.params */
    }

    /* multiply price by amount */
    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

    /* set the contents of thisProduct.priceElem to be the value of variable price */
    thisProduct.priceElem.innerHTML = thisProduct.price;

    console.log('parametry thisProduct.params', thisProduct.params);
  }

  initAmountWidget(){
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);  // Do omowienia ten zapis...
    thisProduct.amountWidgetElem.addEventListener('updated', thisProduct.processOrder());
  }

  addToCart() {
    const thisProduct = this;

    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;

    // app.cart.add(thisProduct);

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      }
    });

    thisProduct.element.dispatchEvent(event);  // metodas ktora wywoluje ten event, wywolanie   a eventlistener to odebranie
  }
}

export default Product;