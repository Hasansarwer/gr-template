import zim from "/zim.js";

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
  const bg = new Pic("assets/images/bg.png").center();
  let dropZones = []; // array to store dropZones id

  let correctSound = new Audio("assets/sounds/correctSound.mp3");
  let wrongSound = new Audio("assets/sounds/wrongSound.mp3");

  let navbar = () => {
    fetch("data.json")
      .then((response) => response.json())
      .then((data) => {
        let rect = new Rectangle(1920, 80, "black");
        rect.alpha = 0.5;
        rect.center().mov(25, -470);

        let text = new Label({
          text: `${data.titleBN}`,
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
      });
  };

  let imageRenderer = () => {
    fetch("data.json")
      .then((response) => response.json())
      .then((data) => {
        const image = new Pic(`${data.graphic.src}`)
          .center()
          .pos(`${data.graphic.graphicPosX}`, `${data.graphic.graphicPosY}`);
        image.sca(`${data.graphic.scale}`);
      });
  };

  let createHittestLogic = () => {
    fetch("data.json")
      .then((response) => response.json())
      .then((data) => {
        data.dropZone.forEach((dropZoneData, index) => {
          // Create a drop zone rectangle with an id property
          let dropZone = new Rectangle({
            width: 300,
            height: 70,
            corner: 20,
            color: "black",
            borderWidth: 1,
            borderColor: "black",
            shadowBlur: 0,
          });

          dropZone.alpha = 0.3;
          
          dropZone.sca(`${dropZoneData.scale}`);

          //storing assigned id to dropZone
          dropZone.id = dropZoneData.id;

        
          // let verticalGap = 50;
          // let yPos = -350 + index * (70 + verticalGap);

          dropZone.center().mov(dropZoneData.x, dropZoneData.y);

          // Push each dropZone to the dropZones array
          dropZones.push(dropZone);
        });

        // Iterate over each answer pad
        data.answerSet.forEach((answer) => {
          let ansPad = new Button({
            width: 300,
            height: 70,
            corner: 20,
            backgroundColor: answer.padColor,
            rollBackgroundColor: answer.padHoverColor,
            rollColor: answer.padHoverTextColor,
            label: answer.innerContentBN,
            color: answer.padTextColor,
            shadowBlur: 20,
            shadowColor: answer.padShadowColor,
            borderWidth: answer.padBorderWidth,
            borderColor: answer.padBorderColor,
          }).drag();

          ansPad.label.size = 20;
          ansPad.label.font = "Siyam Rupali";
          
          

          let verticalGap = 20 * data.padContainerVerticalPos;
          let yPos = answer.padPosY + verticalGap;
          ansPad.center().pos(100, yPos);

          //checking which answer pad is dropped on which drop zone
          ansPad.on("click", () => {
            dropZones.forEach((dropZoneData) => {
              if (ansPad.hitTestRect(dropZoneData)) {
                if (answer.id === dropZoneData.id) {
   
                    correctSound.play();
                    //correct sound pause
                  
                  ansPad.animate({
                    target: ansPad,
                    props: { x: dropZoneData.x, y: dropZoneData.y},
                    time: 0.5,
                    ease: "quadIn",
                  });
                  
                  //remove event listener after dropping the answer pad
                  //check if the ansPad is its initial position

                
                    ansPad.removeAllEventListeners();
                  
                  //ansPad scaling animation
                  ansPad.animate({
                    target: ansPad,
                    props: { scale: dropZoneData.scale/1.01},
                    time: 0.5,
                    ease: "quadIn",
                  });

                  let emitter = new Emitter({
                    obj:new Circle(5, [green,orange,yellow,pink,blue,purple]),
                    interval:0.0001,
                    life:0.02,
                    force:3.5,
                    gravity:10.5,
                    wind:0.7,
                    warm:true,
                    width:1,
                    height:1,
                    poolMin:100,
                    sinkForce:200,
                }).center().pos(dropZoneData.x+150, dropZoneData.y+20);
                
                //after 1 sec remove emitter
                setTimeout(() => {
                    emitter.removeFrom(Frame.stage);
                    
                }, 1000);
                } else {
                
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
      });

  }

function restartLogic() {

  const restartButton = new Button({
    label: "",
    width: 100,
    height: 100,
    backgroundColor: "lime",
    rollBackgroundColor: "limegreen",
    borderWidth: 0,
    gradient: 0.4,
    corner: 50,
  })
    .center()
    .mov(870, 460);

    

    const pic = new Pic("assets/images/restart.png").sca(0.15).center(restartButton);
    pic.rotation = 60;

    restartButton.on("click", () => {
        location.reload();
    });
  
  }

  navbar();
  imageRenderer();
  createHittestLogic();
  restartLogic();

  

}
