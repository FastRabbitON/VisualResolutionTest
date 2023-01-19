const YesBtn = document.getElementById('YesBtn');
const NoBtn = document.getElementById('NoBtn');

const UserInfo = ["Użytkownik"]
const ColorInfo = ["Kolor"]
const ShapeInfo = ["Kształt"];
const PTime = ["Czas-bodźca-[ms]"];
const GTime =["Czas-przerwy-[ms]"];
const RoundNumber = ["Runda"];
const AnswerKind = ["Odpowiedź"];
const FirstPositionKind = ["Pierwsza-pozycja-[px]"];
const SecondPositionKind = ["Druga-pozycja-[px]"];
const PositionDifferences = ["Odległość-między-[px]"];
const AngleMain = ["Kąt-Pierwszy-[°]"];
const AngleSub = ["Kąt-Drugi-[°]"];
const AngleDiff = ["Odchylenie-od-głównego-[°]"];
const ToSave = [UserInfo, ShapeInfo, ColorInfo, PTime, GTime, RoundNumber, AnswerKind, FirstPositionKind, SecondPositionKind, PositionDifferences, AngleMain, AngleSub, AngleDiff];

let AnswerGood = 0;
let AnswerWrong = 0;
let SameAnswer = 0;
let Round = 0;

let ToEnd = 15;

var ToDown = 2; //Ile dobrze do przybliżenia
var ToUp = 1  //Ile źle do oddalenia

var FirstPosition = 0;
var SecondPosition = 0;
var ShapeKind = "square";
var ShapeColor = "red"
var SizeX = 300;
var SizeY = 300;

var User = "UserOne";

var PresentationTime = 0;
var GapTime = 0

var LenghtMainX = 0;
var LenghtSubX = 0;
var ToScreen = 100
var AngleToMain = 0;
var AngleToSub = 0;

const TimeBetweenRounds = Number(2000); //Czas między rundami

//const EndRounds = 2; DO OGARNIĘCIA AUTOMATYCZNE DOSTOSOWANIE CZASU

var AvailablePosition = [0, 2, 5, 10, 20, 30, 40, 50, 100, 200];

var SecondMove = 9 //Wybiera pozycje z arraya AvailablePosition dla poruszania drugim shapem !!!!!!

const Render = document.getElementById("stimulusContainer");
const PreViewRender = document.getElementById("PreView");
const RenderBtnSave = document.getElementById("saveRend");

csvContent = "data:text/csv;charset=utf-8,";

function VariableChange() {

    FirstPosition = Number(document.getElementById("firstPosition").value); //już w px
    SecondPosition = Number(FirstPosition + AvailablePosition[SecondMove]); //już w px
    ShapeKind = document.querySelector('input[name="shapes"]:checked').value;
    ShapeColor = document.getElementById("color").value;
    SizeX = Number(document.getElementById("sizeX").value);
    SizeY = Number(document.getElementById("sizeY").value);
    PresentationTime = Number(document.getElementById("timePresentation").value);
    GapTime = Number(document.getElementById("timeGap").value);

    User = document.getElementById("user").value;

    LenghtMainX = FirstPosition * 0.0264583333;
    LenghtSubX = SecondPosition * 0.0264583333;


    if (document.getElementById("moveType").value == 1) {
        ToDown = 1;
        ToUp = 1
    }
    if (document.getElementById("moveType").value == 2) {
        ToDown = 2;
        ToUp = 1
    }

    console.log(FirstPosition);
    console.log(SecondPosition);
    console.log(ShapeKind);
    console.log(ShapeColor);
    console.log(User);
    console.log(PresentationTime);
    console.log(GapTime);
    console.log(SizeX);
    console.log(SizeY);
    console.log(ToDown, ToUp);
}

AngleCalcFunction = () => {
    // DifferenceIncm = (SecondPosition * 0.0264583333) - (FirstPosition * 0.0264583333);
    AngleToMain =  (Math.atan2(LenghtMainX, ToScreen) * 180 / Math.PI).toFixed(2);
    AngleToSub = (Math.atan2(LenghtSubX, ToScreen) * 180 / Math.PI).toFixed(2);
    AngleDifference = (AngleToSub-AngleToMain).toFixed(2); //Odchylenie od głównego

    AngleMain.push(AngleToMain);
    AngleSub.push(AngleToSub);
    AngleDiff.push(AngleDifference); //Odchylenie
}

VariableReset = () => {
    window.location.reload();
}

InfoPush = () => {
    RoundNumber.push(Round);
    FirstPositionKind.push(FirstPosition);
    SecondPositionKind.push(SecondPosition);
    PositionDifferences.push(SecondPosition - FirstPosition);
    UserInfo.push(User);
    ShapeInfo.push(ShapeKind);
    ColorInfo.push(ShapeColor);
    PTime.push(PresentationTime);
    GTime.push(GapTime);
}

RenderEmpty = () => {
    Render.innerHTML = "";
}

RenderSave = () => {
    RenderBtnSave.innerHTML = `<button id="saveBtn" class="saveBtn" onclick="SaveFunction()">Save Result</button>`
}

