import {Platform} from 'react-native';

import Constants from '../constants/Constants';

export default class EventsDAO {
  constructor(){
    this.RNFS = require('react-native-fs');

    this.path = this.RNFS.DocumentDirectoryPath+"/events";
    console.log("path DAO",this.path);
  }

  _savePage(pageId){
    const filepath = this.path+"/local/aux/page"+pageId+".json";
    const destPath = this.path+"/local/page"+pageId+".json";

    var promise = this.RNFS.exists(destPath).then((exists) => {
      console.log("saving page "+pageId);
      if(exists){
        this.RNFS.unlink(destPath).then(() => {
          console.log("file deleted");
          this.RNFS.moveFile(filepath,destPath);
        })
      }
      else{
        this.RNFS.moveFile(filepath,destPath);
      }
    });

    return promise;
  }

  downloadThumbnails(pageData){
    var promise = new Promise((resolve, reject) => {
      var promises = [];
      for(i=0;i<pageData.results.length;i++){
        console.log("descarregant thumb ("+pageData.results[i].id+"): ",pageData.results[i].picture.thumbnail);
        var singleProm = this.RNFS.downloadFile({
          fromUrl:pageData.results[i].picture.thumbnail,
          toFile:this.path+"/thumbnailEvent"+pageData.results[i].id+".jpg"
        });
        promises.push(singleProm.promise);
      }
      Promise.all(promises).then(() => resolve())
      .catch((error) => {
        console.log("downloading thumbnail",error);
      });
    });
    return promise;
  }

  getEventsData(pageId,internet){
    var pagePath = this.path+"/local/aux/page"+pageId+".json";
    const url = `https://pausabe.com/apps/CBCN/page${pageId}.json`;
    var promise = new Promise((resolve, reject) => {
      this.RNFS.mkdir(this.path+"/local/aux",{NSURLIsExcludedFromBackupKey:true}).then(() => {
        if(internet){
          this.RNFS.downloadFile({
            fromUrl:url,
            toFile:pagePath
          }).promise.then((res)=>{
            if(res.statusCode===200){
              this.RNFS.readFile(pagePath).then(fileData => {
                var eventsData = JSON.parse(fileData);
                this._checkPage(eventsData,pageId).then(local => {
                  if(local){
                    resolve(eventsData);
                  }
                  else{
                    this.downloadThumbnails(eventsData).then(()=>{
                      resolve(eventsData);
                    })
                    .catch((error) => {
                      console.log("thumbnail downloads",error);
                    });
                  }
                });
              });
            }
            else if(res.statusCode===404){
              resolve("no-page");
            }
            else{
              pagePath = this.path+"/local/aux/page1.json";
              console.log("download status: ",res.statusCode);
            }
          })
          .catch((error) => {
            console.log("Page download",error);
          });
        }
        else{
          //I havn't checked this! actually eventsData doesnt exists here
          this._checkPage(eventsData,pageId).then(local => {
            if(local){
              this.RNFS.readFile(pagePath).then(fileData => {
                var eventsData = JSON.parse(fileData);
                resolve(eventsData);
              });
            }
            else{
              resolve(null);
            }
          });
        }
      });
    })
    return promise;
  }

  saveLocalImage(itemId,imagePath){
    var totalProm = new Promise((resolve, reject) => {
      var imageDestPath = this.path+"/local/imageEvent"+itemId+".jpg";
      this.RNFS.exists(imageDestPath).then((exists)=>{
        if(exists){
          resolve(true);
        }
        else{
          this.RNFS.mkdir(this.path+"/local",{NSURLIsExcludedFromBackupKey:true}).then(() => {
            console.log("descarregant real ("+itemId+"): ",imagePath);
            var downProm = this.RNFS.downloadFile({
              fromUrl:imagePath,
              toFile: imageDestPath
            });
            downProm.promise.then(()=>resolve(false))
            .catch((error) => {
              console.log("download real image",error);
            });
          });
        }
      });
    });
    return totalProm;
  }

  _checkPage(pageData, pageId){
    var promise = new Promise((resolve, reject) => {
      if(pageId > Constants.localPages) resolve(false);
      else{
        var pagePath = this.path+"/local/page"+pageId+".json";
        this.RNFS.exists(pagePath).then((exists) => {
          if(!exists){
            this._savePage(pageId).then(() => resolve(false));
          }
          else{
            this.RNFS.readFile(pagePath).then(fileData => {
              fileJSON = JSON.parse(fileData);
              if(JSON.stringify(fileJSON)!==JSON.stringify(pageData)){
                this._savePage(pageId).then(() => resolve(false));
              }
              else{
                resolve(true);
              }
            });
          }
        });
      }
    });
    return promise;
  }

  checkRealImage(imageId){
    var imagePath = this.path+"/local/imageEvent"+imageId+".jpg";
    return this.RNFS.exists(imagePath);
  }
}
