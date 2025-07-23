let angle = 180
let motion = false

function onframe(){

if (motion == false)
{
    angle += 0.2
}
else
{
    angle -= 0.2
}

if (angle >= 200)
    motion = true
if (angle <= 160)
    motion = false

console.log(angle)
document.body.style = "background-color:hsl(" + angle + "deg, 100%, 70%); --rotation:" + (angle+180) + "deg;"
// document.caleb.style = "color:hsl(" + angle + "deg, 100%, 50%)"

requestAnimationFrame(onframe)

}
onframe()