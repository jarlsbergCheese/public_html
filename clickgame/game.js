let lawn_container = document.getElementById("lawn-container");
let baby_gompei_container = document.getElementById("baby-gompei-container");
let gompei_container = document.getElementById("gompei-container");
let super_gompei_container = document.getElementById("super-gompei-container");
let ultra_gompei_container = document.getElementById("ultra-gompei-container");
let brick_container = document.getElementById("brick-container");

let store_container = document.getElementById("store-container");

let yourItems = document.getElementById("user-items");
let storeItems = document.getElementById("store-items");

let score_element = document.getElementById("score");
let stores = document.getElementsByClassName("store");

function getRandomInteger(min, max) {
    min = Math.ceil(min); // Ensure min is rounded up to the nearest whole number
    max = Math.floor(max); // Ensure max is rounded down to the nearest whole number
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ITEM HAVERS

let playerItems = [];
let itemList = [document.getElementById("lawn-mower"), document.getElementById("gompei-day-care"), document.getElementById("mega-mower"), document.getElementById("adoption-papers"), document.getElementById("brick-mowers")];



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

function updateCosts() {
    let lawn = document.getElementById('lawn');
    lawn.setAttribute("cost", lawn.getAttribute("base-cost") ** (1 + ((lawn_container.children.length) * 0.10)));
    document.getElementById("lawn-pricetag").innerHTML = Math.floor(lawn.getAttribute("cost")) + " points"

    let baby_gompei = document.getElementById('baby-gompei');
    baby_gompei.setAttribute("cost", baby_gompei.getAttribute("base-cost") ** (1 + ((baby_gompei_container.children.length) * 0.10)));
    document.getElementById("baby-gompei-pricetag").innerHTML = Math.floor(baby_gompei.getAttribute("cost")) + " points"

    let gompei = document.getElementById('gompei');
    gompei.setAttribute("cost", gompei.getAttribute("base-cost") ** (1 + ((gompei_container.children.length) * 0.10)));
    document.getElementById("gompei-pricetag").innerHTML = Math.floor(gompei.getAttribute("cost")) + " points"

    let brick_road = document.getElementById('brick-road');
    brick_road.setAttribute("cost", brick_road.getAttribute("base-cost") ** (1 + ((brick_container.children.length) * 0.10)));
    document.getElementById("brick-road-pricetag").innerHTML = Math.floor(brick_road.getAttribute("cost")) + " points"

    let super_gompei_price = document.getElementById('super-gompei-id');
    super_gompei_price.setAttribute("cost", super_gompei_price.getAttribute("base-cost") ** (1 + ((super_gompei_container.children.length) * 0.10)));
    document.getElementById("super-gompei-pricetag").innerHTML = Math.floor(super_gompei_price.getAttribute("cost")) + " points"

    let ultra_gompei_price = document.getElementById('ultra-gompei-id');
    ultra_gompei_price.setAttribute("cost", ultra_gompei_price.getAttribute("base-cost") ** (1 + ((ultra_gompei_container.children.length) * 0.10)));
    document.getElementById("ultra-gompei-pricetag").innerHTML = Math.floor(ultra_gompei_price.getAttribute("cost")) + " points"
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

    // gompei daycare
    if (playerItems[1] == "true" && getRandomInteger(1, 10) == 10 && new_widget.getAttribute("name") == "Baby-Gompei") {
        new_widget = document.getElementById("gompei").firstElementChild.cloneNode(true);
    }

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
    if (store.getAttribute("name") == "Baby-Gompei" && new_widget.getAttribute("name") != "Gompei") {
        baby_gompei_container.appendChild(new_widget)
    }
    else if (store.getAttribute("name") == "Baby-Gompei" && playerItems[1] == "true" && new_widget.getAttribute("name") == "Gompei") {
        gompei_container.appendChild(new_widget)
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

    if (new_widget.getAttribute("name") == "baby_gompei") {
        gompei.getAttribute("reap") = gompei.getAttribute("base-reap") * Math.floor(1 + (baby_gompei_container.children.length * 0.10));
    }

    updateReap()
    updateCosts()

}

function setup_end_harvest(widget) {
    setTimeout(() => {
        widget.removeAttribute("harvesting")
        if (widget.getAttribute("auto") == "true") {
            harvest(widget)
        }

    }, parseFloat(widget.getAttribute("cooldown")) * 1000)
}

function harvest(widget, event = false) {
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
    // console.log(widget.getAttribute("name") )
    // console.log(lawn_container.children[getRandomInteger(0, lawn_container.children.length - 1)])

    console.log(widget.getAttribute("name"))
    console.log(playerItems[0])


    // mower effects
    if (playerItems[0] == "true" && widget.getAttribute("name") == "Lawn" && !event && getRandomInteger(1, 2) == 2 && playerItems[2] != "true") {
        console.log("Lawnmower effect triggered")
        harvest(lawn_container.children[getRandomInteger(0, lawn_container.children.length - 1)], true)
    }
    else if (playerItems[2] == "true" && widget.getAttribute("name") == "Lawn" && !event) {
        harvest(lawn_container.children[getRandomInteger(0, lawn_container.children.length - 1)], true)
        if (getRandomInteger(1, 2) == 2) {
            harvest(lawn_container.children[getRandomInteger(0, lawn_container.children.length - 1)], true)
        }
    }
    // Brick Mower
    if (playerItems[4] == "true" && widget.getAttribute("name") == "Brick Road" && !event) {
        harvest(lawn_container.children[getRandomInteger(0, lawn_container.children.length - 1)], false)
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
    // console.log(held.style.display)
    if (held.style.display != "none") {
        held.style.display = "none";
    }
    else {
        held.style.display = "";
    }
}

function setItemsUp() {
    playerItems = [document.getElementById("lawn-mower").getAttribute("bought"), document.getElementById("gompei-day-care").getAttribute("bought"), document.getElementById("mega-mower").getAttribute("bought"), document.getElementById("adoption-papers").getAttribute("bought"), document.getElementById("brick-mowers").getAttribute("bought")]
}

function organizeItems() {

    yourItems.innerHTML = "";

    for (let i = 0; i < playerItems.length; i++) {
        if (playerItems[i] == "true") {
            let newSpot = document.createElement("div");
            newSpot.className = "item";
            newSpot.innerHTML += itemList[i].innerHTML;
            yourItems.appendChild(newSpot);

            storeItems.children[i].style.display = "none"
        }
    }

}

function buyItem(item) {

    let buying = document.getElementById(item);

    if (item.getAttribute('cost') <= score && item.getAttribute('bought') != "true" && !item.hasAttribute('pre-req')) {
        item.setAttribute('bought', true)
        changeScore(-parseInt(item.getAttribute('cost')));
        setItemsUp();

    } else if (item.getAttribute('cost') <= score && item.getAttribute('bought') != "true" && document.getElementById(item.getAttribute('pre-req')).getAttribute('bought') == "true") {
        item.setAttribute('bought', true)
        changeScore(-parseInt(item.getAttribute('cost')));
        setItemsUp();
    }
    organizeItems();
}

function updateReap() {

    for (let i = 0; i < store_container.children.length; i++) {
        for(let t=0; t<store_container.children[i].children.length; t++) {
            if (store_container.children[i].children[t].classList.contains("reapTag")){
                store_container.children[i].children[t].innerHTML
            }
        }
    }
}


setItemsUp()
changeScore(0);
