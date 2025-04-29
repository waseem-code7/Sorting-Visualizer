let getRandomNumber = function(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

window.addEventListener("load", (event) => {
    init();
  });

let init = function() {
    let arr = [];
    let N = 30;
    for(let i = 0; i < N; i++) {
        arr.push(getRandomNumber(50, 375));
    }
    showBars(arr);
}

let getArrayToVisualize = function(divs) {

    let divsArr = Array.prototype.slice.call( divs )
    let arr = divsArr.map(function(divsArr) {
        return Number(divsArr.attributes.numval.value)
    })
    return arr;
}

let bubbleSortReturnSwaps = function(arr) {
    let swaps = [];
    for(let i = 0; i < arr.length; i++) {
        for(j = 0; j < arr.length - i; j++) {
            if(arr[j] > arr[j + 1]) {
                swaps.push([j, j + 1])
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return swaps;
}

let insertionSortReturnSwaps = function(arr) {
    let swaps = [];
    for(let i = 1; i < arr.length; i++) {
        for(let j = i - 1; j >= 0; j--) {
            if(arr[j] > arr[j + 1]) {
                swaps.push([j, j + 1]);
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            } else {
                break;
            }
        }
    }
    return swaps;
}

let selectionSortReturnSwaps = function(arr) {
    let swaps = [];
    for(let i = 0; i < arr.length - 1; i++) {
        let minIdx = i;
        for(let j = i + 1; j < arr.length; j++) {
            if(arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if(i != minIdx) {
            swaps.push([minIdx, i]);
            let temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
    return swaps;
}

let sleepAndAnimate = function(arr, swaps, color = "#F31559", timeout = 60) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            showBars(arr, true, swaps, color);
            return resolve();
        }, timeout);
    })
}

let swapByIdx = function(arr, i , j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
 
let mergeTwoSortedList = async function(arr, start, mid, end) {

    let left = start;
    let right = mid + 1;
    let temp = [];
    while(left <= mid && right <= end) {
        if(arr[left] < arr[right]) {
            temp.push(arr[left]);
            left += 1;
        } else {
            temp.push(arr[right]);
            right += 1;
        }
    }

    while(left <= mid) {
        temp.push(arr[left]);
        left += 1;
    }

    while(right <= end) {
        temp.push(arr[right]);
        right += 1;
    }
    for(let i = start; i <= end; i++) {
        arr[i] = temp[i - start];
        await sleepAndAnimate(arr, [i, i]);
    }
}


let mergeSort = async function(arr, start, end) {
    if(start >= end) {
        return;
    }
    let mid = parseInt((start + end) / 2);
    await mergeSort(arr, start, mid);
    await mergeSort(arr, mid + 1, end);
    await mergeTwoSortedList(arr, start, mid, end);
}

let mergeSortVisualize = async function(arr) {
    await mergeSort(arr, 0, arr.length - 1);
    showBars(arr, true);
}

let partition = function(arr, lo, hi, pivot, swaps) {
    let i = lo, j = lo;

    while(i <= hi) {
        if(arr[i] > pivot) {
            i += 1;
        } else {
            swaps.push([i, j]);
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
            i += 1;
            j += 1;
        }
    }

    return j - 1;
}

let quickSort = function(arr, lo, hi, swaps) {
    if(lo >= hi) {
        return;
    }

    let pivot = arr[hi];
    let pivotIndex = partition(arr, lo, hi, pivot, swaps);
    quickSort(arr, lo, pivotIndex - 1, swaps);
    quickSort(arr, pivotIndex + 1, hi, swaps);
}

let quickSortReturnSwaps = function(arr) {
    let swaps = [];
    quickSort(arr, 0, arr.length - 1, swaps);
    console.log(arr);
    return swaps;
}

let fadeOutRecursive = function(element) {
    if(Number(element.style.opacity) <= 0) {
        element.style.opacity = 0;
        return;
    }

    setTimeout(function() {
        element.style.opacity -= 1;
        fadeOutRecursive(element);
    }, 1000);
}

let fadeOut = function(element, text = "Hello") {
    element.textContent = text;
    element.style.opacity = 1;
    fadeOutRecursive(element);
}

let sleep = async function(swaps, arr, cb) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            animate(swaps, arr, cb);
        }, 10);
    })
} 

let animate = async function(swaps, arr, cb) {
    if(swaps.length === 0) {
        showBars(arr, true);
        fadeOut(document.getElementById("box-main"), "Sorting Completed");
        cb(false);
        return;
    }
    cb(true);
    let [i, j] = swaps.shift();
    if(i !== j) {
        await sleepAndAnimate(arr, [i, j], "#252B48", 10);
        [arr[i], arr[j]] = [arr[j], arr[i]];
        await sleepAndAnimate(arr, [i, j], "#F31559", 10);
    }
    await sleep(swaps, arr, cb);
}

let enableDisableButtons = function(isDisabled = true) {
    document.getElementById("add-bars").disabled = isDisabled;
    document.getElementById("visualize").disabled = isDisabled;
    document.getElementById("algo").disabled = isDisabled;
}
 
let visualize = async function() {
    enableDisableButtons(true);
    let algorithm = document.getElementById("algo").value;
    let divs = document.getElementsByClassName("bar");
    let arr = getArrayToVisualize(divs);
    let ALGORITHM_VIS_SWAPS = ["1", "2", "3", "5"];
    let copy = [...arr];
    let swaps = [];
    if(algorithm === "1") {
        swaps = bubbleSortReturnSwaps(copy);
    } else if(algorithm === "2") {
        swaps = selectionSortReturnSwaps(copy);
    } else if(algorithm === "3") {
        swaps = insertionSortReturnSwaps(copy);
    } else if(algorithm === "4") {
        let testSortedCopy = [...copy];
        swaps = insertionSortReturnSwaps(testSortedCopy);
        if(swaps.length === 0) {
            fadeOut(document.getElementById("box-main"), "Array is already sorted.");
            return;
        }
        await mergeSortVisualize(copy);
        enableDisableButtons(false);
    } else {
        swaps = quickSortReturnSwaps(copy);
    }
    if(ALGORITHM_VIS_SWAPS.includes(algorithm)) {
        if(swaps.length === 0) {
            fadeOut(document.getElementById("box-main"), "Array is already sorted.");
            return;
        }
        animate(swaps, arr, enableDisableButtons);
        document.getElementById("box-main").style.visibility = "initial";
    }
}

let showBars = function(arr, clearContainer = false, swappedPair = [], color = "#F31559") {

    let container = document.getElementById("container");
    if(clearContainer) {
        container.innerHTML = "";
    }
    for(let i = 0; i < arr.length; i++) {
        let divTag = document.createElement("div");
        divTag.style.height = arr[i] + "px";
        divTag.classList.add("bar");
        divTag.setAttribute("numVal", arr[i]);

        if(swappedPair && swappedPair.length > 0 && swappedPair.includes(i)) {
            divTag.style.backgroundColor = color;
            divTag.style.color = "#D8D9DA"
        }
        container.appendChild(divTag);
    }
    let divs = document.getElementsByClassName("bar");
    let divTags = getArrayToVisualize(divs);
    if(divTags.length <= 30) {
        let i = 0;
        for(let div of divs) {
            div.textContent = divTags[i];
            i += 1;
        }
    } else {
        for(let div of divs) {
            div.textContent = "";
        }
    }
}

