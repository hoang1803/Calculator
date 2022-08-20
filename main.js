


let numbers = document.getElementsByClassName("btn");
let result = document.getElementById("result");
let pre_result = document.getElementById("pre-result");

const PI = Math.PI;
const e = Math.E;

let isDeg = true;
let pre_ans = 0;
let countBrackets = 0;
let arr = new Array();
let haveDot = new Array();
let curPoint = 0;


for (let number of numbers) {
    number.addEventListener("click", function () {
        let value = this.value;
        let save = value;


        if (arr[curPoint] == undefined)
            arr[curPoint] = "";
        if (haveDot[curPoint] == undefined)
            haveDot[curPoint] = false;

        if (value.length > 1) {
            if (arr[curPoint] == 'E')
                save = '';
            else {
                if (curPoint == 0 && arr[curPoint] == "")
                    curPoint = -1;
                if (value == 'Ans')
                    arr[++curPoint] = 'Ans';
                else {
                    arr[++curPoint] = del(value, 1);
                    arr[++curPoint] = '(';
                }

            }
        }
        else if (value.length == 1) {
            if (isNaN(value)) {
                if (value == '÷' || value == '×' || value == '%' || value == '^' || value == '!' || value == '+' || value == '-') {
                    if (value == '+' || value == '-') {
                        if (arr[curPoint] == '+' || arr[curPoint] == '-')
                            save = "";
                        else {
                            if (curPoint == 0 && arr[curPoint] == '')
                                curPoint = -1;
                            arr[++curPoint] = value;
                        }
                    }
                    else {
                        if (arr[curPoint] == ')' || (arr[curPoint] != '' && !isNaN(arr[curPoint])) || arr[curPoint] == '!' || arr[curPoint] == '.' || arr[curPoint] == 'π' || arr[curPoint] == 'e' || arr[curPoint] == '%' || arr[curPoint] == 'Ans')
                            arr[++curPoint] = value;
                        else
                            save = '';
                    }
                }
                else
                    if (value == '.') {
                        if (haveDot[curPoint] == true || arr[curPoint] == 'E') {
                            save = "";
                        }
                        else {
                            if (!isNaN(arr[curPoint])) {
                                arr[curPoint] += '.';
                                haveDot[curPoint] = true;
                            }
                            else {
                                if (arr[curPoint] == '+' || arr[curPoint] == '-' || arr[curPoint] == '×' || arr[curPoint] == '÷' ||
                                    arr[curPoint] == '^' || arr[curPoint] == '(') {
                                    arr[++curPoint] = value;
                                    haveDot[curPoint] = true;
                                }
                                else {
                                    save = "×.";
                                    arr[++curPoint] = '×';
                                    arr[++curPoint] = value;
                                    haveDot[curPoint] = true;

                                }
                            }
                        }
                    }
                    else if (arr[curPoint] != 'E') {
                        if (curPoint == 0 && arr[curPoint] == "")
                            curPoint = -1;
                        arr[++curPoint] = value;
                    }
                    else
                        save = '';
            }
            else {
                if (!isNaN(arr[curPoint]) || arr[curPoint] == '.')
                    arr[curPoint] += value;
                else
                    arr[++curPoint] = value;
            }
        }

        result.innerHTML += save;

    })
}

function checkBrackets(n) {
    if (n == 1) {
        if (arr[curPoint] != 'E')
            countBrackets++;
        // result.innerHTML += '(';
    }
    else {
        if (countBrackets > 0 && arr[curPoint] != '(') {
            if (curPoint == 0 && arr[curPoint] == "")
                curPoint = -1;
            arr[++curPoint] = ')';
            result.innerHTML += ')';
            countBrackets--;
        }
    }

}

pre_result.innerHTML = "Ans = " + pre_ans;

class Node {
    constructor(value) {
        this.value = value;
        this.prev = null;
    }
}

class Stack {
    constructor() {
        this.length = 0;
        this.top = null;
    }

    empty() {
        return (this.top == null)
    }

    push(value) {
        this.length++;
        let node = new Node(value);
        node.prev = this.top;
        this.top = node;
    }

    getTop() {
        if (this.empty())
            return Error;
        return this.top.value;
    }

    pop() {
        if (this.empty())
            return Error;
        this.length--;
        this.top = this.top.prev;
    }

    size() {
        return this.length;
    }
}

