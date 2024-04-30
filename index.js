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
  let dropZones = []; // array to store dropZones id

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

        let rect2 = new Rectangle(1920, 30, "#f88379");
        rect2.alpha = 0.8;
        rect2.center().mov(0, -425);

        let text2 = new Label({
          text: "বাম দিকের উত্তরগুলো ড্র্যাগ করে সঠিক জায়গায় বসাও➡️➡️➡️",
          size: 20,
          font: "Siyam Rupali",
          color: "white",
        });
        text2.center(rect2).pos(1400, 5);

        text2.animate({
          target: text2,
          props: { x: 0 },
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
            backgroundColor: "white",
            borderWidth: 2,
            borderColor: "black",
            shadowBlur: 30,
          });

          //storing assigned id to dropZone
          dropZone.id = dropZoneData.id;

          // let verticalGap = 50;
          // let yPos = -350 + index * (70 + verticalGap);

          dropZone.center().mov(dropZoneData.x, dropZoneData.y);

          // Push each dropZone to the dropZones array
          dropZones.push(dropZone);
        });

        // Iterate over each answer pad
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

          let verticalGap = 20 * data.padContainerVerticalPos;
          let yPos = answer.padPosY + verticalGap;
          ansPad.center().pos(100, yPos);

          //checking which answer pad is dropped on which drop zone
          ansPad.on("click", () => {
            dropZones.forEach((dropZoneData) => {
              if (ansPad.hitTestRect(dropZoneData)) {
                if (answer.id === dropZoneData.id) {
                  ansPad.animate({
                    target: ansPad,
                    props: { x: dropZoneData.x, y: dropZoneData.y },
                    time: 0.5,
                    ease: "quadIn",
                  });
                } else {
                  ansPad.animate({
                    target: ansPad,
                    props: { x: 100, y: yPos },
                    time: 0.5,
                    ease: "quadIn",
                  });
                }
              }
            });
          });
        });
      });
  };

  navbar();
  createHittestLogic();
  imageRenderer();

}
