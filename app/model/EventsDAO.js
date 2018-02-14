export default class EventsDAO {
  constructor(){
    this.RNFS = require('react-native-fs');
  }

  downloadThumbnails(res){
    console.log("res",res);
    /*this.RNFS.downloadFile({
      fromUrl:
    }).then(
      console.log("file downloaded");
    );*/
  }

  getEventsData(page){
    var online = true; //hardcoded

    if(online){
      const url = `https://pausabe.com/apps/CBCN/page${page}.json`;
      var promise = fetch(url)
       .then(res => res.json())
       .then(res => {
         this.downloadThumbnails(res);
         //Aquí falta guardar/update larxiu a local
         return res;
       })
       .catch(error => {
        throw new Error(error);
      });
      return promise;
    }
    else{
      var path = this.RNFS.DocumentDirectoryPath+`/app/local-data/page${page}.json`;
      console.log("path",path);
      var promise = this.RNFS.readFile(path, 'utf8')
        .then(res => {
          console.log("res:",res);
          return res;
        })
        .catch(error => {
         throw new Error(error);
       });
      return promise;
    }
  }
}
