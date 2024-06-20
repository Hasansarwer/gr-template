

const { Frame, Circle, Button, Label, Rectangle, GlowEffect, Pic, Emitter } = zim;

class Title{
  constructor(title){
    this.title = title;
    this.createTitle(title);
    this.setUpStage();
  }

  createTitle(title){
    const rect = new Rectangle(1920, 80, "black");
    rect.alpha = 0.5;
    rect.center().mov(0, -470);
    const text = new Label({text: title, size: 50, color: "white", font: "Noto Sans Bengali UI"});
    text.center(rect);
  }

  updateTitle(title){
    text.text = title;
  }

  setUpStage(){
    let rect2 = new Rectangle(1920, 30, "#f88379");
    rect2.alpha = 0.8;
    rect2.center().mov(0, -415);

    let text2 = new Label({
    text: "বাম দিকের উত্তরগুলো ড্র্যাগ করে সঠিক জায়গায় বসাও➡️➡️➡️",
    size: 20,
    font: "Noto Sans Bengali UI",
    color: "white",
    });
    text2.center(rect2).pos(1200, 5);

    text2.animate({
      target: text2,
      props: { x: 100 },
      time: 10,
      loop: true,
      rewind: true,
    });
  }
}
class Recap{
  constructor(data){
    this.gr = data.grs[0];
    this.grCount = data.grs.length;
    this.lang = data.lang;
    this.title = data.title[this.lang] + ' ' + this.gr.title[this.lang];
    this.dropZones = [];
    this.answerPads = [];
    this.index = 0;
    this.bg = new Pic(`${this.gr.bg.src}`).center();
    this.createRecap();
    // this.nextRecap(i, grs, title, lang, correctSound, wrongSound);
    // this.previous(i, grs, title, lang, correctSound, wrongSound);
    // this.reStart();
  }

  createRecap(){
    // this.gr = data.grs[0];
    // const bg = new Pic(`${gr.bg.src}`).center();
    const title = new Title(this.title);
    this.dropZones = this.createDropZones(this.gr.answers);
    this.answerPads = this.createAnswerPads(this.gr.answers);
    const shuffledAnswerPads = this.pickRandom(this.answerPads);
    shuffledAnswerPads.forEach((answerPad, index) => {
      answerPad.pos(100, 300);
    });
  }

  updateRecap(){
    this.gr = grs[this.index];
    this.bg.removeFrom(Frame.stage);
    this.bg = new Pic(`${gr.bg.src}`).center();
    this.title = data.title[lang] + ' ' + this.gr.title[lang];
    title.updateTitle(this.title);
    this.dropZones.forEach((dropZone) => {
      dropZone.removeFrom(Frame.stage);
    });
    this.answerPads.forEach((answerPad) => {
      answerPad.removeFrom(Frame.stage);
    });
    this.dropZones = this.createDropZones(this.gr.answers);
    this.answerPads = this.createAnswerPads(this.gr.answers);
    const shuffledAnswerPads = this.pickRandom(this.answerPads);
    shuffledAnswerPads.forEach((answerPad, index) => {
      answerPad.pos(100, 300);
    });
  }
  
  nextRecap(){
    const nextButton = new Button({label: "Next", width: 100, height: 100, backgroundColor: "lime", rollBackgroundColor: "limegreen", borderWidth: 0, gradient: 0.4, corner: 50})
      .center()
      .mov(700, 460);
      if(this.index === this.grCount-1){
        nextButton.visible = false;
      }else {
        nextButton.visible = true;
      }
      nextButton.on("click", () => {
          if(this.index<this.grCount-1){
            this.index++;
            this.updateRecap();
          }
      });
  }
  

  previousRecap(){
    const previousButton = new Button({label: "Previous", width: 100, height: 100, backgroundColor: "lime", rollBackgroundColor: "limegreen", borderWidth: 0, gradient: 0.4, corner: 50})
      .center()
      .mov(-800, 460);
      if(this.index === 0){
        previousButton.visible = false;
      }else {
        previousButton.visible = true;
      }
      previousButton.on("click", () => {
          if(this.index>0){
            this.index--;
            this.updateRecap();
          }
      });
    
    }

  pickRandom(answerPads){
    return(answerPads.sort(() => Math.random() - 0.5));
  }

