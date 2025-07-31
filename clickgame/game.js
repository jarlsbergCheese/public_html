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

// minnimum wage item tracker
let gompeiWage = false

// ITEM HAVERS:
// keeps track of the items the player has purchased, and the items available within the game
let playerItems = [];
let itemList = [document.getElementById("lawn-mower"), document.getElementById("gompei-day-care"), document.getElementById("real-estate-agent"), document.getElementById("adoption-papers"), document.getElementById("brick-mowers"), document.getElementById("mega-mower"), document.getElementById("minnimum-wage"), document.getElementById("high-school-diplomas")];

// Initialize the score and Gompei counts
let score = 5;
let super_gompei_count = 0;
let ultra_gompei_count = 0;

// Whenever points are added or removed, this function updates all the necesary fields
function changeScore(amount) {
    score += amount;
    score_element.innerHTML = "Square Feet: " + score;

    for (let store of stores) {
        let cost = parseInt(store.getAttribute("cost"));

        if (score < cost) {
            store.setAttribute("broke", "")
        } else {
            store.removeAttribute("broke");
        }
    }

}

// This function updates the costs of all the widgets in the game, based on how many of each widget the player has purchased

function updateCosts() {
    let lawn = document.getElementById('lawn');
    lawn.setAttribute("cost", lawn.getAttribute("base-cost") ** (1 + ((lawn_container.children.length) * 0.10)));
    document.getElementById("lawn-pricetag").innerHTML = Math.floor(lawn.getAttribute("cost")) + " sqrft"

    let baby_gompei = document.getElementById('baby-gompei');
    baby_gompei.setAttribute("cost", baby_gompei.getAttribute("base-cost") ** (1 + ((baby_gompei_container.children.length) * 0.10)));
    document.getElementById("baby-gompei-pricetag").innerHTML = Math.floor(baby_gompei.getAttribute("cost")) + " sqrft"

    // Minnimum Wage Item effects the cost of Gompei
    let gompei = document.getElementById('gompei');
    if (!gompeiWage) {
        gompei.setAttribute("cost", gompei.getAttribute("base-cost") ** (1 + ((gompei_container.children.length) * 0.10)));
        document.getElementById("gompei-pricetag").innerHTML = Math.floor(gompei.getAttribute("cost")) + " sqrft"
    } else {
        gompei.setAttribute("cost", (gompei.getAttribute("base-cost") ** (1 + ((gompei_container.children.length) * 0.10))) / 2);
        document.getElementById("gompei-pricetag").innerHTML = Math.floor(gompei.getAttribute("cost")) + " sqrft <br> (Minnimum Wage)"
    }

    let brick_road = document.getElementById('brick-road');
    brick_road.setAttribute("cost", brick_road.getAttribute("base-cost") ** (1 + ((brick_container.children.length) * 0.10)));
    document.getElementById("brick-road-pricetag").innerHTML = Math.floor(brick_road.getAttribute("cost")) + " sqrft"

    let super_gompei_price = document.getElementById('super-gompei-id');
    super_gompei_price.setAttribute("cost", super_gompei_price.getAttribute("base-cost") ** (1 + ((super_gompei_count) * 0.10)));
    document.getElementById("super-gompei-pricetag").innerHTML = Math.floor(super_gompei_price.getAttribute("cost")) + " sqrft"

    let ultra_gompei_price = document.getElementById('ultra-gompei-id');
    ultra_gompei_price.setAttribute("cost", ultra_gompei_price.getAttribute("base-cost") ** (1 + ((ultra_gompei_container.children.length) * 0.10)));
    document.getElementById("ultra-gompei-pricetag").innerHTML = Math.floor(ultra_gompei_price.getAttribute("cost")) + " sqrft"
}

// This function is called in the onclick() function for each of the widgets, allowing them to be purchased from the store
// This function only works for widgets, not Items

