class Helpers {
  static localHost = 'http://localhost:7777/api/v1';

  static host = 'http://andela-events-manager.herokuapp.com/api/v1';

  static cloudinaryPreset = 'axgrmj0a';

  static loudinaryUrl = 'https://api.cloudinary.com/v1_1/dutglgwaa/upload'

  static getFirstName(fullName) {
    const firstName = fullName.split(' ')[0];
    return `${firstName[0].toUpperCase()}${firstName.slice(1)}`;
  }

  static changeDateFormat(date) {
    const dateSplit = date.split('-');
    return `${dateSplit[2]}/${dateSplit[1]}/${dateSplit[0]}`;
  }

  static sortByName(array) {
    return array.sort((item1, item2) => item1.name > item2.name);
  }

  static sortByDate(array) {
    return array.sort((item1, item2) => {
      const item1Start = item1.start.split('/');
      const item2Start = item2.start.split('/');
      if (item1Start[2] !== item2Start[2]) return item1Start[2] > item2Start[2];
      if (item1Start[1] !== item2Start[1]) return item1Start[1] > item2Start[1];
      return item1Start[0] > item2Start[0];
    });
  }
}

export default Helpers;
