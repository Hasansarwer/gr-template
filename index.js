

const { Frame, Circle, Button, Label, Rectangle, GlowEffect, Pic } = zim;

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
  //add a bg image 1920x1080
  let correctSound = new Audio("assets/sounds/correctSound.mp3");
  let wrongSound = new Audio("assets/sounds/wrongSound.mp3");
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      const lang = data.lang;
      document.title = data.title[lang];
      setUpStage(data, lang);
      createHittest(data.grs[0], lang);
      reStart();
    });
}

  function setUpStage(data, lang) {
    let rect = new Rectangle(1920, 80, "black");
    rect.alpha = 0.5;
    rect.center().mov(25, -470);
    let text = new Label({
      text: `${data.title[lang]}`,
      size: 50,
      color: "white",
    });
    text.center(rect);
    let rect2 = new Rectangle(1920, 30, "#f88379");
    rect2.alpha = 0.8;
    rect2.center().mov(25, -425);

    let text2 = new Label({
    text: "বাম দিকের উত্তরগুলো ড্র্যাগ করে সঠিক জায়গায় বসাও➡️➡️➡️",
    size: 20,
    font: "Siyam Rupali",
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

  function createHittest(gr, lang) {
    const image = new Pic(`${gr.bg.src}`).center();
    const dropZones = []; // array to store dropZones objects
    const answerPads = []; // array to store answerPads objects
    gr.answers.forEach((dropZoneData, index) => {
      // Create a drop zone rectangle with an id property
      let dropZone = new Rectangle({width: 300, height: 70, corner: 20, color: "black", borderWidth: 1, borderColor: "black", shadowBlur: 0});
      dropZone.alpha =0.3;
      dropZone.sca(`${dropZoneData.scale}`);
      //storing assigned id to dropZone
      dropZone.id = dropZoneData.id;
        
      dropZone.center().mov(dropZoneData.x, dropZoneData.y);
      dropZones.push(dropZone); // Push each dropZone to the dropZones array
    });
    // Iterate over each answer pad
    gr.answers.forEach((answer) => {
      let ansPad = new Button({ width: 300, height: 70, corner: 20, backgroundColor: "#FAF9F6", rollBackgroundColor: "#EDEADE", rollColor: "black",	
      label: answer.answer[lang], color: "black", shadowBlur: 20, shadowColor: "pink", borderWidth: 0, borderColor: "black"}).drag();

      ansPad.label.size = 20;
      ansPad.label.font = "Siyam Rupali";
          
      ansPad.center().pos(100, 300);
      // ansPad.isVisible = true;
      answerPads.push(ansPad); // Push each answer pad to the answerPads array
      ansPad.on("click", () => {   //checking which answer pad is dropped on which drop zone
            dropZones.forEach((dropZoneData) => {
              if (ansPad.hitTestRect(dropZoneData)) {
                if (answer.id === dropZoneData.id) {
                    correctSound.play();                   //correct sound pause
                  ansPad.animate({
                    target: ansPad,
                    props: { x: dropZoneData.x, y: dropZoneData.y},
                    time: 0.5,
                    ease: "quadIn",
                  });
                  
                  ansPad.removeAllEventListeners(); //remove event listener after dropping the answer pad
                  //check if the ansPad is its initial position
                  //ansPad scaling animation
                  ansPad.animate({target: ansPad, props: { scale: dropZoneData.scale/1.01}, time: 0.5, ease: "quadIn",
                  });

                  let emitter = new Emitter({ obj:new Circle(5, [green,orange,yellow,pink,blue,purple]), interval:0.0001, life:0.02, force:3.5, gravity:10.5, wind:0.7, warm:true, width:1, height:1, poolMin:100, sinkForce:200}).center().pos(dropZoneData.x+150, dropZoneData.y+20);
                
                //after 1 sec remove emitter
                setTimeout(() => {
                    emitter.removeFrom(Frame.stage); 
                }, 1000);
                }else {
                  ansPad.animate({
                    target: ansPad,
                    props: { x: 100, y: yPos },
                    time: 0.5,
                    ease: "Bounce",
                  });
                    wrongSound.play(); 
                }
              }
            });
          });
        });

  }

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