  createDropZones(answers){
    const dropZones = [];
    answers.forEach((dropZoneData, index) => {
      let dropZone = new Rectangle({
        width: 300,
        height: 80,
        corner: 20,
        color: "black",
        borderWidth: 1,
        borderColor: "black",
        shadowBlur: 0
      });
      dropZone.alpha = 0.3;
      dropZone.id = dropZoneData.id;
      dropZone.center().mov(dropZoneData.x - 980, dropZoneData.y - 540);
      dropZones.push(dropZone);
    });
    return dropZones;
  }
  
  createAnswerPads(answers){
    const answerPads = [];
    const wrongSound = new Audio("assets/sounds/wrongSound.mp3");
    const correctSound = new Audio("assets/sounds/correctSound.mp3");
    answers.forEach((answer) => {
      let ansPad = new Button({
        width: 300,
        height: 80,
        corner: 20,
        backgroundColor: "#FAF9F6",
        rollBackgroundColor: "#EDEADE",
        rollColor: "black",
        label: answer.answer[this.lang],
        color: "black",
        shadowBlur: 20,
        shadowColor: "pink",
        borderWidth: 0,
        borderColor: "black"
      }).drag();
  
      ansPad.label.size = 20;
      ansPad.label.font = "Noto Sans Bengali UI";
      ansPad.answered = false;
      answerPads.push(ansPad);
      ansPad.on("click", () => {
        this.dropZones.forEach((dropZoneData) => {
          if (ansPad.hitTestRect(dropZoneData)) {
            if (answer.id === dropZoneData.id) {
              ansPad.answered = true;
              correctSound.play();
              ansPad.animate({
                target: ansPad,
                props: { x: dropZoneData.x, y: dropZoneData.y },
                time: 0.5,
                ease: "quadIn",
              });
  
              ansPad.removeAllEventListeners();
  
              let emitter = new Emitter({
                obj: new Circle(5, [green, orange, yellow, pink, blue, purple]),
                interval: 0.0001,
                life: 0.02,
                force: 3.5,
                gravity: 10.5,
                wind: 0.7,
                warm: true,
                width: 1,
                height: 1,
                poolMin: 100,
                sinkForce: 200
              }).center().pos(dropZoneData.x + 150, dropZoneData.y + 20);
  
              setTimeout(() => {
                emitter.removeFrom(Frame.stage);
              }, 1000);
            } else {
              ansPad.animate({
                target: ansPad,
                props: { x: 100, y: 300 },
                time: 0.5,
                ease: "Bounce",
              });
              wrongSound.play();
            }
          }
        });
      });
    });
    return answerPads;
  }
}

new Frame(
  FIT,
  1920,
  1080,
  "#333",
  "#333",
  ready,
  "assets/",
  new zim.Waiter()
);

function ready() {
  // const correctSound = new Audio("assets/sounds/correctSound.mp3");
  // const wrongSound = new Audio("assets/sounds/wrongSound.mp3");
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      const graphicsRecape = new Recap(data);
      reStart();
    });
}

// function setRecap(grs, title, lang, correctSound, wrongSound) {
//   let i = 0;
//   createReCap(grs[0], title, lang, correctSound, wrongSound);
//   next(i, grs, title, lang, correctSound, wrongSound);
//   previous(i, grs, title, lang, correctSound, wrongSound);
// }

// function next(i, grs, title, lang, correctSound, wrongSound) {
//   const nextButton = new Button({label: "Next", width: 100, height: 100, backgroundColor: "lime", rollBackgroundColor: "limegreen", borderWidth: 0, gradient: 0.4, corner: 50})
//     .center()
//     .mov(700, 460);
//     console.log(i, grs.length-1);
//     if(i === grs.length-1){
//       nextButton.visible = false;
//     }else {
//       nextButton.visible = true;
//     }
//     // const pic = new Pic("assets/images/restart.png").sca(0.15).center(restartButton);
//     // pic.rotation = 60;
//     nextButton.on("click", () => {
//         if(i<grs.length-1){
//           i++;
//           createReCap(grs[i], title, lang, correctSound, wrongSound);
//         }
//     });
  
//   }

//   function previous(i, grs, title, lang, correctSound, wrongSound) {
//     const previousButton = new Button({label: "Previous", width: 100, height: 100, backgroundColor: "lime", rollBackgroundColor: "limegreen", borderWidth: 0, gradient: 0.4, corner: 50})
//       .center()
//       .mov(-800, 460);
//       if(i === 0){
//         previousButton.visible = false;
//       }else {
//         previousButton.visible = true;
//       }
//       // const pic = new Pic("assets/images/restart.png").sca(0.15).center(restartButton);
//       // pic.rotation = 60;
//       previousButton.on("click", () => {
//           if(i>0){
//             i--;
//             createReCap(grs[i], title, lang, correctSound, wrongSound);
//           }
//       });
    
