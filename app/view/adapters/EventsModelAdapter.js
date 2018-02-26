import EventsDAO from '../../model/EventsDAO';
const dataAcc = new EventsDAO();

export default class EventsModelAdapter {
  getEventsData(pageId,internet){
    return dataAcc.getEventsData(pageId,internet);
  }

  saveLocalImage(itemId,imagePath,flatIndex){
    return dataAcc.saveLocalImage(itemId,imagePath,flatIndex);
  }

  checkRealImage(imageId){ //podria/hauria d'estar perfectament dins de saveLocalImage
    return dataAcc.checkRealImage(imageId);
  }
}
