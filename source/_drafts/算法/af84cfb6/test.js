const sleep = (sec) => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, sec * 1000);
}); 
function HardMan(name) {
  HardMan.execQueue = [];
  HardMan.execQueueStart = () => {
    clearTimeout(HardMan.timer);
    HardMan.timer = setTimeout(async () => {
      for (let i = 0; i < HardMan.execQueue.length; i += 1) {
        await HardMan.execQueue[i]();
      }
    });
  };
  
  HardMan.execQueueStart();
  HardMan.execQueue.push(() => console.info(name));
  return HardMan;
}

HardMan.timer = -1;
HardMan.rest = (sec) => {
  HardMan.execQueueStart();
  HardMan.execQueue.push(() => {
    console.info(`start learning after ${sec}s`);
    return sleep(sec)
  });
  return HardMan;
};

HardMan.learn = (ctn) => {
  HardMan.execQueueStart();
  HardMan.execQueue.push(() => console.info(`learning ${ctn}`));
  return HardMan;
};

HardMan.restFirst = (sec) => {
  HardMan.execQueueStart();

  HardMan.execQueue = [() => {
    console.info(`start learning after ${sec}s`);
    return sleep(sec)
  }, ...HardMan.execQueue];
  return HardMan;
};

HardMan('lilei').restFirst(3).learn('chinese');

// --------------------------


/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left + 1 < right) {
    const mid = Math.ceil(left + (right - left) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid;
    } else {
      right = mid;
    }
  }

  return -1;
}
// 解决了
// [-1,0,3,5,9,12]\n2


/**
 * [5]\n0
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  if (arr.length === 1) {
    return arr[0] === target ? 0 : -1;
  }

  while (left + 1 < right) {
    const mid = Math.ceil(left + (right - left) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid;
    } else {
      right = mid;
    }
  }

  return -1;
}


/**
 * [2, 5]\n5
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  if (arr.length === 1) {
    return arr[0] === target ? 0 : -1;
  }

  if (arr.length === 2) {
    return arr[0] === target
      ? 0 : arr[1] === target ? 1 : -1;
  }

  while (left + 1 < right) {
    const mid = Math.ceil(left + (right - left) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid;
    } else {
      right = mid;
    }
  }

  return -1;
}


/**
 * [-1,0,5]\n5
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  if (arr[left] === target) {
    return left;
  }

  if (arr[right] === target) {
    return right;
  }
  
  while (left + 1 < right) {
    const mid = Math.ceil(left + (right - left) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid;
    } else {
      right = mid;
    }
  }

  return -1;
}

/**
 * [-1,0,5]\n5
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.ceil(left + (right - left) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid;
    } else {
      right = mid;
    }

    if (left + 1 >= right) {
      if (arr[left] === target) {
        return left;
      }

      if (arr[right] !== target) {
        return -1;
      }
    }
  }

  return -1;
}

// --------------------

/**
 * [-1,0,5]\n5
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  let cnt = 0;

  while (left <= right) {

    if (cnt >= 10) {
      break;
    }
    const mid = Math.ceil(left + (right - left) / 2);

    console.info(arr, right, left, mid)

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }

    cnt += 1;
  }

  return -1;
}
