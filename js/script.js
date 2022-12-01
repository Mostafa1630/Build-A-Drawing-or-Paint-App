const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
SizeSilder = document.querySelector("#Size-Silder"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPinker = document.querySelector("#color-picker"),
clearCanves = document.querySelector(".clear-canvas"),
saveImage = document.querySelector(".save-img"),

ctx = canvas.getContext("2d");


//golbal varables with default value
let prevMouseX , prevMouseY, snapShot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000";


const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = selectedColor;
};
//setting width and height
window.addEventListener("load" , () =>{
    canvas.width=canvas.offsetWidth;
    canvas.height=canvas.offsetHeight;
    setCanvasBackground();
})

// To Draw RECT FILL AND NOT
const drawRect = (e) => {
    if(!fillColor.checked){
        return ctx.strokeRect(e.offsetX , e.offsetY , prevMouseX - e.offsetX , prevMouseY - e.offsetY);
    }else{
        ctx.fillRect(e.offsetX , e.offsetY , prevMouseX - e.offsetX , prevMouseY - e.offsetY);
    }
    
}


// To Draw Circle FILL AND NOT
const drawCircle = (e) => {
    ctx.beginPath();
    let redius = Math.sqrt(Math.pow((prevMouseX - e.offsetX) ,2) + Math.pow((prevMouseY - e.offsetY) , 2));
    ctx.arc(prevMouseX , prevMouseY , redius , 0 , 2*Math.PI);
    fillColor.checked ? ctx.fill() :ctx.stroke();
}


// To Draw Triangle FILL AND NOT
const drawTriangle = (e) =>{
    ctx.beginPath();
    ctx.moveTo(prevMouseX , prevMouseY);
    ctx.lineTo(e.offsetX , e.offsetY);
    ctx.lineTo(prevMouseX*2 - e.offsetX , e.offsetY);
    ctx.closePath();
    fillColor.checked ? ctx.fill() :ctx.stroke();
}

const startDraw = (e) =>{
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();//creating new path in draw
    ctx.lineWidth = brushWidth;//passing brushWidth as a line width
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapShot = ctx.getImageData(0 , 0 , canvas.width , canvas.height);
}


//Choosing what to use
const drawing = (e) => {
    if(!isDrawing)return;// if isDrawing false return from here

    ctx.putImageData(snapShot,0,0);
    if(selectedTool === "brush" || selectedTool === "eraser"){
        ctx.strokeStyle = selectedTool === "eraser"? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX , e.offsetY);//creationg line according to the mouse pointer
        ctx.stroke();//drawing filing line with color
    }else if(selectedTool === "rectangle"){
        drawRect(e);
    }else if(selectedTool === "circle"){
        drawCircle(e);
    }else{
        drawTriangle(e);
    }
    
}

toolBtns.forEach(btn => {
    btn.addEventListener("click" , () => {
        //adding click event to tool
        //adding and remove class for options
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
}); 



SizeSilder.addEventListener("change" , () =>  brushWidth = SizeSilder.value);

colorBtns.forEach(btn => {
    btn.addEventListener("click" , () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

saveImage.addEventListener("click" , () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href =canvas.toDataURL();
    link.click();
});

clearCanves.addEventListener("click" , () => {
    ctx.clearRect( 0 , 0 , canvas.width , canvas.height);
    setCanvasBackground();
});

colorPinker.addEventListener("change" , () => {
    colorPinker.parentElement.style.background = colorPinker.value;
    colorPinker.parentElement.click();
});
canvas.addEventListener("mousedown" , startDraw);
canvas.addEventListener("mousemove" , drawing);
canvas.addEventListener("mouseup", () => {isDrawing = false;});