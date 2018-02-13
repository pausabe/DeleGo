export default class EventsDAO {
  getEventsData(page){
    // const url = `https://pausabe.com/apps/CBCN/page${page}.json`;
    const url = `./local-data/page${page}.json`;

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
}
