const TEMP = `function binarySearch(arr, target) {
  let %SET_LEFT%;
  let %SET_RIGHT%;

  while (%LOOP_CONDITION%) {
    const mid = %CALC_MID_IDX%;

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      %UPDATE_LEFT%;
    } else {
      %UPDATE_RIGHT%;
    }
  }

  return -1;
}`;

const boundarySetting = [
  [`left = 0`, `right = arr.length - 1`],
  [`left = 0`, `right = arr.length`],
  [`left = 0`, `right = arr.length - 1`],
  [`left = -1`, `right = arr.length`],
];


const loopConditionSetting = [
  `left <= right`,
  `left < right`,
  `left + 1 < right`,
];

const midSetting = [
  `Math.ceil(left + (right - left) / 2)`,
  `Math.floor(left + (right - left) / 2)`,
];

const boundaryUpdating = [
  [`left = mid + 1`, `right = mid - 1`],
  [`left = mid + 1`, `right = mid`],
  [`left = mid`, `right = mid - 1`],
  [`left = mid`, `right = mid`],
];

function printCodeString() {
  const retArr = [];

  boundarySetting.forEach((boundarySettingArr) => {
    let ret = TEMP.replace(`%SET_LEFT%`, boundarySettingArr[0])
      .replace(`%SET_RIGHT%`, boundarySettingArr[1]);

      loopConditionSetting.forEach((loopConditionSettingVal) => {
        let ret1 = ret.replace(`%LOOP_CONDITION%`, loopConditionSettingVal);

        midSetting.forEach((midSettingVal) => {
          let ret2 = ret1.replace(`%CALC_MID_IDX%`, midSettingVal);

          boundaryUpdating.forEach((boundaryUpdatingArr) => {
            let ret3 = ret2.replace(`%UPDATE_LEFT%`, boundaryUpdatingArr[0])
              .replace(`%UPDATE_RIGHT%`, boundaryUpdatingArr[1]);

            retArr.push(ret3);
          });
        });
      });
  });

  return retArr;
}

const retArr = printCodeString()

console.log(retArr.join('\n'), retArr.length);
