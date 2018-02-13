import testData from './local-data/testData';

export default class EventsDAO {
  getEventsData(page){
    const url = `https://randomuser.me/api/?seed=1&page=${page}&results=8`;
    var promise = fetch(url)
     .then(res => res.json())
     .then(res => {
       return res;
     })
     .catch(error => {
      throw new Error(error);
    });
    return promise;
  }

  getTextToShow(){
    var text = testData.textToShow;
    //here classes do some staff like:
    text += "\nulalah";
    return text;
  }

  getButtonText(){
    var text = testData.buttonText;
    return text;
  }
}