RenderShapeOne = (FirstPosition, ShapeKind, ShapeColor, SizeX, SizeY) => {
    Render.innerHTML = `<div id="${ShapeKind}"></div>`;

    if (ShapeKind == "triangle"){
        document.querySelector(':root').style.setProperty("--triangleColor", ShapeColor);
        document.querySelector(':root').style.setProperty("--triangleWidth", SizeX + 'px');
        document.querySelector(':root').style.setProperty("--triangleHeight", (SizeX/2) + 'px');
        document.querySelector(':root').style.setProperty("--triangleHeight", (SizeX/2) + 'px');
        document.getElementById(`${ShapeKind}`).style.left = FirstPosition + "px";
    }
    else{
        document.getElementById(`${ShapeKind}`).style.width = SizeX + 'px';
        document.getElementById(`${ShapeKind}`).style.height = SizeY + 'px';
        document.getElementById(`${ShapeKind}`).style.backgroundColor = ShapeColor;
        document.getElementById(`${ShapeKind}`).style.left = FirstPosition + "px";
    }
}

RenderShapeTwo = (SecondPosition, ShapeKind, ShapeColor, SizeX, SizeY) => {
    Render.innerHTML = `<div id="${ShapeKind}"></div>`;

    if (ShapeKind == "triangle"){
        document.querySelector(':root').style.setProperty("--triangleColor", ShapeColor);
        document.querySelector(':root').style.setProperty("--triangleWidth", SizeX + 'px');
        document.querySelector(':root').style.setProperty("--triangleHeight", (SizeX/2) + 'px');
        document.querySelector(':root').style.setProperty("--triangleHeight", (SizeX/2) + 'px');
        document.getElementById(`${ShapeKind}`).style.left = SecondPosition + "px";
    }
    else{
        document.getElementById(`${ShapeKind}`).style.width = SizeX + 'px';
        document.getElementById(`${ShapeKind}`).style.height = SizeY + 'px';
        document.getElementById(`${ShapeKind}`).style.backgroundColor = ShapeColor;
        document.getElementById(`${ShapeKind}`).style.left = SecondPosition + "px";
    }
}

SaveFunction = () => {
    ToSave.forEach(function (rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Data.csv");
    document.body.appendChild(link);
    link.click();

    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
}


StartFunction = () => {

    ToEnd = Number(document.getElementById("round").value);

    document.getElementById("mainContainer").classList.toggle("off");
    document.getElementById("settingContainer").classList.toggle("off");

    VariableChange();

    RenderFunction();
}


YesAnswer = () => {

    Round++;

    ToEnd--;

    InfoPush();
    AngleCalcFunction();

    if (FirstPosition == SecondPosition) {
        AnswerGood++;
        AnswerKind.push(1);
    }
    else {
        AnswerWrong++;
        AnswerKind.push(0);
    }



    if (ToEnd == 0) {
        RenderEmpty();
        RenderSave();
    }
    else {
        MoveFunction();
        RenderEmpty();
        RenderFunction();
    }


    console.log(RoundNumber);
    console.log(AnswerKind);
    console.log(FirstPositionKind);
    console.log(SecondPositionKind);
    console.log(PositionDifferences);
    console.log(AngleMain);
    console.log(AngleSub);
    console.log(AngleDiff);
    console.log(AnswerGood, AnswerWrong);
    console.log(ToDown, ToUp);
    console.log(SecondMove);
    console.log(SameAnswer);
}

NoAnswer = () => {

    Round++;

    ToEnd--;

    InfoPush();
    AngleCalcFunction();

    if (FirstPosition == SecondPosition) {
        AnswerWrong++;
        AnswerKind.push(0);
    }
    else {
        AnswerGood++;
        AnswerKind.push(1);
    }


    if (ToEnd == 0) {
        RenderEmpty();
        RenderSave();
    }
    else {
        MoveFunction();
        RenderEmpty();
        RenderFunction();
    }

    console.log(RoundNumber);
    console.log(AnswerKind);
    console.log(FirstPositionKind);
    console.log(SecondPositionKind);
    console.log(PositionDifferences);
    console.log(AngleMain);
    console.log(AngleSub);
    console.log(AngleDiff);
    console.log(AnswerGood, AnswerWrong);
    console.log(ToDown, ToUp);
    console.log(SecondMove);
    console.log(SameAnswer);
}


function MoveFunction() {

    let SecondMoveChecker = SecondMove;

    if ((AnswerGood >= ToDown) && (SecondPosition > 0)) {
        
        if (SecondMove > 0){
            SecondMove--;
        }

        AnswerGood = 0;
        AnswerWrong = 0;
    }


    if ((AnswerWrong >= ToUp) && (SecondPosition < 400)) {
        
        if (SecondMove < 9){
            SecondMove++;
        }


        AnswerGood = 0;
        AnswerWrong = 0;
    }


    if (SecondMoveChecker == SecondMove){
        SameAnswer++

        if(SameAnswer == 3){
            SecondMove = 5;
            SameAnswer = 0;
        }
    }

    VariableChange();
}




RenderFunction = () => {
    YesBtn.setAttribute('disabled', 'true');
    NoBtn.setAttribute('disabled', 'true');

    setTimeout(() => RenderShapeOne(FirstPosition, ShapeKind, ShapeColor, SizeX, SizeY), TimeBetweenRounds); // <- Czas między turami
    setTimeout(() => RenderEmpty(), (TimeBetweenRounds + PresentationTime)) // <- Czas prezentacji pierwszego bodźca
    setTimeout(() => RenderShapeTwo(SecondPosition, ShapeKind, ShapeColor, SizeX, SizeY), (TimeBetweenRounds + PresentationTime + GapTime)); // <- Czas Gapu


    setTimeout(() => YesBtn.removeAttribute('disabled', 'true'), (TimeBetweenRounds + PresentationTime + GapTime + PresentationTime));
    setTimeout(() => NoBtn.removeAttribute('disabled', 'true'), (TimeBetweenRounds + PresentationTime + GapTime + PresentationTime));
}