function infixToPostfix(arrInfx) {

    let arrPtfx = new Array();
    let save = new Stack();
    let j = 0;

    for (let i = 0; i < arrInfx.length; i++) {
        if (!isNaN(arrInfx[i])) {
            arrPtfx[j++] = arrInfx[i];
        }
        else {
            if (arrInfx[i] == '(') {
                save.push(arrInfx[i]);
                continue;
            }

            if (arrInfx[i] == ')') {
                while (!save.empty() && save.getTop() != '(') {
                    arrPtfx[j++] = save.getTop();
                    save.pop();
                }

                save.pop();
                continue;
            }

            while (!save.empty() && priority(save.getTop()) >= priority(arrInfx[i])) {
                arrPtfx[j++] = save.getTop();
                save.pop();
            }
            save.push(arrInfx[i]);
        }
    }

    while (!save.empty()) {
        arrPtfx[j++] = save.getTop();
        save.pop();
    }
    return arrPtfx;
}

function fixExpression() {
    let arrInfx = new Array();
    let j = 0;

    for (i = 0; i < arr.length; i++) {

        if (arr[i] == '')
            break;

        if (arr[i] == '%') {
            arrInfx[j++] = '÷';
            arrInfx[j++] = 100;
            continue;
        }

        if (arr[i] == 'π' || arr[i] == 'e') {
            if (i == 0 || (isNaN(arrInfx[j - 1]) && arrInfx[j - 1] != ')' && arrInfx[j - 1] != '!'))
                arrInfx[j++] = (arr[i] == 'e') ? e : PI;
            else {
                arrInfx[j++] = '×';
                arrInfx[j++] = (arr[i] == 'e') ? e : PI;
            }
            continue;
        }

        if (arr[i] == 'Ans' || arr[i] == "Infinity") {
            if (i == 0 || (isNaN(arrInfx[j - 1]) && arrInfx[j - 1] != ')' && arrInfx[j - 1] != '!'))
                arrInfx[j++] = (arr[i] == 'Ans') ? pre_ans : Infinity;
            else {
                arrInfx[j++] = '×';
                arrInfx[j++] = (arr[i] == 'Ans') ? pre_ans : Infinity;
            }
            continue;
        }

        if (!isNaN(arr[i]) || arr[i] == '(') {
            if (i == 0 || (isNaN(arrInfx[j - 1]) && arrInfx[j - 1] != ')' && arrInfx[j - 1] != '!'))
                arrInfx[j++] = (arr[i] == '(') ? '(' : (arr[i] * 1);
            else {
                arrInfx[j++] = '×';
                arrInfx[j++] = (arr[i] == '(') ? '(' : (arr[i] * 1);
            }
            continue;
        }

        if (arr[i] == '+' || arr[i] == '-') {
            if (i == 0 || (isNaN(arrInfx[j - 1]) && arrInfx[j - 1] != ')' && arrInfx[j - 1] != '!'))
                arrInfx[j++] = (arr[i] == '+') ? '1+' : '1-';
            else {
                arrInfx[j++] = (arr[i] == '+') ? '+' : '-';
            }
            continue;
        }

        if (arr[i].length > 1 || arr[i] == '√') {
            if (i == 0 || (isNaN(arrInfx[j - 1]) && arrInfx[j - 1] != ')' && arrInfx[j - 1] != '!'))
                arrInfx[j++] = arr[i];
            else {
                arrInfx[j++] = '×';
                arrInfx[j++] = arr[i];
            }
            continue;
        }

        arrInfx[j++] = arr[i];
    }

    while (countBrackets > 0) {
        arrInfx[j++] = ')';
        countBrackets--;
    }

    return arrInfx;
}

function priority(x) {
    if (x == '1+' || x == '1-' || x.length > 1 || x == '√')
        return 4;
    if (x == '^' || x == '!' || x == 'E')
        return 3;
    if (x == '÷' || x == '×')
        return 2;
    if (x == '+' || x == '-')
        return 1;
    return 0;
}

