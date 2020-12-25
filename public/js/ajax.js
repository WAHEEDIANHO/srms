$(document).ready(function () {
  const s2 = document.querySelector("#sname");
  // const arr = [1, 2, 3, 4, 5];

  $("#sclass").change(function () {
    s2.innerHTML = `<option>Select student</option>`;

    const cname = this.value;
    fetch(`/students/${cname}`)
      .then((data) => data.json())
      .then((docs) => {
        console.log(docs);
        for (el in docs) {
          console.log(el);
          const option = document.createElement("option");
          option.innerHTML = docs[el].fname;
          option.value = docs[el].fname;
          s2.options.add(option);
        }
      })
      .catch((err) => console.log(err));
  });
});

const fruitBasket = {
  apple: 27,
  grape: 0,
  pear: 14,
};

const rest = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
};

const getFruitNum = (fruit) => {
  return rest().then((v) => fruitBasket[fruit]);
};

// getFruitNum("apple").then((num) => console.log(num))

// const control = async () => {
//   const numsApple = await getFruitNum("apple");
//   console.log(numsApple);
//   const numsGrape = await getFruitNum("grape");
//   console.log(numsGrape);
//   const numPear = await getFruitNum("pear");
//   console.log(numPear);
// };

// //dealing with array

// const fruitToGet = ['apple', 'grape', 'pear']

// const forLoop = async () => {
//   console.log('start')

//   fruitToGet.forEach(async (element) => {
//     const numFruit = await getFruitNum(element)
//     console.log(numFruit)
//   })

//   console.log('end')
// }
