export default class Labels {
  eventsTabTitle(language){
    var retText = "";
    switch (language) {
      case "ca":
        retText="Esdeveniments";
        break;
      case "es":
        retText="Eventos";
        break;
      case "en":
        retText="Events";
        break;
    }
    return retText;
  }

  groupsTabTitle(language){
    var retText = "";
    switch (language) {
      case "ca":
        retText="Grups";
        break;
      case "es":
        retText="Grupos";
        break;
      case "en":
        retText="Groups";
        break;
    }
    return retText;
  }
}
