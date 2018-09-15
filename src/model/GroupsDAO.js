import {Platform} from 'react-native';

import Constants from '../utils/Constants';

export default class GroupsDAO {
  constructor(){
    this.RNFS = require('react-native-fs');

    this.path = this.RNFS.DocumentDirectoryPath+"/groups";
    console.log("[Groups] path DAO",this.path);
  }

  _downloadImages(pageData,localData){
    var promises = [];
    for(i=0;i<pageData.length;i++){
      console.log("[Groups] descarregant group image ("+pageData[i].id+"): ",pageData[i].url_image);
      var singleProm = this.RNFS.downloadFile({
        fromUrl: "https://pausabe.com/apps/CBCN/images/prova2LQ.jpg",//pageData[i].url_image,
        toFile: this.path+"/group"+pageData[i].id+".jpg"
      });
      promises.push(singleProm.promise);
    }
    return Promise.all(promises)
    .then((res) => {
      console.log("[Groups] thumb results", res);
      return pageData;
    })
    .catch((error) => {
      this._throwError('time-out',localData);
    });
  }

  getGroupsData(pageId, internet){
    var pagePath = this.path+"/local/aux/page"+pageId+".json";
    var pagePathSaved = this.path+"/local/page"+pageId+".json";

    const url = `http://${Constants.local_ip}:81/api/group?page=${pageId}&qnt=${Constants.groups_per_page}`;

    console.log("[Groups] url to get groups data: " + url);

    return this.RNFS.exists(pagePathSaved)
    .then((exists)=>{
      if(exists) return this.RNFS.readFile(pagePathSaved);
      else return false;
    })
    .then((fileData) => {
      var localData = null;
      if(fileData) localData = JSON.parse(fileData);

      if(internet){
        return this.RNFS.mkdir(this.path+"/local/aux",{NSURLIsExcludedFromBackupKey:true})
        .then(() => {
          return this.RNFS.downloadFile({
            fromUrl: url,
            toFile: pagePath
          }).promise;
        })
        .then((res)=>{
          if(res.statusCode===200){
            return this.RNFS.readFile(pagePath);
          }
          else{
            throw 'no-page';
          }
        })
        .catch((error) => {
          if(error === 'no-page') this._throwError('no-page');
          else this._throwError('time-out',localData);
        })
        .then(fileData => {
          var groupsData = JSON.parse(fileData);
          return this._downloadImages(groupsData,localData);
        })
        .then((groupsData)=>{
          var newIds = [];
          for(i=0;i<groupsData.length;i++){
            newIds.push(parseInt(groupsData[i].id));
          }
          var falseReturn = {};
          for(i=0;i<newIds.length;i++){
            falseReturn[newIds[i]] = false;
          }
          if(pageId > Constants.local_group_pages) {
            return {groupsData: groupsData};
          }
          else {
            return this._realImagesExist(newIds,this.path+"/local/images/")
            .then((realExists) => {
              if(realExists){
                console.log("[Groups] realExists",realExists);
                if(realExists.deleteIds.length > 0){
                  return this._deleteImages(realExists.deleteIds)
                  .then(() => {
                    return {groupsData: groupsData};
                  });
                }
                else{
                  return {groupsData: groupsData};
                }
              }
              else{
                //images folder doesnt exists
                return {groupsData: groupsData};
              }
            });
          }
        });
      }
      else if(pageId <= Constants.local_group_pages){
        console.log("[Groups] handling no internet but maybe local data");

        var newIds = [];
        for(i=0;i<localData.length;i++){
          newIds.push(parseInt(localData[i].id));
        }
        var trueReturn = {};
        for(i=0;i<newIds.length;i++){
          trueReturn[newIds[i]] = true;
        }
        if(fileData) return {groupsData: localData};
        return false;
      }
      else{
        //crec que mai hauria d'estar aquí
        return {groupsData: null};
      }
    });
  }

  _throwError(errCode,localData){
    console.log("oooh, error!");
    throw {errCode: errCode, localData: localData};
  }

  _deleteImages(imageIds){
    console.log("[Groups] imageIds",imageIds);
    var promises = [];
    for(i=0;i<imageIds.length;i++){
      var auxImagePath = this.path+"/local/images/image-"+imageIds[i]+".jpg";
      console.log("[Groups] should delte:",imageIds[i]);
      promises.push(this.RNFS.unlink(auxImagePath));
    }
    // console.log("promises",promises);
    return Promise.all(promises);
  }

  _realImagesExist(newIds, folderPath){
    return this.RNFS.exists(folderPath)
    .then((folderExists) => {
      if(folderExists) return this.RNFS.readdir(folderPath);
      return false;
    })
    .then((res)=>{
      if(res){
        var oldIds = [];
        for(i=0;i<res.length;i++){
          var auxId = parseInt(res[i].split("-")[1].split(".")[0]);
          oldIds.push(auxId);
        }
        var distinctIds = [];
        var oldContainsNew = {};
        for(i=0;i<oldIds.length;i++){
          if(!newIds.includes(oldIds[i])) {
            distinctIds.push(oldIds[i]);
            oldContainsNew[oldIds[i]] = false;
          }
          else{
            oldContainsNew[oldIds[i]] = true;
          }
        }
        console.log("[Groups] distinctIds",distinctIds);
        console.log("[Groups] oldContainsNew",oldContainsNew);
        return {bools:oldContainsNew,deleteIds:distinctIds};
      }
      return false;
    });
  }
}
