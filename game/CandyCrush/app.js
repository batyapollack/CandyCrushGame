
document.addEventListener('DOMContentLoaded', () =>
{
        "use strict";

        let canvas, wi, height, ctx;
        let fireworks = [];
        let particles = [];

        function setup() {
            canvas = document.getElementById("canvas");
            setSize(canvas);
            ctx = canvas.getContext("2d");
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, wi, height);
            fireworks.push(new Firework(Math.random()*(wi-200)+100));
            window.addEventListener("resize",windowResized);
            document.addEventListener("click",onClick);
        }

        setTimeout(setup,1);

        function loop(){
            ctx.globalAlpha = 0.1;
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, wi, height);
            ctx.globalAlpha = 1;

            for(let i=0; i<fireworks.length; i++){
                let done = fireworks[i].update();
                fireworks[i].draw();
                if(done) fireworks.splice(i, 1);
            }

            for(let i=0; i<particles.length; i++){
                particles[i].update();
                particles[i].draw();
                if(particles[i].lifetime>80) particles.splice(i,1);
            }

            if(Math.random()<1/60) fireworks.push(new Firework(Math.random()*(wi-200)+100));
        }
        setInterval(loop, 1/60);
        //setInterval(loop, 100/60);
        class Particle{
            constructor(x, y, col){
                this.x = x;
                this.y = y;
                this.col = col;
                this.vel = randomVec(2);
                this.lifetime = 0;
            }

            update(){
                this.x += this.vel.x;
                this.y += this.vel.y;
                this.vel.y += 0.02;
                this.vel.x *= 0.99;
                this.vel.y *= 0.99;
                this.lifetime++;
            }

            draw(){
                ctx.globalAlpha = Math.max(1-this.lifetime/80, 0);
                ctx.fillStyle = this.col;
                ctx.fillRect(this.x, this.y, 2, 2);
            }
        }

        class Firework{
            constructor(x){
                this.x = x;
                this.y = height;
                this.isBlown = false;
                this.col = randomCol();
            }

            update(){
                this.y -= 3;
                if(this.y < 350-Math.sqrt(Math.random()*500)*40){
                    this.isBlown = true;
                    for(let i=0; i<60; i++){
                        particles.push(new Particle(this.x, this.y, this.col))
                    }
                }
                return this.isBlown;
            }

            draw(){
                ctx.globalAlpha = 1;
                ctx.fillStyle = this.col;
                ctx.fillRect(this.x, this.y, 2, 2);
            }
        }

        function randomCol(){
            var letter = '0123456789ABCDEF';
            var nums = [];

            for(var i=0; i<3; i++){
                nums[i] = Math.floor(Math.random()*256);
            }

            let brightest = 0;
            for(var i=0; i<3; i++){
                if(brightest<nums[i]) brightest = nums[i];
            }

            brightest /=255;
            for(var i=0; i<3; i++){
                nums[i] /= brightest;
            }

            let color = "#";
            for(var i=0; i<3; i++){
                color += letter[Math.floor(nums[i]/16)];
                color += letter[Math.floor(nums[i]%16)];
            }
            return color;
        }

        function randomVec(max){
            let dir = Math.random()*Math.PI*2;
            let spd = Math.random()*max;
            return{x: Math.cos(dir)*spd, y: Math.sin(dir)*spd};
        }

        function setSize(canv){
            canv.style.width = (innerWidth) + "px";
            canv.style.height = (innerHeight) + "px";
            wi = innerWidth;
            height = innerHeight;

            canv.width = innerWidth*window.devicePixelRatio;
            canv.height = innerHeight*window.devicePixelRatio;
            canvas.getContext("2d").scale(window.devicePixelRatio, window.devicePixelRatio);
        }

        function onClick(e){
            fireworks.push(new Firework(e.clientX));
        }

        function windowResized(){
            setSize(canvas);
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, wi, height);
        }


        const grid = document.querySelector('.grid')
        const scoreDisplay = document.getElementById('score')
        const movesDisplay = document.getElementById('moves')
        const width = 8
        var squares = []
        var countLevel = 0;
        let score = 0
        let moves = 25;
        scoreDisplay.innerHTML = score
        movesDisplay.innerHTML = moves

        var interval

        const candyColors = [
            'url(images/red-candy.png)',
            'url(images/yellow-candy.png)',
            'url(images/orange-candy.png)',
            'url(images/purple-candy.png)',
            'url(images/green-candy.png)',
            'url(images/blue-candy.png)'
        ]


        //create your board
        function createBoard() {
            for (let i = 0; i < width*width; i++) {
                const square = document.createElement('div')
                square.setAttribute('draggable', true)
                square.setAttribute('id', i)
                let randomColor = Math.floor(Math.random() * candyColors.length)
                square.style.backgroundImage = candyColors[randomColor]
                grid.appendChild(square)
                squares.push(square)
            }
        }
        createBoard()


        // Dragging the Candy
        let colorBeingDragged
        let colorBeingReplaced
        let squareIdBeingDragged
        let squareIdBeingReplaced

        squares.forEach(square => square.addEventListener('dragstart', dragStart))
        squares.forEach(square => square.addEventListener('dragend', dragEnd))
        squares.forEach(square => square.addEventListener('dragover', dragOver))
        squares.forEach(square => square.addEventListener('dragenter', dragEnter))
        squares.forEach(square => square.addEventListener('drageleave', dragLeave))
        squares.forEach(square => square.addEventListener('drop', dragDrop))

        document.getElementById('clickNextLevel').addEventListener('click', clickNextLevel)

        function dragStart(){
            colorBeingDragged = this.style.backgroundImage
            squareIdBeingDragged = parseInt(this.id)

        }

        function dragOver(e) {
            e.preventDefault()
        }

        function dragEnter(e) {
            e.preventDefault()
        }

        function dragLeave() {
            this.style.backgroundImage = ''
        }

        function dragDrop() {
            colorBeingReplaced = this.style.backgroundImage
            squareIdBeingReplaced = parseInt(this.id)
            this.style.backgroundImage = colorBeingDragged
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced
        }

        function dragEnd() {
            //check move
            let validMoves = [squareIdBeingDragged -1 , squareIdBeingDragged -width, squareIdBeingDragged +1, squareIdBeingDragged +width]
            let validMove = validMoves.includes(squareIdBeingReplaced)

            if (squareIdBeingReplaced && validMove)
            {
                --moves;
                movesDisplay.innerHTML = moves;

                squareIdBeingReplaced = null
            }  else if (squareIdBeingReplaced && !validMove)
            {
                squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced
                squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged
            } else  squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged
        }