function equal() {
    let res = fixExpression();
    let answer = 0;
    for (x of res) {
        if (x == '.') {
            answer = Error;
            break;
        }
    }
    if (answer != Error) {
        let save = infixToPostfix(res);
        // console.log(save);
        let temp = new Stack();
        for (x of save) {
            if (typeof (x) == typeof (1))
                temp.push(x);
            else {
                if (x.length > 1 || x == '√' || x == '!') {
                    if (temp.empty()) {
                        answer = Error;
                        // console.log(12);
                        break;
                    }
                    let cur = temp.getTop();
                    temp.pop();
                    switch (x) {
                        case '1+':
                            break;

                        case '1-':
                            cur = -cur;
                            break;

                        case 'log':
                            cur = log(cur);
                            break;

                        case 'ln':
                            cur = ln(cur);
                            break;

                        case '√':
                            cur = sqrt(cur);
                            break;

                        case 'sin':
                            cur = sin(cur);
                            break;

                        case 'cos':
                            cur = cos(cur);
                            break;

                        case 'tan':
                            cur = tan(cur);
                            break;

                        case '!':
                            cur = factorial(cur);
                            break;

                        default:
                            break;
                    }
                    temp.push(cur);
                    // console.log("huhu: " + x + " " + cur);
                    continue;
                }

                if (temp.size() < 2) {
                    answer = Error;
                    // console.log(9);
                    break;
                }

                let b = temp.getTop();
                temp.pop();
                let a = temp.getTop();
                temp.pop();

                let ans = 0;

                switch (x) {
                    case '+':
                        ans = a + b;
                        break;

                    case '-':
                        ans = a - b;
                        break;

                    case '×':
                        ans = a * b;
                        break;

                    case '÷':
                        ans = a / b;
                        break;

                    case '^':
                        ans = pow(a, b);
                        break;

                    case 'E':
                        ans = a * pow(10, b);
                        break;

                    default:
                        break;
                }
                // console.log("ahihi: " + x + " " + ans);
                temp.push(ans);
            }
        }
        if (temp.size() != 1)
            answer = Error;
        else
            answer = temp.getTop();
    }

    if (answer != Error)
        pre_ans = answer;
    else
        answer = "Error";
    result.innerHTML = answer;
    pre_result.innerHTML = "Ans = " + pre_ans;

    countBrackets = 0;
    arr = new Array();
    curPoint = 0;
    arr[curPoint] = answer;
}


function clean() {
    countBrackets = 0;
    pre_ans = result.innerHTML;
    result.innerHTML = "";
    arr = new Array();
    curPoint = 0;
}

function del(res, i) {
    return res.substring(0, res.length - i);
}

function undo() {
    let res = result.innerHTML;
    if (arr[curPoint] == '(')
        countBrackets--;
    if (arr[curPoint] == ')')
        countBrackets++;
    if (curPoint == 0)
        arr[0] = res = '';
    else {
        if (arr[curPoint] == '(') {
            if (arr[curPoint - 1].length > 1 || arr[curPoint - 1] == '√') {
                res = del(res, arr[curPoint - 1].length + 1);
                arr[curPoint] = arr[curPoint - 1] = '';
                curPoint -= 2;
                if (curPoint < 0)
                    curPoint = 0;
            }
            else {
                arr[curPoint--] = '';
                res = del(res, 1);
            }
        }
        else {
            arr[curPoint--] = '';
            res = del(res, 1);
        }
    }
    result.innerHTML = res;
}

function changeToRad() {
    isDeg = false;
}

function changeToDeg() {
    isDeg = true;
}

function factorial(n) {
    var res = 1;
    if (n > 170)
        return Infinity;
    for (i = 2; i <= n; i++)
        res *= i;
    return res;
}

function sqrt(n) {
    return Math.sqrt(n);
}

function pow(a, b) // a^b
{
    return Math.pow(a, b);
}

function transferDegToRad(angle) {
    angle = angle * PI / 180;
    return angle;
}

function transferRadToDeg(angle) {
    angle = angle / PI * 180;
    return angle;
}

function sin(angle) {
    if (isDeg)
        angle = transferDegToRad(angle);
    return Math.sin(angle);
}

function cos(angle) {
    if (isDeg)
        angle = transferDegToRad(angle)
    return Math.cos(angle);
}

function tan(angle) {
    if (isDeg)
        angle = transferDegToRad(angle)
    return Math.tan(angle);
}

function log(n) {
    return Math.log10(n);
}

function ln(n) {
    return Math.log(n);
}

function arcsin(x) {
    let angle = Math.asin(x);
    if (isDeg)
        transferRadToDeg(angle);
    return angle;
}

function arccos(x) {
    let angle = Math.acos(x);
    if (isDeg)
        transferRadToDeg(angle);
    return angle;
}

function arctan(x) {
    let angle = Math.atan(x);
    if (isDeg)
        transferRadToDeg(angle);
    return angle;
}
