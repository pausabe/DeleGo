import testData from './local-data/testData';

export default class EventsDAO {
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