//drop candies once some have been cleared
        function moveIntoSquareBelow() {
            for (let i = 0; i < 55; i ++) {
                if(squares[i + width].style.backgroundImage === '') {
                    squares[i + width].style.backgroundImage = squares[i].style.backgroundImage
                    squares[i].style.backgroundImage = ''
                    const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
                    const isFirstRow = firstRow.includes(i)
                    if (isFirstRow && (squares[i].style.backgroundImage === '')) {
                        let randomColor = Math.floor(Math.random() * candyColors.length)
                        squares[i].style.backgroundImage = candyColors[randomColor]
                    }
                }
            }
        }


        ///Checking for Matches
        //for row of Four
        function checkRowForFour() {
            for (let i = 0; i < 60; i ++) {
                let rowOfFour = [i, i+1, i+2, i+3]
                let decidedColor = squares[i].style.backgroundImage
                const isBlank = squares[i].style.backgroundImage === ''

                const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55]
                if (notValid.includes(i)) continue

                if(rowOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank))
                {
                    score += 100
                    scoreDisplay.innerHTML = score
                    rowOfFour.forEach(index => {
                        squares[index].style.backgroundImage = ''
                    })
                }
            }
        }
        checkRowForFour()
        //for column of Four
        function checkColumnForFour() {
            for (let i = 0; i < 39; i ++) {
                let columnOfFour = [i, i+width, i+width*2, i+width*3]
                let decidedColor = squares[i].style.backgroundImage
                const isBlank = squares[i].style.backgroundImage === ''

                if(columnOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                    score += 100
                    scoreDisplay.innerHTML = score
                    columnOfFour.forEach(index => {
                        squares[index].style.backgroundImage = ''
                    })
                }
            }
        }

        //for row of Three
        function checkRowForThree() {
            for (let i = 0; i < 61; i ++) {
                let rowOfThree = [i, i+1, i+2]
                let decidedColor = squares[i].style.backgroundImage
                const isBlank = squares[i].style.backgroundImage === ''

                const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55]
                if (notValid.includes(i)) continue

                if(rowOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                    score += 20
                    scoreDisplay.innerHTML = score
                    rowOfThree.forEach(index => {
                        squares[index].style.backgroundImage = ''
                    })
                }
            }
        }

        //for column of Three
        function checkColumnForThree() {
            for (let i = 0; i < 47; i ++) {
                let columnOfThree = [i, i+width, i+width*2]
                let decidedColor = squares[i].style.backgroundImage
                const isBlank = squares[i].style.backgroundImage === ''

                if(columnOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                    score += 20
                    scoreDisplay.innerHTML = score
                    columnOfThree.forEach(index => {
                        squares[index].style.backgroundImage = ''
                    })
                }
            }
        }


        function checkScore()
        {
            if(score>= 300 + countLevel*50)
            {
                score =0
                countLevel++;
                document.getElementById('page2').style.display = 'none'
                document.getElementById('level').style.display = 'block'
            }
        }

        function checkMoves()
        {
            if( countLevel === 3)
            {
                document.getElementById('page2').style.display = 'none'
                document.getElementById('level').style.display = 'block'
                 var msg = document.getElementById('clickNextLevel')
                 msg.innerText= 'You Win !'
                window.setInterval(()=>{ window.location.href='startGame.html'} ,4000 )

            }

            else if(moves <=0)
            {
                document.getElementById('msgBox').style.display = 'block';
                window.setInterval(()=>{ window.location.href='startGame.html'} ,4000 )
            }
        }

        function clickNextLevel()
        {
            const p2= document.getElementById('page2');
            p2.style.display = 'block'
            p2.setAttribute('style', "background=\"images/candy-crush-background-2.png\"")
            document.getElementById('level').style.display = 'none'
            grid.innerHTML = ''
            squares = []

            moves = 30 - countLevel*5
            movesDisplay.innerHTML = moves
            createBoard()
            clearInterval(interval)

            squares.forEach(square => square.removeEventListener('dragstart', dragStart))
            squares.forEach(square => square.removeEventListener('dragend', dragEnd))
            squares.forEach(square => square.removeEventListener('dragover', dragOver))
            squares.forEach(square => square.removeEventListener('dragenter', dragEnter))
            squares.forEach(square => square.removeEventListener('drageleave', dragLeave))
            squares.forEach(square => square.removeEventListener('drop', dragDrop))

            squares.forEach(square => square.addEventListener('dragstart', dragStart))
            squares.forEach(square => square.addEventListener('dragend', dragEnd))
            squares.forEach(square => square.addEventListener('dragover', dragOver))
            squares.forEach(square => square.addEventListener('dragenter', dragEnter))
            squares.forEach(square => square.addEventListener('drageleave', dragLeave))
            squares.forEach(square => square.addEventListener('drop', dragDrop))

            window.setInterval(function(){
                checkRowForFour()
                checkColumnForFour()
                checkRowForThree()
                checkColumnForThree()
                moveIntoSquareBelow()
                checkScore()
                checkMoves()
            }, 200);

        }

        function startGame() {
            // Checks carried out indefintely - Add Butotn to clear interval for best practise
             interval =  setInterval(function(){
                checkRowForFour()
                checkColumnForFour()
                checkRowForThree()
                checkColumnForThree()
                moveIntoSquareBelow()
                checkScore()
                checkMoves()
            }, 100);

        }


    startGame()
})