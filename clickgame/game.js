let lawn_container = document.getElementById("lawn-container");
let baby_gompei_container = document.getElementById("baby-gompei-container");
let gompei_container = document.getElementById("gompei-container");
let super_gompei_container = document.getElementById("super-gompei-container");
let ultra_gompei_container = document.getElementById("ultra-gompei-container");
let brick_container = document.getElementById("brick-container");

let score_element = document.getElementById("score");
let stores = document.getElementsByClassName("store");

function getRandomInteger(min, max) {
    min = Math.ceil(min); // Ensure min is rounded up to the nearest whole number
    max = Math.floor(max); // Ensure max is rounded down to the nearest whole number
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

// ITEM HAVERS

let playerItems = [document.getElementById("lawn-mower").getAttribute("bought")]




let score = 5;
let super_gompei_count = 0;
let ultra_gompei_count = 0;

function changeScore(amount) {
    score += amount;
    score_element.innerHTML = "Score: " + score;

    for (let store of stores) {
        let cost = parseInt(store.getAttribute("cost"));

        if (score < cost) {
            store.setAttribute("broke", "")
        } else {
            store.removeAttribute("broke");
        }
    }

}

function buy(store) {
    let cost = parseInt(store.getAttribute("cost"));

    if (cost > score) {
        return;
    }
    changeScore(-cost);

    let super_gompei = document.querySelector("#super-gompei-container #super-gompei")?.parentElement
    if (store.getAttribute("name") == "Super-Gompei" && super_gompei != null) {
        let old_yield = parseInt(super_gompei.getAttribute("reap"));
        super_gompei.setAttribute("reap", old_yield + 100)
        super_gompei_count += 1
        document.body.style = "--gompei-count:" + super_gompei_count
        return;
    }

    let ultra_gompei = document.querySelector("#ultra-gompei-container #ultra-gompei")?.parentElement
    if (store.getAttribute("name") == "Ultra-Gompei" && ultra_gompei != null) {
        let old_yield = parseInt(ultra_gompei.getAttribute("reap"));
        ultra_gompei.setAttribute("reap", old_yield + 50)
        ultra_gompei_count += 1
        document.body.style = "--gompei-count:" + ultra_gompei_count
        return;
    }

    let new_widget = store.firstElementChild.cloneNode(true);

    new_widget.onclick = () => {
        harvest(new_widget);
    }
    // Bricks
    if (store.getAttribute("name") == "Brick Road") {
        brick_container.appendChild(new_widget)
    }
    // Lawn
    if (store.getAttribute("name") == "Lawn") {
        lawn_container.appendChild(new_widget)
    }
    if (store.getAttribute("name") == "Baby-Gompei") {
        baby_gompei_container.appendChild(new_widget)
    }
    // Gompei
    if (store.getAttribute("name") == "Gompei") {
        gompei_container.appendChild(new_widget)
    }
    // Super
    if (store.getAttribute("name") == "Super-Gompei") {
        super_gompei_container.appendChild(new_widget)
    }
    // Ultra
    if (store.getAttribute("name") == "Ultra-Gompei") {
        ultra_gompei_container.appendChild(new_widget)
        // Initialize a click counter for the rainbow effect
        new_widget.setAttribute("data-clicks", "0");
    }


    if (new_widget.getAttribute("auto") == "true") {
        new_widget.setAttribute("harvesting", "")
        setup_end_harvest(new_widget)
    }

}

function setup_end_harvest(widget) {
    setTimeout(() => {
        widget.removeAttribute("harvesting")
        if (widget.getAttribute("auto") == "true") {
            harvest(widget)
        }

    }, parseFloat(widget.getAttribute("cooldown")) * 1000)
}

function harvest(widget) {
    if (widget.hasAttribute("harvesting")) {
        return;
    }

    // If the clicked item is an Ultra Gompei, update its rainbow effect
    if (widget.querySelector("#ultra-gompei")) {
        let clicks = parseInt(widget.getAttribute("data-clicks") || "0");
        clicks++;
        widget.setAttribute("data-clicks", clicks);

        // This sets a CSS variable `--rainbow-intensity` on the element.
        // The intensity will increase with each click, capping at 1 (fully visible) after 50 clicks.
        // You can adjust the '50' to change how many clicks are needed.
        const intensity = Math.min(clicks / 50, 1);
        widget.style.setProperty('--rainbow-intensity', intensity);
    }

    //Lawnmower Effect
    if (playerItems[0] == true && widget.getAttribute("name") == "Lawn") {
        harvest(lawn_container.children[getRandomInteger(0, lawn_container.children.length - 1)])
    }

    widget.setAttribute("harvesting", "");

    changeScore(parseInt(widget.getAttribute("reap")))
    givePoints(widget)

    setup_end_harvest(widget);

}

function givePoints(widget) {
    let points_element = document.createElement("span")
    points_element.className = "point";
    points_element.innerHTML = "+" + widget.getAttribute("reap")
    points_element.onanimationend = () => {
        points_element.remove();
    }
    widget.appendChild(points_element);

}

function hideHolder(id) {
    let held = document.getElementById(id)
    console.log(held.style.display)
    if (held.style.display != "none") {
        held.style.display = "none";
    }
    else {
        held.style.display = "";
    }
}

function organizeItems() {

}

function buyItem(item) {

    let buying = document.getElementById(item);

    if (buying.getAttribute('cost') < score) {
        buying.setAttribute('bought', "true")
        changeScore(-parseInt(buying.getAttribute('cost')));
        playerItems = [document.getElementById("lawn-mower").getAttribute("bought")]    
    }

}

console.log(playerItems[0])

changeScore(0);
