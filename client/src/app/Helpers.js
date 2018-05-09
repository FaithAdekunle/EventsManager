/**
 * defines a Helpers class
 */
class Helpers {
  static host = process.env.NODE_ENV === 'production'
    ? 'https://andela-events-manager.herokuapp.com/api/v1'
    : 'http://localhost:7777/api/v1';

  static cloudinaryPreset = process.env.CLOUDINARY_PRESET;

  static cloudinaryUrl = process.env.CLOUDINARY_URL

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
    'Cold Room',
    'kitchenette',
    'Lighting',
    'Parking Space',
    'Security',
    'Dressing Room',
    'Sound System',
    'Projector',
    'Rest Room',
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
   * @returns { array } objects sorted by name property in ascending order
   */
  static sortByName(array) {
    return array.sort((item1, item2) => item1.name > item2.name);
  }
}
export default Helpers;
