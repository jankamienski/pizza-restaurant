import {templates, select} from './../settings.js';
import AmountWidget from './../components/AmountWidget.js';


class Booking {
  constructor(reserwationWrapper) {
    const thisBooking = this;
    thisBooking.render(reserwationWrapper);
    thisBooking.initWidgets();

  }
  render(reserwationWrapper){
    const thisBooking = this;
    const generateHTML = templates.bookingWidget();

    thisBooking.dom = {};
    thisBooking.dom.wrapper = reserwationWrapper;
    thisBooking.dom.wrapper.innerHTML = generateHTML;
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
  }
  initWidgets(){

    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
  }
}

export default Booking;