import EventsDAO from '../../model/EventsDAO';
const dataAcc = new EventsDAO();

export default class EventsModelAdapter {
  getTextToShow(){
    return dataAcc.getTextToShow();
  }

  getButtonText(){
    return dataAcc.getButtonText();
  }
}
