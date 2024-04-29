import zim from "https://zimjs.org/cdn/016/zim";

const { Frame, Circle, Button, Label, Rectangle, GlowEffect, Pic } = zim;

new Frame(
  FIT,
  1920,
  1080,
  "#d1d5e6",
  "#333",
  ready,
  "assets/",
  new zim.Waiter()
);

function ready() {
    let answerPads = []; // Array to store answer pads
    let dropZones = []; // Array to store drop zones

    let navbar = () => {
        fetch("data.json")
            .then((response) => response.json())
            .then((data) => {
                let rect = new Rectangle(1920, 100, "black");
                rect.alpha = 0.5;
                rect.center().mov(0, -490);

                let text = new Label({
                    text: `${data.titleBN}`,
                    size: 50,
                    color: "white",
                });
                text.center(rect);

                let rect2 = new Rectangle(1920, 30, "white");
                rect2.alpha = 0.8;
                rect2.center().mov(0, -425);
            });
    };


    let createDropZone = () => {
        fetch("data.json")
            .then((response) => response.json())
            .then((data) => {
                data.dropZone.forEach((dropZoneData, index) => {
                    let dropZone = new Rectangle({
                        width: 300,
                        height: 70,
                        corner: 20,
                        backgroundColor: "white",
                        borderWidth: 2,
                        borderColor: "black",
                        shadowBlur: 30,
                    });

                    let verticalGap = 50;
                    let yPos = -350 + index * (70 + verticalGap);

                    dropZone.center().mov(600, yPos);

                    // Push drop zone to the array

                    dropZones.push(dropZone);
                });
            });
    };


    let createAnswerPad = () => {
        fetch("data.json")
            .then((response) => response.json())
            .then((data) => {
                data.answerSet.forEach((answer, index) => {
                    let ansPad = new Button({
                        width: 300,
                        height: 70,
                        corner: 20,
                        backgroundColor: answer.padColor,
                        rollBackgroundColor: answer.padHoverColor,
                        rollColor: answer.padHoverTextColor,
                        label: answer.innerContentBN,
                        color: answer.padTextColor,
                        shadowBlur: 30,
                        shadowColor: answer.padShadowColor,
                        borderWidth: answer.padBorderWidth,
                        borderColor: answer.padBorderColor,
                    }).drag();
    
                    ansPad.label.size = 20;
    
                    let verticalGap = 20 * data.padGap;
                    let yPos = -350 + index * (70 + verticalGap);
    
                    ansPad.center().mov(-600, yPos);
    
                    // Push answer pad to the array
                    answerPads.push(ansPad);
    
                    // Add click event listener to each answer pad
                });
            });
    };
    


    

    navbar();
    createDropZone();
    createAnswerPad();

  
    // checkAnswer();
}