//     }

  

//   function createReCap(gr, title, lang, correctSound, wrongSound) {
//     const bg = new Pic(`${gr.bg.src}`).center();
//     const grTitle = title[lang] + ' ' + gr.title[lang];
//     setUpStage(grTitle, lang);
//     const dropZones = []; // array to store dropZones objects
//     const answerPads = []; // array to store answerPads objects
//     gr.answers.forEach((dropZoneData, index) => {
//       // Create a drop zone rectangle with an id property
//       let dropZone = new Rectangle({
//         width: 300,
//         height: 80,
//         corner: 20,
//         color: "black",
//         borderWidth: 1,
//         borderColor: "black",
//         shadowBlur: 0
//       });
//       dropZone.alpha = 0.3;
//       //storing assigned id to dropZone
//       dropZone.id = dropZoneData.id;
//       dropZone.center().mov(dropZoneData.x - 980, dropZoneData.y - 540);
//       dropZones.push(dropZone); // Push each dropZone to the dropZones array
//     });
  
//     // Iterate over each answer pad
//     gr.answers.forEach((answer) => {
//       let ansPad = new Button({
//         width: 300,
//         height: 80,
//         corner: 20,
//         backgroundColor: "#FAF9F6",
//         rollBackgroundColor: "#EDEADE",
//         rollColor: "black",
//         label: answer.answer[lang],
//         color: "black",
//         shadowBlur: 20,
//         shadowColor: "pink",
//         borderWidth: 0,
//         borderColor: "black"
//       }).drag();
  
//       ansPad.label.size = 20;
//       ansPad.label.font = "Noto Sans Bengali UI";
//       ansPad.answered = false;
//       answerPads.push(ansPad); // Push each answer pad to the answerPads array
//       ansPad.on("click", () => {   //checking which answer pad is dropped on which drop zone
//         console.log("click");
//         dropZones.forEach((dropZoneData) => {
//           if (ansPad.hitTestRect(dropZoneData)) {
//             console.log("hit");
//             if (answer.id === dropZoneData.id) {
//               console.log(answer.id, dropZoneData.id);
//               ansPad.answered = true;
//               correctSound.play();                   //correct sound pause
//               console.log(dropZoneData.x, dropZoneData.y);
//               ansPad.animate({
//                 target: ansPad,
//                 props: { x: dropZoneData.x, y: dropZoneData.y },
//                 time: 0.5,
//                 ease: "quadIn",
//               });
  
//               ansPad.removeAllEventListeners(); //remove event listener after dropping the answer pad
  
//               let emitter = new Emitter({
//                 obj: new Circle(5, [green, orange, yellow, pink, blue, purple]),
//                 interval: 0.0001,
//                 life: 0.02,
//                 force: 3.5,
//                 gravity: 10.5,
//                 wind: 0.7,
//                 warm: true,
//                 width: 1,
//                 height: 1,
//                 poolMin: 100,
//                 sinkForce: 200
//               }).center().pos(dropZoneData.x + 150, dropZoneData.y + 20);
  
//               //after 1 sec remove emitter
//               setTimeout(() => {
//                 emitter.removeFrom(Frame.stage);
//               }, 1000);
//             } else {
//               console.log("wrong");
//               ansPad.animate({
//                 target: ansPad,
//                 props: { x: 100, y: 300 },
//                 time: 0.5,
//                 ease: "Bounce",
//               });
//               wrongSound.play();
//             }
//           }
//         });
//       });
//     });
//     const shuffledAnswerPads = pickRandom(answerPads, dropZones);
//   shuffledAnswerPads.forEach((answerPad, index) => {
//     answerPad.pos(100, 300);
//   });
//   }

//   function pickRandom(answerPads, dropZones) {
//     // Shuffle the answer pads array
//     return(answerPads.sort(() => Math.random() - 0.5));
    
//   }

function reStart() {
  const restartButton = new Button({label: "", width: 100, height: 100, backgroundColor: "lime", rollBackgroundColor: "limegreen", borderWidth: 0, gradient: 0.4, corner: 50})
    .center()
    .mov(870, 460);
    const pic = new Pic("assets/images/restart.png").sca(0.15).center(restartButton);
    pic.rotation = 60;
    restartButton.on("click", () => {
        location.reload();
    });
  
  }