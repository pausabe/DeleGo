import EventsDAO from '../../model/EventsDAO';
const dataAcc = new EventsDAO();

export default class EventsModelAdapter {
  getEventsData(page){
    return dataAcc.getEventsData(page);
  }
}