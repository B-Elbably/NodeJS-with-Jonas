const fs = require("fs");
const superagent = require("superagent");
const { reject } = require("superagent/lib/request-base");

// TODO: Callback Hell
fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`Hey! ${data} I'm from Callback Hell`);
  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .end((err, res) => {
      if (err) return console.log(err.message);
      console.log(res.body.message);

      fs.writeFile("dog-img.txt", res.body.message, (err) => {
        console.log("Random dog image saved to file! (Callback Hell)");
      });
    });
});

// TODO: (Road to Promise)

fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`Hey! ${data} I'm from Road to Promise`);
  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .then((res) => {
      if (err) return console.log(err.message);
      console.log(res.body.message);

      fs.writeFile("dog-img.txt", res.body.message, (err) => {
        if (err) return console.log(err.message);
        console.log("Random dog image saved to file! (semi)");
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// TODO: Building Promises
const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject("Not Found ");
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject("Can not Write");
      resolve("Success");
    });
  });
};

readFilePro(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`Hey! ${data} I'm from Promise`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(res.body.message);
    return writeFilePro("dog-img.txt", res.body.message);
    // fs.writeFile("dog-img.txt", res.body.message, (err) => {
    //   if (err) return console.log(err.message);
    //   console.log("Random dog image saved to file!");
    // });
  })
  .then(() => {
    console.log("Random dog image saved to file! (Promise)");
  })
  .catch((err) => {
    console.log(err.message);
  });

// TODO: Async/Await
const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/doog.txt`);
    console.log(`Hey! ${data} I'm from Async/await`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);

    await writeFilePro("dog-img.txt", res.body.message);
    console.log("Random dog image saved to file! (Async/wait)");
  
} catch (err) {
    console.log(err);
    throw err;
  }
  return "2: Ready 🐶";
};
// getDogPic();

// TODO: Async/Function
console.log("1: before firing getDogPic");
getDogPic().then((x) => {
  console.log(x);
  console.log("3: after firing getDogPic");
}).catch((err) => {
  console.log("Error catched from Async function");
});
