export namespace ArrayUtils {

  /**
   * Return the array sorted by property
   * @export
   * @param {array} data
   * @param {string} property
   * @returns
   */
  export function sortArrayByProperty(data: any[], property: string) {
    return data.sort((a, b) => {
      if (a[property].toLocaleLowerCase() < b[property].toLocaleLowerCase()) return -1;
      if (a[property].toLocaleLowerCase() > b[property].toLocaleLowerCase()) return 1;
      return 0;
    });
  }
}

export default ArrayUtils;
