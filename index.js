import zim from "https://zimjs.org/cdn/016/zim";

const { Frame, Circle, Button, Label, Rectangle, GlowEffect, Pic } = zim;

new Frame(FIT, 1920, 1080, "#d1d5e6", "#333", ready, "assets/", new zim.Waiter());

function ready() {
   //fetch the data from the data.json
    fetch("data.json")
    .then(response => response.json())
    .then(data => {
        let rect = new Rectangle(1920, 100, "black");
    rect.alpha = 0.5;
    rect.center().mov(0,-490);

    //add a text on the rect
    let text = new Label({
        text:`${data.titleBN}`,
        size: 50,
        color: "white"
    });
    text.center(rect);
        });

   //draggable rectangle answerSets 
   
   
    
    
   
    
}