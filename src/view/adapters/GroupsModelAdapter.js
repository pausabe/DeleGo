import GroupsDAO from '../../model/GroupsDAO';
const dataAcc = new GroupsDAO();

export default class GroupsModelAdapter {
  getGroupsData(pageId, internet, filter_selection){
    return dataAcc.getGroupsData(pageId, internet, filter_selection);
  }
}
