import GroupsDAO from '../../model/GroupsDAO';
const dataAcc = new GroupsDAO();

export default class GroupsModelAdapter {
  getGroupsData(pageId, internet){
    return dataAcc.getGroupsData(pageId, internet);
  }
}