function buy(store) {

    let cost = parseInt(store.getAttribute("cost"));

    if (cost > score) {
        return;
    }
    changeScore(-cost);

    // Handles super-gompei stacking
    

    // handles ultra-gompei stacking
    let ultra_gompei = document.querySelector("#ultra-gompei-container #ultra-gompei")?.parentElement
    if (store.getAttribute("name") == "Ultra-Gompei" && ultra_gompei != null) {
        let old_yield = parseInt(ultra_gompei.getAttribute("reap"));
        ultra_gompei.setAttribute("reap", old_yield + 50)
        ultra_gompei_count += 1
        document.body.style = "--gompei-count:" + ultra_gompei_count
    }

    let new_widget = store.firstElementChild.cloneNode(true);

    // High school diplomas is placed before gompei daycare so that a baby gompei can not be upgraded twice into a super gompei and break the containers

    // high school diploma item
    if (playerItems[7] == "true" && new_widget.getAttribute("name") == "Gompei" && getRandomInteger(1, 15) == 15) {
        new_widget = document.getElementById("super-gompei-id").firstElementChild.cloneNode(true);
    }

    // gompei daycare item
    if (playerItems[1] == "true" && getRandomInteger(1, 10) == 10 && new_widget.getAttribute("name") == "Baby-Gompei") {
        new_widget = document.getElementById("gompei").firstElementChild.cloneNode(true);
    }


    new_widget.onclick = () => {
        harvest(new_widget);
    }

    // The following code handles the placement of the new widget in the correct container based on its type
    if (store.getAttribute("name") == "Brick-Road") {
        brick_container.appendChild(new_widget)
    }
    if (store.getAttribute("name") == "Lawn") {
        lawn_container.appendChild(new_widget)
    }
    if (store.getAttribute("name") == "Baby-Gompei" && new_widget.getAttribute("name") != "Gompei") {
        baby_gompei_container.appendChild(new_widget)
    }
    // Gomepei Daycare item
    else if (store.getAttribute("name") == "Baby-Gompei" && playerItems[1] == "true" && new_widget.getAttribute("name") == "Gompei") {
        gompei_container.appendChild(new_widget)
    }
    if (store.getAttribute("name") == "Gompei" && new_widget.getAttribute("name") != "Super-Gompei") {
        gompei_container.appendChild(new_widget)
    }
    // high school diploma item (it uses the super gompei stacking code from above, I should probably just make that a function)
    else if (store.getAttribute("name") == "Gompei" && playerItems[7] == "true" && new_widget.getAttribute("name") == "Super-Gompei") {

        let super_gompei = document.querySelector("#store-container #super-gompei")?.parentElement
        if (new_widget.getAttribute("name") == "Super-Gompei" && super_gompei_container.children.length != 0) {
            let old_yield = parseInt(super_gompei.getAttribute("reap"));
            super_gompei.setAttribute("reap", old_yield + 1000)
            super_gompei_count += 1
            document.body.style = "--gompei-count:" + super_gompei_count
        }
        else {
            super_gompei_container.appendChild(new_widget)
        }
    }
    let super_gompei = document.querySelector("#store-container #super-gompei")?.parentElement
    if (store.getAttribute("name") == "Super-Gompei" && super_gompei_container.children.length != 0) {
        let old_yield = parseInt(super_gompei.getAttribute("reap"));
        super_gompei.setAttribute("reap", old_yield + 1000)
        super_gompei_count += 1
        document.body.style = "--gompei-count:" + super_gompei_count
    }
    else if (store.getAttribute("name") == "Super-Gompei" && super_gompei_container.children.length == 0) {
        super_gompei_container.appendChild(new_widget)
    }
    if (store.getAttribute("name") == "Ultra-Gompei") {
        ultra_gompei_container.appendChild(new_widget)
        // Initialize a click counter for the rainbow effect
        new_widget.setAttribute("data-clicks", "0");
    }


    if (new_widget.getAttribute("auto") == "true") {
        new_widget.setAttribute("harvesting", "")
        setup_end_harvest(new_widget)
    }

    // adoption papers item
    if (new_widget.getAttribute("name") == "Gompei" && playerItems[3] == "true") {
        let baby_gompei = document.getElementById("baby-gompei");
        baby_gompei.children[0].setAttribute("reap", baby_gompei.children[0].getAttribute("base-reap") * Math.floor(1 + (gompei_container.children.length * 0.25)));
    }

    // real estate agent item
    if (new_widget.getAttribute("name") == "Lawn" && playerItems[2] == "true") {
        let lawn = document.getElementById("lawn");
        lawn.children[0].setAttribute("reap", lawn.children[0].getAttribute("base-reap") * Math.floor(1 + (lawn_container.children.length * 0.10)));
        console.log("we did ittt")
    }


    // minnimum wage item
    if (playerItems[6] == "true" && getRandomInteger(1, 8) == 8) {
        gompeiWage = true;
    }
    if (playerItems[6] == "true" && gompeiWage && new_widget.getAttribute("name") == "Gompei") {
        gompeiWage = false;
    }

    updateReap()
    updateCosts()

}

