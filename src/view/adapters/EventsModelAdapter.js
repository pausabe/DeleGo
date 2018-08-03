import EventsDAO from '../../model/EventsDAO';
const dataAcc = new EventsDAO();

export default class EventsModelAdapter {
  getEventsData(pageId,internet){
    return dataAcc.getEventsData(pageId,internet);
  }

  saveLocalImage(itemId,imagePath){
    return dataAcc.saveLocalImage(itemId,imagePath);
  }

  /*checkRealImage(imageId){
    return dataAcc.checkRealImage(imageId);
  }*/
}
