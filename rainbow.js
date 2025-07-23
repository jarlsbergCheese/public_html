let angle = 0

function onframe(){

angle += 0.5
console.log(angle)
document.body.style = "background-color:hsl(" + angle + "deg, 100%, 50%); --rotation:" + (angle+180) + "deg;"
// document.caleb.style = "color:hsl(" + angle + "deg, 100%, 50%)"

requestAnimationFrame(onframe)

}
onframe()