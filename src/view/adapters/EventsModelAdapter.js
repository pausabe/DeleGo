import EventsDAO from '../../model/EventsDAO';
const dataAcc = new EventsDAO();

export default class EventsModelAdapter {
  getEventsData(pageId, internet, filter_selection){
    return dataAcc.getEventsData(pageId, internet, filter_selection);
  }

  saveLocalImage(itemId, imagePath){
    return dataAcc.saveLocalImage(itemId, imagePath);
  }
}