// Will determine if auto widgets harvest again after completing a harvest
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

    // mower effects
    if (playerItems[0] == "true" && widget.getAttribute("name") == "Lawn" && !event && getRandomInteger(1, 2) == 2 && playerItems[5] != "true") {
        harvest(lawn_container.children[getRandomInteger(0, lawn_container.children.length - 1)], true)
    }
    // Mega Mower Effects
    else if (playerItems[5] == "true" && widget.getAttribute("name") == "Lawn" && !event) {
        harvest(lawn_container.children[getRandomInteger(0, lawn_container.children.length - 1)], true)
        if (getRandomInteger(1, 2) == 2) {
            harvest(lawn_container.children[getRandomInteger(0, lawn_container.children.length - 1)], true)
        }
    }

    // Brick Mower
    if (playerItems[4] == "true" && widget.getAttribute("name") == "Brick-Road" && !event) {
        harvest(lawn_container.children[getRandomInteger(0, lawn_container.children.length - 1)], false)
    }

    widget.setAttribute("harvesting", "");

    changeScore(parseInt(widget.getAttribute("reap")))
    givePoints(widget)

    setup_end_harvest(widget);

}

// In charge of the little pop-up points that appear when a widget is harvested
function givePoints(widget) {
    let points_element = document.createElement("span")
    points_element.className = "point";
    points_element.innerHTML = "+" + widget.getAttribute("reap")
    points_element.onanimationend = () => {
        points_element.remove();
    }
    widget.appendChild(points_element);

}

// Hides the widget holders when pressed
function hideHolder(id) {
    let held = document.getElementById(id)
    if (held.style.display != "none") {
        held.style.display = "none";
    }
    else {
        held.style.display = "";
    }
}

//This function is called to update all of the items the player has bought and not bought
function setItemsUp() {
    playerItems = [document.getElementById("lawn-mower").getAttribute("bought"), document.getElementById("gompei-day-care").getAttribute("bought"), document.getElementById("real-estate-agent").getAttribute("bought"), document.getElementById("adoption-papers").getAttribute("bought"), document.getElementById("brick-mowers").getAttribute("bought"), document.getElementById("mega-mower").getAttribute("bought"), document.getElementById("minnimum-wage").getAttribute("bought"), document.getElementById("high-school-diplomas").getAttribute("bought")]
}

// Seperates the items into the store and the player's items
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

// The buy function but for items instead of widgets
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
    updateReap();
}

// Updates the reap values for all widgets in the game
// It will update all bought widgets for the player with the appropriate reap value
function updateReap() {

    for (let i = 0; i < store_container.children.length; i++) {
        for (let t = 0; t < store_container.children[i].children.length; t++) {
            if (store_container.children[i].children[t].classList.contains("reapTag")) {
                store_container.children[i].children[t].innerHTML = "+" + store_container.children[i].children[0].getAttribute("reap") + " sqft";
            }
        }
    }
    let holders = document.getElementById("widget-holder")
    for (let i = 0; i < holders.children.length; i++) {
        for (let t = 0; t < holders.children[i].children.length; t++) {
            holders.children[i].children[t].setAttribute("reap", store_container.querySelectorAll('[name=' + holders.children[i].children[t].getAttribute("name") + ']')[0].children[0].getAttribute("reap"));
        }
    }

}


setItemsUp()
changeScore(0);
