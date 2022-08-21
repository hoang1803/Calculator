


let numbers = document.getElementsByClassName("btn");
let result = document.getElementById("result");
let pre_result = document.getElementById("pre-result");
let Degree = document.getElementById("Deg");
let Radian = document.getElementById("Rad");
const PI = Math.PI;
const e = Math.E;

let isDeg = true;
let pre_ans = 0;
let countBrackets = 0;
let arr = new Array();
let haveDot = new Array();
let curPoint = 0;
let printResult = true;

result.innerHTML = '0';

AC_or_CE();


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
                if (value == '^(') {

                    if (arr[curPoint] == '') {
                        arr[curPoint] = '0';
                        arr[++curPoint] = '^';
                        arr[++curPoint] = '(';
                        save = '0' + value;
                    }
                    else {
                        if (!isNaN(arr[curPoint]) || arr[curPoint] == 'π' || arr[curPoint] == 'e') {
                            arr[++curPoint] = '^';
                            arr[++curPoint] = '(';
                        }
                        else
                            save = '';
                    }

                }
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
        }
        else if (value.length == 1) {
            if (isNaN(value)) {
                if (value == 'E') {
                    if (arr[curPoint] == '' || isNaN(arr[curPoint]))
                        save = '';
                    else
                        arr[++curPoint] = save;
                }
                else
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
                                    if (arr[curPoint] == '+' || arr[curPoint] == '-' || arr[curPoint] == '×' || arr[curPoint] == '÷' || arr[curPoint] == '^' || arr[curPoint] == '(') {
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
                else {
                    if (arr[curPoint] == '%' || arr[curPoint] == '!') {
                        arr[++curPoint] = '×';
                        save = '×' + value;
                    }
                    arr[++curPoint] = value;
                }
            }
        }

        if (printResult) {
            if (save != '') {
                result.innerHTML = save;
                printResult = false;
            }
        }
        else
            result.innerHTML += save;
        AC_or_CE();

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
            // console.log("d, " + arrInfx[i]);
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
                // console.log("ahihihi " + priority(save.getTop()) + " " + priority(arrInfx[i]));
                // console.log("hihi " + save.getTop() + " " + arrInfx[i]);
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

function AC_or_CE() {
    let del = document.getElementById("Delete");
    if (printResult) {
        del.innerHTML = 'AC';
        del.setAttribute('onclick', 'clean()');
    }
    else {
        del.innerHTML = 'CE';
        del.setAttribute('onclick', 'undo()');
    }
}

function fixExpression() {
    let arrInfx = new Array();
    let j = 0;

    for (i = 0; i < arr.length; i++) {

        if (arr[i] == '')
            break;

        if (arr[i] == '%') {
            arrInfx[j++] = '%';
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
    if ((x.length > 1 || x == '√') && x != '1-' && x != '1+')
        return 5;
    if (x == '^' || x == '!' || x == 'E' || x == '%')
        return 4;
    if (x == '1+' || x == '1-')
        return 3;
    if (x == '÷' || x == '×')
        return 2;
    if (x == '+' || x == '-')
        return 1;
    return 0;
}

function equal() {
    if (printResult) {
        return;
    }
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
        // console.log(res);
        // console.log(save);
        let temp = new Stack();
        for (x of save) {
            if (typeof (x) == typeof (1))
                temp.push(x);
            else {
                if (x.length > 1 || x == '√' || x == '!' || x == '%') {
                    if (temp.empty()) {
                        answer = Error;
                        // console.log(12);
                        break;
                    }
                    let cur = temp.getTop();
                    // console.log(x + " " + cur);
                    temp.pop();
                    switch (x) {
                        case '1+':
                            break;

                        case '1-':
                            cur = -cur;
                            break;

                        case '%':
                            cur = cur / 100;
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
                // console.log(x + " " + temp.size());
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
        if (temp.size() != 1 || answer == Error)
            answer = Error;
        else
            answer = temp.getTop();
    }

    answer = round(answer);
    // console.log(answer);

    if (!Number.isNaN(answer) && answer != Error)
        pre_ans = answer;
    else
        answer = "Error";
    result.innerHTML = answer;
    pre_result.innerHTML = "Ans = " + pre_ans;
    printResult = true;
    countBrackets = 0;
    arr = new Array();
    curPoint = 0;
    AC_or_CE();
}


function clean() {
    printResult = true;
    countBrackets = 0;
    // if (result.innerHTML != "Error")
    //     pre_ans = result.innerHTML;
    result.innerHTML = '0';
    pre_result.innerHTML = "Ans = " + pre_ans;
    arr = new Array();
    curPoint = 0;
    AC_or_CE();
}

function del(res, i) {
    return res.substring(0, res.length - i);
}

function undo() {
    if (printResult) {
        clean();
        return;
    }
    let res = result.innerHTML;
    if (arr[curPoint] == '(')
        countBrackets--;
    if (arr[curPoint] == ')')
        countBrackets++;
    if (curPoint == 0) {
        if (!isNaN(arr[0]) && arr[0].length) {
            res = del(res, 1);
            arr[0] = del(arr[0], 1);
        }
        else
            arr[0] = res = '';
    }
    else {
        if (arr[curPoint] == '(') {
            if (arr[curPoint - 1].length > 1 || arr[curPoint - 1] == '√' || arr[curPoint - 1] == '^') {
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
            if (arr[curPoint] == 'Ans') {
                res = del(res, arr[curPoint].length);
                arr[curPoint--] = '';
            }
            else {
                res = del(res, 1);
                arr[curPoint] = del(arr[curPoint], 1);
                if (arr[curPoint] == '')
                    curPoint--;
            }


        }
    }
    if (arr[0] == '') {
        res = '0';
        printResult = true;
    }
    result.innerHTML = res;
    AC_or_CE();
}

function changeToRad() {
    Degree.style.color = "gray";
    Radian.style.color = "black";
    isDeg = false;
}

function changeToDeg() {
    Radian.style.color = "gray";
    Degree.style.color = "black";
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

function round(n) {
    if (Number.isNaN(n))
        return n;

    if (n == Infinity)
        return n;
    let cur = +(Math.round(n + "e+11") + "e-11");
    // console.log();
    // console.log(typeof cur);
    if (Number.isNaN(cur)) {
        // console.log("ahihi");
        return n;
    }

    return cur;
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
    let temp = Math.sin(angle);
    if (-1e-11 <= temp && temp <= 1e-11)
        temp = 0;
    return temp;
}

function cos(angle) {
    if (isDeg)
        angle = transferDegToRad(angle)
    let temp = Math.cos(angle);
    if (-1e-11 <= temp && temp <= 1e-11)
        temp = 0;
    return temp;
}

function tan(angle) {
    let a = sin(angle);
    let b = cos(angle);
    if (isDeg)
        angle = transferDegToRad(angle)
    if (b == 0)
        return Error;
    return a / b;
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
