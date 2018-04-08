/**
 * defines a Helpers class
 */
class Helpers {
  static NODE_ENV = process.env.NODE_ENV || 'development';
  static host = Helpers.NODE_ENV === 'development' ?
    'http://localhost:7777/api/v1' : 'https://andela-events-manager.herokuapp.com/api/v1';

  static cloudinaryPreset = process.env.CLOUDINARY_PRESET;

  static cloudinaryUrl = process.env.CLOUDINARY_URL;

  static centerTypes = [
    'Anniversary',
    'Birthday',
    'Wedding',
    'Meeting',
    'Conference',
    'Seminar',
    'Summit',
    'Funeral',
    'Others',
  ];

  static facilities = [
    'Tables',
    'Chairs',
    'Stage',
    'Power Supply',
    'Air Condition',
    'Lighting',
    'Parking Space',
    'Dressing Room',
    'Sound System',
    'Projector',
  ];

  /**
   * extracts the first name full name
   * @param { string } fullName
   * @returns { string } first name
   */
  static getFirstName(fullName) {
    const firstName = fullName.split(' ')[0];
    return `${firstName[0].toUpperCase()}${firstName.slice(1)}`;
  }

  /**
   * converts date string from YYYY-MM-DD to DD/MM/YYYY
   * @param { string } date
   * @returns { string } first name
   */
  static changeDateFormat(date) {
    const dateSplit = date.split('-');
    return `${dateSplit[2]}/${dateSplit[1]}/${dateSplit[0]}`;
  }

  /**
   * sorts array of objects in ascending order by name property
   * @param { array } array
   * @returns { array } array of objects sorted by name property in ascending order
   */
  static sortByName(array) {
    return array.sort((item1, item2) => item1.name > item2.name);
  }

  /**
   * sorts array of objects in ascending order by start property
   * @param { array } array
   * @returns { array } array of objects sorted by start property in ascending order
   */
  static sortByDate(array) {
    return array.sort((item1, item2) => {
      const item1Start = item1.start.split('/');
      const item2Start = item2.start.split('/');
      if (item1Start[2] !== item2Start[2]) return item1Start[2] > item2Start[2];
      if (item1Start[1] !== item2Start[1]) return item1Start[1] > item2Start[1];
      return item1Start[0] > item2Start[0];
    });
  }

  /**
   * gets id of center from array of centers
   * @param { object } eventCenter
   * @param { array } centersState
   * @returns { array } array of objects sorted by start property in ascending order
   */
  static getCenterId(eventCenter, centersState) {
    const centerName = eventCenter.value;
    let centerId = 0;
    centersState.map((center) => {
      if (center.name === centerName) centerId = center.id;
      return null;
    });
    return centerId;
  }
}

export default Helpers;
