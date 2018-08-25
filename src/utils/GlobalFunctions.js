module.exports = {
  Month_To_String(month){
    try {
      switch (month) {
        case '01':
          return 'GEN';
          break;
        case '02':
          return 'FEB';
          break;
        case '03':
          return 'MAR';
          break;
        case '04':
          return 'ABR';
          break;
        case '05':
          return 'MAI';
          break;
        case '06':
          return 'JUN';
          break;
        case '07':
          return 'JUL';
          break;
        case '08':
          return 'AGO';
          break;
        case '09':
          return 'SET';
          break;
        case '10':
          return 'OCT';
          break;
        case '11':
          return 'NOV';
          break;
        case '12':
          return 'DES';
          break;
      }
    } catch (e) {
      console.log("Error (EventItem / Month_To_String)",e);
      return "";
    }
  },
  
}
