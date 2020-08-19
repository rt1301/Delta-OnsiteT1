var canvas = document.getElementById('paintArea');
var ctx    = canvas.getContext('2d');
canvas.height = window.innerHeight - 100;
canvas.width  = window.innerWidth/2;
var colorWheel = document.getElementById('color');
var range       =  document.getElementById('size');
// Tools
var line = document.getElementById('line');
var rectangle = document.getElementById('rectangle');
var circle  = document.getElementById('circle');
var eraser  = document.getElementById('eraser');
var tools = document.querySelectorAll(".tool");
var size = 3;
var badge = document.querySelector("span.badge");
var drawCircle=false,drawRectangle=false,drawLine= true,erase = false;
var up = true;
var objects = [];
var lastWidth = 0;
var lastHeight = 0;
var rectWidth = 0;
var rectHeight = 0;
var empty = document.getElementById("empty");
var distance;
var coor1 = {
    x: undefined,
    y:undefined
}
var coor2 = {
    x: undefined,
    y:undefined
}
var mouse  = {
    x: undefined,
    y:undefined
}
var color = '#000';
ctx.lineWidth = size;
colorWheel.addEventListener('input',(event)=>{
    color = event.target.value;
    ctx.strokeStyle = color;
},false);
range.addEventListener('input',(event)=>{
    size = event.target.value;
    badge.innerText =  event.target.value;
    ctx.lineWidth = size;
});
ctx.lineCap = 'round';
window.addEventListener('resize',()=>{
    canvas.width = window.innerWidth/2;
    canvas.height = window.innerHeight-100;
    ctx.lineWidth = size;
});

// canvas.addEventListener('click',(e)=>{
//     setPosition(e);
// });
canvas.addEventListener('mousedown',(e)=>{
    setPosition(e);
    up = false;
    coor1.x = mouse.x;
    coor1.y = mouse.y;
    lastHeight = 0;
    lastWidth = 0;
    ctx.beginPath();
    ctx.moveTo(mouse.x, mouse.y);
});
canvas.addEventListener('mousemove',(e)=>{
    setPosition(e);
    if(!up)
    {
        if(drawLine)
        {
            ctx.strokeStyle = color;
            ctx.lineTo(mouse.x,mouse.y);
            ctx.stroke();
        }
        else if(drawCircle)
        {
            ctx.strokeStyle = color;
            coor2.x = mouse.x;
            coor2.y = mouse.y;
            drawEllipse(coor1.x,coor1.y,Math.abs((coor2.x-coor1.x)/2),Math.abs((coor2.y-coor1.y)/2));
            ctx.closePath();
            ctx.stroke();
        }
        else if(drawRectangle)
        {
            ctx.strokeStyle = color;
            coor2.x = mouse.x;
            coor2.y = mouse.y;
            rectWidth = Math.abs(coor2.y - coor1.y);
            rectHeight = Math.abs(coor2.x - coor1.x);
            ctx.clearRect(coor1.x-5, coor1.y-5, lastWidth + 10, lastHeight + 10);
            ctx.beginPath();
            ctx.rect(coor1.x,coor1.y,rectWidth,rectHeight);
            lastWidth = rectWidth;
            lastHeight = rectHeight;
            ctx.stroke();
            ctx.closePath();
        }
        else if(erase)
        {
            ctx.strokeStyle = '#fff';
            ctx.lineTo(mouse.x,mouse.y);
            ctx.stroke();
        }
    }

});
canvas.addEventListener('mouseup',(e)=>{
    setPosition(e);
    up = true;
});
// Set Position
function setPosition(e)
{
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
}
function getDistance(x1,y1,x2,y2)
{
    return Math.sqrt(Math.pow((x1-x2),2) + Math.pow((y1-y2),2));
}

// Tool Button event listeners
circle.addEventListener('click',()=>{
    drawCircle = true;
    drawLine = false;
    drawRectangle = false;
    erase = false;
    for (let i = 0; i < tools.length; i++) {
      tools[i].classList.remove('active');
    }
    circle.classList.add('active');
});
rectangle.addEventListener('click',()=>{
    drawCircle = false;
    drawLine = false;
    drawRectangle = true;
    erase = false;
    for (let i = 0; i < tools.length; i++) {
      tools[i].classList.remove('active');
    }
    rectangle.classList.add('active');
});
line.addEventListener('click',()=>{
    drawCircle = false;
    drawLine = true;
    drawRectangle = false;
    erase = false;
    for (let i = 0; i < tools.length; i++) {
      tools[i].classList.remove('active');
    }
    line.classList.add('active');
});
eraser.addEventListener('click',()=>{
    drawCircle = false;
    drawLine = false;
    drawRectangle = false;
    erase = true;
    for (let i = 0; i < tools.length; i++) {
      tools[i].classList.remove('active');
    }
    eraser.classList.add('active');
});
empty.addEventListener('click',()=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
})
function drawEllipse(x,y,width,height)
{
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var PI2=Math.PI*2;
    var ratio=height/width;
    var radius=Math.max(width,height)/2;
    var increment = 1 / radius;
    var cx=x+width/2;
    var cy=y+height/2;
    
    ctx.beginPath();
    var x1 = cx + radius * Math.cos(0);
    var y1 = cy - ratio * radius * Math.sin(0);
    ctx.lineTo(x1,y1);

    for(var radians=increment; radians<PI2; radians+=increment){ 
        var x2 = cx + radius * Math.cos(radians);
        var y2 = cy - ratio * radius * Math.sin(radians);
        ctx.lineTo(x2,y2);
     }
    
}

// Save Canvas Image Locally
var link = document.getElementById('link');
link.addEventListener('click',()=>{
    link.setAttribute('download','painting.png');
    link.setAttribute('href',canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
})
