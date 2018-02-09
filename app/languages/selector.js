import en_US from './en_US';
import es_ES from './es_ES';
import ca from './ca';

export default class Labels {
  constructor(language){
    var retText = "";
    switch (language) {
      case "ca":
        return ca;
        break;
      case "es_ES":
        return es_ES;
        break;
      case "en_US":
        return en_US;
        break;
    }
  }
}
