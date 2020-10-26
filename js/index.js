// 页面加载完成后进行初始化
window.onload = function () {
    init()
}
// 可以通过设置动态设置rows cols来提升游戏难度
var rows = 7
var cols = 12
var wrap
var types = 8
var squareSet
var chooseOne = null
var chooseTwo = null
var Toward = {
    NODE: null,
    UP: {
        row: -1,
        col: 0
    },
    RIGHT: {
        row: 0,
        col: 1
    },
    DOWN: {
        row: 1,
        col: 0
    },
    LEFT: {
        row: 0,
        col: -1
    }
}

// 初始化
function init() {
    wrap = document.getElementsByClassName('wrapper')[0]
    if (rows * cols % 2 != 0) {
        alert('展示数量不能为奇数！')
    }
    initSquareSet()
}

// 初始化棋盘
function initSquareSet() {
    // 小方格宽高各64px
    wrap.style.width = 64 * cols + 'px'
    wrap.style.height = 64 * rows + 'px'

    var tempArr = createRandomNum()

    squareSet = new Array(rows + 2)
    for (var i = 0; i < squareSet.length; i++) {
        squareSet[i] = new Array(cols + 2)
    }
    for (var i = 1; i <= rows; i++) {
        for (var j = 1; j <= cols; j++) {
            var temp = createSquare(tempArr.pop(), i, j)
            squareSet[i][j] = temp
            wrap.append(temp)
            temp.onclick = function () {
                if (chooseOne == null || chooseOne.num != this.num) {
                    chooseOne = this
                } else {
                    chooseTwo = this
                    if (chooseOne != chooseTwo && checkLink(chooseOne.row, chooseOne.col, 0, Toward.NODE, [])) {
                        clearSquare(chooseOne.row, chooseOne.col)
                        clearSquare(chooseTwo.row, chooseTwo.col)
                    }
                    chooseOne = null
                    chooseTwo = null
                }
                render()
                if (checkFinish()) {
                    alert('恭喜你，成功通关！')
                }
            }
        }
    }
}

// 生成随机图片，且包含图片标记
function createRandomNum() {
    var temp = []
    for (var i = 0; i < rows * cols / 2; i++) {
        var num = Math.floor(Math.random() * 13)
        temp.push(num)
        temp.push(num)
    }
    // 打乱数组
    temp.sort(function () {
        return Math.random() - 0.5
    })
    return temp
}

// 生成小方块
function createSquare(num, row, col) {
    var temp = document.createElement('div')
    temp.classList.add('square')
    temp.style.backgroundImage = 'url(./images/animal' + num + '.png)'
    temp.style.left = 64 * col + 'px'
    temp.style.top = 64 * row + 'px'
    temp.num = num
    temp.row = row
    temp.col = col
    return temp
}

// 图片透明
function render() {
    for (var i = 0; i < squareSet.length; i++) {
        for (var j = 0; j < squareSet[i].length; j++) {
            if (squareSet[i][j] && squareSet[i][j] == chooseOne) {
                squareSet[i][j].style.opacity = '0.3'
            } else if (squareSet[i][j]) {
                squareSet[i][j].style.opacity = '1'
            }
        }
    }
}

// 判断是否结束
function checkFinish() {
    for (var i = 0; i < squareSet.length; i++) {
        for (var j = 0; j < squareSet[i].length; j++) {
            if (squareSet[i][j]) {
                return false;
            }
        }
    }
    // 所有的都被清除了 返回true
    init()
    return true;
}

// 清除小方块
function clearSquare(x, y) {
    wrap.removeChild(squareSet[x][y])
    squareSet[x][y] = null
}

// 检查链接
function checkLink(row, col, changeTimes, nowToward, path) {
    if (isExist(row, col) && squareSet[row][col] == chooseTwo && changeTimes <= 3) {
        return true
    }
    if (isExist(row, col) && squareSet[row][col] != chooseOne ||
        changeTimes > 3 ||
        row < 0 || col < 0 || row >= squareSet.length || col >= squareSet[0].length ||
        path.indexOf(getLocation(row, col)) > -1) {
        path.pop();
        return false;
    }
    path.push(getLocation(row, col))
    return checkLink(row - 1, col, nowToward == Toward.UP ? changeTimes : changeTimes + 1, Toward.UP, path) ||
        checkLink(row + 1, col, nowToward == Toward.DOWN ? changeTimes : changeTimes + 1, Toward.DOWN, path) ||
        checkLink(row, col - 1, nowToward == Toward.LEFT ? changeTimes : changeTimes + 1, Toward.LEFT, path) ||
        checkLink(row, col + 1, nowToward == Toward.RIGHT ? changeTimes : changeTimes + 1, Toward.RIGHT, path)
}

function isExist(row, col) {
    if (row > 0 && row < squareSet.length && col > 0 && col < squareSet[0].length && squareSet[row] && squareSet[row][col]) {
        return true;
    }
    return false;
}

function getLocation(row, col) {
    return "" + row + "," + col
}