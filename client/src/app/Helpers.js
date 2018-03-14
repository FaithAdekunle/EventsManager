class Helpers {
  static getFirstName(fullName) {
    const firstName = fullName.split(' ')[0];
    return `${firstName[0].toUpperCase()}${firstName.slice(1)}`;
  }

  static changeDateFormat(date) {
    const dateSplit = date.split('-');
    return `${dateSplit[2]}/${dateSplit[1]}/${dateSplit[0]}`;
  }
}

export default Helpers;
