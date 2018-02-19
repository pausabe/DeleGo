import EventsDAO from '../../model/EventsDAO';
const dataAcc = new EventsDAO();

export default class EventsModelAdapter {
  getEventsData(pageId){
    var promise = new Promise((resolve, reject) => {
      //get events data provided for api
      dataAcc.getEventsData(pageId).then(eventsData => {
        if(eventsData !== "no-page"){
          //check if this data I already have it so there is no need to download images
          //and update offline list in case of not having it
          dataAcc.checkPage(eventsData,pageId).then(offline => {
            if(offline){
              resolve({eventsData:eventsData,offline:offline});
            }
            else{
              dataAcc.downloadThumbnails(eventsData).then(()=>{
                resolve({eventsData:eventsData,offline:offline});
              });
            }
          });
        }
        else{
          resolve("no-page");
        }
      });
    });
    return promise;
  }

  saveOfflineImage(itemId,imagePath){
    return dataAcc.saveOfflineImage(itemId,imagePath);
  }
}
