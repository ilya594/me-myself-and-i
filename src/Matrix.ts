
class Matrix {

    private _enabled: boolean;
    private _page: any;
    private _container: any;
    private _graphic: HTMLCanvasElement;

    private _interval: any;
    private _timeout: any;

    private text =  [
    {
        part: "WELCOME TO THE MATRIX",
        font: "28px 'Courier New', monospace",
        color: "#000000ff",
        align: "center"
    },
    {
        part: "System Initializing...\nLoading protocols",
        font: "18px monospace",
        color: "#000000ff",
        align: "center"
    },
    {
        part: "User: Neo\nAccess: Granted",
        font: "16px monospace",
        color: "#000000ff",
        align: "center"
    }
];
    /*`За час своєї діяльності пан Віталій реалізував чимало важливих ініціатив, спрямованих на розвиток економіки міста,\n` +        
                    `підтримку підприємництва та створення сприятливих умов для інвестицій.\n` +
                    `Компетентність, відданість справі та професійний підхід Віталія Люшина стали вагомим внеском у зміцнення та розвиток Рівненської громади.\n` +
                    `Тож бажаємо успіхів та нових професійних досягнень! - написали на сторінці міської ради. Нагадаємо, Віталія Люшина призначили'\n'` +
                    `на посаду керівника Департаменту економічного розвитку Віталія Люшина у серпні 2024 року.\n` + 
                    `Довідково: Віталій Люшин народився 13 квітня 1977 року в селі Колодязне Березнівського району Рівненської області. Громадянин України.\n` + 
                    `Освіта: вища, закінчив у 2001 році Рівненський державний технічний університет за спеціальністю „Землевпорядкування та кадастр”,\n` + 
                    `здобувши кваліфікацію інженера-землевпорядника. У 2015 році здобув науковий ступінь кандидата економічних наук.\n` +
                    `З липня 2009 року по грудень 2015 року – директор Державного підприємства „Рівненський науково-дослідний та проектний' інститут землеустрою”.\n` +
                    `З лютого 2016 року по квітень 2016 року – фізична особа-підприємець.\n` +
                    `З липня 2016 року по березень 2017 року працював на посаді директора технічного ТзОВ „Березне-Землемір”.\n` +
                    `З 27 березня 2017 року розпорядженням Президента України був призначений головою Березнівської районної державної адміністрації Рівненської області.`;*/

    constructor() {

    }

    public initialize = async () => {

        this._page = document.getElementById("view-page");

        this._container = document.createElement("div");
        this._container.id = "container";
        this._container.width = "100%";
        this._container.style.setProperty('z-index', '9999');
        this._container.style.setProperty("position", "absolute");

        this._graphic = document.createElement("canvas"); this._container.appendChild(this._graphic);

        document.onmousemove = () => this.hide();

        //      Controls.addEventListener(Events.CHANGE_TRACE_VISIBILITY, () => { 
        //           this._enabled = !this._enabled; 
        //          if (this._enabled) this.will();
        //       });

        return this;
    }

    public show = () => {
        if (!this.exists()) {
            this._page.appendChild(this._container);
            //this.matrixEffect(this._graphic);     
            this.drawTextWithAdvancedStyledParts(this._graphic);
        }
    }

    public hide = () => {
        if (this.exists()) {
            this._graphic.getContext("2d").clearRect(0, 0, window.innerWidth, window.innerHeight);
            this._page.removeChild(this._container);
            clearInterval(this._interval);
            clearTimeout(this._timeout);

            this.will();
        }
    }

    private will = () => {
        clearTimeout(this._timeout);
        return (this._timeout = setTimeout(() => this.show(), 10000));
    }

    private exists = () => {
        return document.getElementById("view-page") && document.getElementById("container");
    }

/*

    drawTextWithSimpleCycle = (canvas = this._graphic, startCol = 10, startRow = 30) => {
        const text = `<div class=ds-markdown" style="--ds - md - zoom: 1.143; "><p class="ds - markdown - paragraph"><span>Отличный и очень глубокий вопрос!</span></p><p class="ds - markdown - paragraph"><span>Если отвечать коротко: </span><strong><span>Да, для большинства семей распределение полов в многодетных семьях вписывается в равномерное распределение и объясняется законами вероятности и случайности.</span></strong><span> Однако есть нюансы, которые создают иллюзию обратного.</span></p><p class="ds - markdown - paragraph"><span>Давайте разберем подробнее.</span></p><h3><span>1. Теория вероятности и "Закон больших чисел"</span></h3><p class="ds - markdown - paragraph"><span>Представьте, что вы подбрасываете идеальную монетку. Вероятность выпадения "орла" (мальчик) или "решки" (девочка) составляет 50%. Но если вы подбросите монетку 10 раз, вполне возможно получить, например, 7 "орлов" и 3 "решки". Это </span><strong><span>случайное отклонение</span></strong><span>.</span></p><p class="ds - markdown - paragraph"><span>То же самое происходит в семьях. Рождение ребенка — это независимое событие. Пол предыдущего ребенка не влияет на пол следующего. Вероятность каждого раза составляет ~50% (на самом деле, чуть больше мальчиков рождается на свет, примерно 105 на 100 девочек, но для упрощения будем считать 50/50).</span></p><p class="ds - markdown - paragraph"><span>В многодетной семье, скажем, с 5 детьми, вполне возможны комбинации:</span></p><ul><li><p class="ds - markdown - paragraph"><span>5 мальчиков</span></p></li><li><p class="ds - markdown - paragraph"><span>4 мальчика + 1 девочка</span></p></li><li><p class="ds - markdown - paragraph"><span>3 мальчика + 2 девочки</span></p></li><li><p class="ds - markdown - paragraph"><span>и т.д.</span></p></li></ul><p class="ds - markdown - paragraph"><span>Чем больше детей в семье, тем больше возможных комбинаций. Комбинация "все одного пола" (например, 5 мальчиков) статистически маловероятна, но возможна и встречается.</span></p><p class="ds - markdown - paragraph"><strong><span>Закон больших чисел</span></strong><span> гласит: чем больше испытаний (в нашем случае, рождений), тем ближе реальное соотношение будет к теоретической вероятности (50/50). Но это работает для большой совокупности (например, для всей страны статистика будет почти 50/50), а для одной конкретной семьи с ее небольшим количеством "испытаний" вполне нормальны значительные отклонения.</span></p><h3><span>2. Почему кажется, что это не так? (Иллюзии и исключения)</span></h3><p class="ds - markdown - paragraph"><span>Есть несколько причин, по которым может создаваться впечатление, что распределение не случайно:</span></p><p class="ds - markdown - paragraph"><strong><span>а) Когнитивные искажения:</span></strong></p><ul><li><p class="ds - markdown - paragraph"><strong><span>Эффект выборочного внимания:</span></strong><span> Семья с 4 девочками гораздо более заметна и запоминается, чем семья с 2 мальчиками и 2 девочками. О ней чаще говорят: "Ого, смотри, у них все девочки!". На обычные семьи с смешанным составом не обращают внимания, и они остаются "невидимыми". Это искажает восприятие.</span></p></li><li><p class="ds - markdown - paragraph"><strong><span>Эффект кластеризации:</span></strong><span> Наш мозг склонен искать закономерности даже в случайных данных. Последовательность Р-Р-Р-Р (девочка-девочка-девочка-девочка) кажется нам особенной, хотя ее вероятность точно такая же, как и у последовательности М-Р-М-Р.</span></p></li></ul><p class="ds - markdown - paragraph"><strong><span>б) Биологические факторы (очень редко):</span></strong><span></span><br><span>В исключительных случаях может существовать </span><strong><span>генетическая предрасположенность</span></strong><span> в рамках конкретной семьи. Есть гипотезы и немногочисленные исследования, которые предполагают, что некоторые мужчины могут производить сперматозоиды с X- или Y-хромосомой в неравном соотношении. Это могло бы объяснять, почему в некоторых семьях из поколения в поколение рождаются в основном мальчики или в основном девочки. Однако это </span><strong><span>не является доказанной и распространенной нормой</span></strong><span>. Для подавляющего большинства людей соотношение X и Y сперматозоидов примерно равное.</span></p><p class="ds - markdown - paragraph"><strong><span>в) Социальные факторы:</span></strong><span></span><br><span>В культурах, где важен пол ребенка (например, предпочтение сыновей), семьи, у которых продолжают рождаться девочки, будут </span><strong><span>продолжать尝试ствовать зачать ребенка</span></strong><span> до тех пор, пока не появится мальчик. В результате такие семьи становятся многодетными с бОльшим числом девочек и одним мальчиком в конце. Это не нарушение вероятности, а сознательное или социально обусловленное поведение, влияющее на итоговый состав семьи.</span></p><h3><span>Итог:</span></h3><ol start="1"><li><p class="ds - markdown - paragraph"><strong><span>В масштабе всего населения</span></strong><span> распределение полов близко к равномерному (с небольшим перевесом в сторону мальчиков при рождении).</span></p></li><li><p class="ds - markdown - paragraph"><strong><span>В отдельно взятой многодетной семье</span></strong><span> состав детей может сильно отклоняться от идеала 50/50, и это </span><strong><span>нормальная работа случайности и вероятности</span></strong><span>. Семьи с детьми только одного пола — это статистическая редкость, но они существуют именно благодаря случайности.</span></p></li><li><p class="ds - markdown - paragraph"><strong><span>Восприятие неравномерности</span></strong><span> возникает из-за того, что мы больше замечаем "необычные" семьи и игнорируем "обычные".</span></p></li></ol><p class="ds - markdown - paragraph"><span>Так что, если вы видите семью с пятью мальчиками, с огромной вероятностью это просто </span><strong><span>удачная (или не очень для родителей) шутка природы и теории вероятностей</span></strong><span>, а не какой-то мистический или генетический закон.</span></p></div>`;
        const context = canvas.getContext("2d", { willReadFrequently: true });
                        const w = (canvas.width = window.innerWidth);
        const h = (canvas.height = window.innerHeight);
    context.fillStyle = "#00ff00";
    context.font = "16px monospace";
    
    const charWidth = 10;
    const lineHeight = 20;
    let currentCol = startCol;
    let currentRow = startRow;
    let index = 0;
    
    function getRandomChar() {
        return 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 52)];
    }
    
    function drawNextChar() {
        if (index >= text.length) return;
        
        const finalChar = text[index];
        const col = currentCol;
        const row = currentRow;
        let cycle = 0;
        const maxCycles = 7;
        
        function cycleChar() {
            if (cycle < maxCycles) {
                // Clear and draw random char
                context.clearRect(col - 1, row - 16, charWidth + 2, 21);
                context.fillText(getRandomChar(), col, row);
                cycle++;
                setTimeout(cycleChar, 250);
            } else {
                // Draw final character
                context.clearRect(col - 1, row - 16, charWidth + 2, 21);
                context.fillText(finalChar, col, row);
                
                // Move to next position
                if (finalChar === '\n') {
                    currentCol = startCol;
                    currentRow += lineHeight;
                } else {
                    currentCol += charWidth;
                    if (currentCol + charWidth > canvas.width - 10) {
                        currentCol = startCol;
                        currentRow += lineHeight;
                    }
                }
                
                index++;
                if (index < text.length) {
                    setTimeout(drawNextChar, 20);
                }
            }
        }
        
        cycleChar();
    }
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawNextChar();
}

private drawTextWithAdvancedWordCycle = (canvas = this._graphic, options: any = {}) => {
    const {
        startCol = 10,
        startRow = 30,
        wordTimeout = 20,
        cycleCount = 3,
        cycleTimeout = 10,
        textColor = "#000700ff",
        fontSize = "16px",
        fontFamily = "monospace",
        onComplete = null
    } = options;
    
    const text = `За час своєї діяльності пан Віталій реалізував чимало важливих ініціатив, спрямованих на розвиток економіки міста, підтримку підприємництва та створення сприятливих умов для інвестицій.

Компетентність, відданість справі та професійний підхід Віталія Люшина стали вагомим внеском у зміцнення та розвиток Рівненської громади.

Тож бажаємо успіхів та нових професійних досягнень! - написали на сторінці міської ради. Нагадаємо, Віталія Люшина призначили на посаду керівника Департаменту економічного розвитку Віталія Люшина у серпні 2024 року.

Довідково: Віталій Люшин народився 13 квітня 1977 року в селі Колодязне Березнівського району Рівненської області. Громадянин України.

Освіта: вища, закінчив у 2001 році Рівненський державний технічний університет за спеціальністю „Землевпорядкування та кадастр”, здобувши кваліфікацію інженера-землевпорядника. У 2015 році здобув науковий ступінь кандидата економічних наук.

З липня 2009 року по грудень 2015 року – директор Державного підприємства „Рівненський науково-дослідний та проектний інститут землеустрою”.

З лютого 2016 року по квітень 2016 року – фізична особа-підприємець.

З липня 2016 року по березень 2017 року працював на посаді директора технічного ТзОВ „Березне-Землемір”.

З 27 березня 2017 року розпорядженням Президента України був призначений головою Березнівської районної державної адміністрації Рівненської області.`;
        const context = canvas.getContext("2d", { willReadFrequently: true });
                        const w = (canvas.width = window.innerWidth);
        const h = (canvas.height = window.innerHeight);
    context.fillStyle = "#000000ff";
    context.font = "16px monospace";
    context.fillStyle = textColor;
    context.font = `${fontSize} ${fontFamily}`;
    
    const metrics = context.measureText("M");
    const charWidth = metrics.width;
    const lineHeight = parseInt(fontSize) * 1.2;
    
    let currentCol = startCol;
    let currentRow = startRow;
    
    // Split text into words and punctuation
    const wordRegex = /(\w+|[^\w\s]|\s+)/g;
    const tokens = text.match(wordRegex) || [];
    let tokenIndex = 0;
    
    function getRandomChar() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return chars[Math.floor(Math.random() * chars.length)];
    }
    
    //@ts-ignore
    function drawCharAtPosition(char, col, row) {
        context.clearRect(col - 1, row - parseInt(fontSize), charWidth + 2, parseInt(fontSize) + 5);
        context.fillText(char, col, row);
    }
    
    function processToken() {
        if (tokenIndex >= tokens.length) {
            if (onComplete) onComplete();
            return;
        }
        
        const token = tokens[tokenIndex];
        const isWhitespace = /^\s+$/.test(token);
        
        if (isWhitespace) {
            // Just draw whitespace immediately without cycling
            for (let i = 0; i < token.length; i++) {
                if (token[i] === ' ') {
                    currentCol += charWidth;
                } else if (token[i] === '\n') {
                    currentCol = startCol;
                    currentRow += lineHeight;
                }
                
                // Handle line wrapping
                if (currentCol + charWidth > canvas.width - 10) {
                    currentCol = startCol;
                    currentRow += lineHeight;
                }
            }
            
            tokenIndex++;
            setTimeout(processToken, 50);
            return;
        }
        
        // Process word or punctuation with cycling effect
            //@ts-ignore
        const charPositions = [];
        let tempCol = currentCol;
        
        for (let i = 0; i < token.length; i++) {
            charPositions.push({ col: tempCol, row: currentRow });
            tempCol += charWidth;
            
            if (tempCol + charWidth > canvas.width - 10) {
                tempCol = startCol;
                currentRow += lineHeight;
            }
        }
        
        let charIndex = 0;
        let cycleIndex = 0;
        
        function cycleToken() {
            if (cycleIndex < cycleCount) {
                // Draw random characters for the entire token
                for (let i = 0; i < token.length; i++) {
                        //@ts-ignore
                    drawCharAtPosition(getRandomChar(), charPositions[i].col, charPositions[i].row);
                }
                cycleIndex++;
                setTimeout(cycleToken, cycleTimeout);
            } else {
                // Finalize current character
                if (charIndex < token.length) {
                        //@ts-ignore
                    drawCharAtPosition(token[charIndex], charPositions[charIndex].col, charPositions[charIndex].row);
                    charIndex++;
                    setTimeout(cycleToken, cycleTimeout / 2);
                } else {
                    // Token completed, move to next
                        //@ts-ignore
                    currentCol = charPositions[charPositions.length - 1].col + charWidth;
                    tokenIndex++;
                    
                    if (tokenIndex < tokens.length) {
                        setTimeout(processToken, wordTimeout);
                    } else {
                        if (onComplete) onComplete();
                    }
                }
            }
        }
        
        cycleToken();
    }
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    processToken();
}

private drawTextWithLineCycle = (canvas = this._graphic, options: any = {}) => {
    const {
        startCol = 10,
        startRow = 30,
        lineTimeout = 20,
        cycleCount = 10,
        cycleTimeout = 20,
        textColor = "#00ff00",
        fontSize = "16px",
        fontFamily = "monospace",
        onComplete = null
    } = options;
    
    const text = `За час своєї діяльності пан Віталій реалізував чимало важливих ініціатив, спрямованих на розвиток економіки міста, підтримку підприємництва та створення сприятливих умов для інвестицій.

Компетентність, відданість справі та професійний підхід Віталія Люшина стали вагомим внеском у зміцнення та розвиток Рівненської громади.

Тож бажаємо успіхів та нових професійних досягнень! - написали на сторінці міської ради. Нагадаємо, Віталія Люшина призначили на посаду керівника Департаменту економічного розвитку Віталія Люшина у серпні 2024 року.

Довідково: Віталій Люшин народився 13 квітня 1977 року в селі Колодязне Березнівського району Рівненської області. Громадянин України.

Освіта: вища, закінчив у 2001 році Рівненський державний технічний університет за спеціальністю „Землевпорядкування та кадастр”, здобувши кваліфікацію інженера-землевпорядника. У 2015 році здобув науковий ступінь кандидата економічних наук.

З липня 2009 року по грудень 2015 року – директор Державного підприємства „Рівненський науково-дослідний та проектний інститут землеустрою”.

З лютого 2016 року по квітень 2016 року – фізична особа-підприємець.

З липня 2016 року по березень 2017 року працював на посаді директора технічного ТзОВ „Березне-Землемір”.

З 27 березня 2017 року розпорядженням Президента України був призначений головою Березнівської районної державної адміністрації Рівненської області.`;
        const context = canvas.getContext("2d", { willReadFrequently: true });
                        const w = (canvas.width = window.innerWidth);
        const h = (canvas.height = window.innerHeight);
    context.fillStyle = "#000000ff";
    context.font = "16px monospace";
    
    // Measure text for accurate positioning
    const metrics = context.measureText("M");
    const charWidth = metrics.width;
    const lineHeight = parseInt(fontSize) * 1.2;
    
    let currentCol = startCol;
    let currentRow = startRow;
    let lineIndex = 0;
    
    // Split text into lines
    const lines = text.split('\n');
    
    // Function to generate random character (a-z, A-Z)
    function getRandomChar() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return chars[Math.floor(Math.random() * chars.length)];
    }
    
    //@ts-ignore
    function drawCharAtPosition(char, col, row) {
        // Clear previous character area
        context.clearRect(col - 1, row - parseInt(fontSize), charWidth + 2, parseInt(fontSize) + 5);
        context.fillText(char, col, row);
    }
    
        //@ts-ignore
    function processLine(line) {
        if (lineIndex >= lines.length) {
            if (onComplete) onComplete();
            return;
        }
        
        const currentLine = lines[lineIndex];
        let charIndex = 0;
            //@ts-ignore
        const charPositions = [];
        
        // Calculate all character positions first
        let tempCol = currentCol;
        for (let i = 0; i < currentLine.length; i++) {
            charPositions.push({ col: tempCol, row: currentRow });
            tempCol += charWidth;
            
            // Handle line wrapping within the line
            if (tempCol + charWidth > canvas.width - 10) {
                tempCol = startCol;
                currentRow += lineHeight;
            }
        }
        
        function processCharacter() {
            if (charIndex >= currentLine.length) {
                // Move to next line after all characters in current line are done
                currentCol = startCol;
                currentRow += lineHeight;
                lineIndex++;
                
                if (lineIndex < lines.length) {
                    setTimeout(() => processLine(lines[lineIndex]), lineTimeout);
                } else {
                    if (onComplete) onComplete();
                }
                return;
            }
            
            const finalChar = currentLine[charIndex];
                //@ts-ignore
            const position = charPositions[charIndex];
            let cycleIndex = 0;
            
            function cycleRandomChars() {
                if (cycleIndex < cycleCount) {
                    // Draw random character for all subsequent characters that haven't been finalized yet
                    for (let i = charIndex; i < currentLine.length; i++) {
                        const randomChar = getRandomChar();
                            //@ts-ignore
                        drawCharAtPosition(randomChar, charPositions[i].col, charPositions[i].row);
                    }
                    
                    cycleIndex++;
                    setTimeout(cycleRandomChars, cycleTimeout);
                } else {
                    // Draw final character for this position
                    drawCharAtPosition(finalChar, position.col, position.row);
                    
                    // For all previous characters, make sure they stay as their final characters
                    for (let i = 0; i < charIndex; i++) {
                            //@ts-ignore
                        drawCharAtPosition(currentLine[i], charPositions[i].col, charPositions[i].row);
                    }
                    
                    charIndex++;
                    processCharacter();
                }
            }
            
            // Start the cycling effect for this character and all following ones in the line
            cycleRandomChars();
        }
        
        // Start processing the first character of the line
        processCharacter();
    }
    
    // Clear canvas and start
    context.clearRect(0, 0, canvas.width, canvas.height);
    processLine(lines[0]);
}


private drawTextWithSimpleLineCycle(canvas = this._graphic, startCol = 10, startRow = 30) {
  const text = `За час своєї діяльності пан Віталій реалізував чимало важливих ініціатив, спрямованих на розвиток економіки міста,\n` +        
                    `підтримку підприємництва та створення сприятливих умов для інвестицій.\n` +
                    `Компетентність, відданість справі та професійний підхід Віталія Люшина стали вагомим внеском у зміцнення та розвиток Рівненської громади.\n` +
                    `Тож бажаємо успіхів та нових професійних досягнень! - написали на сторінці міської ради. Нагадаємо, Віталія Люшина призначили'\n'` +
                    `на посаду керівника Департаменту економічного розвитку Віталія Люшина у серпні 2024 року.\n` + 
                    `Довідково: Віталій Люшин народився 13 квітня 1977 року в селі Колодязне Березнівського району Рівненської області. Громадянин України.\n` + 
                    `Освіта: вища, закінчив у 2001 році Рівненський державний технічний університет за спеціальністю „Землевпорядкування та кадастр”,\n` + 
                    `здобувши кваліфікацію інженера-землевпорядника. У 2015 році здобув науковий ступінь кандидата економічних наук.\n` +
                    `З липня 2009 року по грудень 2015 року – директор Державного підприємства „Рівненський науково-дослідний та проектний' інститут землеустрою”.\n` +
                    `З лютого 2016 року по квітень 2016 року – фізична особа-підприємець.\n` +
                    `З липня 2016 року по березень 2017 року працював на посаді директора технічного ТзОВ „Березне-Землемір”.\n` +
                    `З 27 березня 2017 року розпорядженням Президента України був призначений головою Березнівської районної державної адміністрації Рівненської області.`;
        const context = canvas.getContext("2d", { willReadFrequently: true });
                        const w = (canvas.width = window.innerWidth);
        const h = (canvas.height = window.innerHeight);
    context.fillStyle = "#000000ff";
    context.font = "16px monospace";
    
    const charWidth = 10;
    const lineHeight = 20;
    const lines = text.split('\n');
    let lineIndex = 0;
    let currentRow = startRow;
    
    function getRandomChar() {
        return 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 52)];
    }
    
    function processLine() {
        if (lineIndex >= lines.length) return;
        
        const line = lines[lineIndex];
        let cycle = 0;
        const maxCycles = 10;
        //@ts-ignore
        const charPositions = [];
        
        // Calculate character positions
        let currentCol = startCol;
        for (let i = 0; i < line.length; i++) {
            charPositions.push(currentCol);
            currentCol += charWidth;
        }
        
        function cycleLine() {
            if (cycle < maxCycles) {
                // Clear the line area
                context.clearRect(startCol - 5, currentRow - 18, canvas.width - startCol, 22);
                
                // Draw random characters for entire line
                for (let i = 0; i < line.length; i++) {
                            //@ts-ignore
                    context.fillText(getRandomChar(), charPositions[i], currentRow);
                }
                
                cycle++;
                setTimeout(cycleLine, 20);
            } else {
                // Draw final line
                context.clearRect(startCol - 5, currentRow - 18, canvas.width - startCol, 22);
                for (let i = 0; i < line.length; i++) {
                            //@ts-ignore
                    context.fillText(line[i], charPositions[i], currentRow);
                }
                
                // Move to next line
                currentRow += lineHeight;
                lineIndex++;
                
                if (lineIndex < lines.length) {
                    setTimeout(processLine, 120);
                }
            }
        }
        
        cycleLine();
    }
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    processLine();
}
*/

    private matrixEffect(canvas: HTMLCanvasElement, font = 24) {

        const context = canvas.getContext("2d", { willReadFrequently: true });
        const w = (canvas.width = window.innerWidth);
        const h = (canvas.height = window.innerHeight);



        const str = "А+Б0ƓВڲ-Г1Д=Е2Ё Ж3З И4Йۺ К5Лإ М6Нڧ О7П ۴ڟ Ф!ڮХ ЦÛ?Ч ƪШ.іагb н ьцск бйщцгу ритй" +
            "шлщшб пр,Ы Ь:ЭЮ;ڿڿڦЯ 开儿 艾  诶Ƣ 开伊 艾2 艾ƕڪ   西Ý 吉 3艾 %$艾 伊4 ¿ 67 娜% ڠ伊" +
            "6a bcƜ dٿefïo#pؠ-qrstu &v* ڜ wxy3z ¼ ¾ æè ƩỺ ʭʩʥ˩˩ͼ  ͽͽΔΔΔΔω ϘϠ ϠϡϢϧ Ϩ ϬϬϪЉЊ" +
            "1871640532 1 udp 1677729535 188.212777 typ srflx raddr 0.0.0.0 rport 0 generation 0" +
            "ufrag AfOL network-coe:832498458 1 udp 1677729535 4147.105 55549 typ srflx" +
            " raddr 0.0.0.0 rport 0 generation 0 ufrag 4W3O ne ϲτ χ κ ͷρ φ 	π314 ʏ ƙ ɜ ӆ ϰ ƴ" +
            "и̷ ய ౦ ӥ ❡ ㄐ и̷ௐ ჯ ய౦? ቀ 	ჶ ෲ? ƿ ᗱ ㄏ ㄨ ȹ Ⴏ ȝ Κ Ͷ Λ  Ο Φ Η БΛЯΤЬ ❞૱ઐᙓዘҚ☯" +
            " нaχƴй ㄨㄦ੦ഠ〇ㄇㄐ૯ㄏㄏ πiȝgyютьㄇㄈ ㄋ ㄏ ㄐ ㄒ	ㄗ ㄙ ㄚ	 ㄤ ㄥ ㄦ ㄨ ㄩ	4TG";

        const matrix = str.split("");

        let cols = w / font;
        let pool: any = [];

        for (let i = 0; i < cols; i++) pool[i] = 1;

        const draw = () => {

            context.fillStyle = "rgba(0,0,0,.05)";
            context.fillRect(0, 0, w, h);

            context.fillStyle = "#00ff00";

            //     if (Math.random() > 0.9955) {
            //         context.fillStyle = "#f00";
            //      }
            context.font = font + "px system-ui";

            for (let i = 0; i < pool.length; i++) {

                const txt = matrix[Math.floor(Math.random() * matrix.length)];

                context.fillText(txt, i * font, pool[i] * font);

                if (pool[i] * font > h/* && Math.random() > 0.95*/) pool[i] = 0;

                pool[i]++;
            }
        }

        this._interval = setInterval(draw, 77);
    }

    /*private drawTextWithSimpleTimedLineCycle = (canvas = this._graphic,  options: any = {}) => {


        const text = `За час своєї діяльності пан Віталій реалізував чимало важливих ініціатив, спрямованих на розвиток економіки міста,'\n'` +        
                    `підтримку підприємництва та створення сприятливих умов для інвестицій.'\n'` +
                    `Компетентність, відданість справі та професійний підхід Віталія Люшина стали вагомим внеском у зміцнення та розвиток Рівненської громади.'\n'` +
                    `Тож бажаємо успіхів та нових професійних досягнень! - написали на сторінці міської ради. Нагадаємо, Віталія Люшина призначили'\n'` +
                    `на посаду керівника Департаменту економічного розвитку Віталія Люшина у серпні 2024 року.'\n'` + 
                    `Довідково: Віталій Люшин народився 13 квітня 1977 року в селі Колодязне Березнівського району Рівненської області. Громадянин України.'\n'` + 
                    `Освіта: вища, закінчив у 2001 році Рівненський державний технічний університет за спеціальністю „Землевпорядкування та кадастр”,'\n'` + 
                    `здобувши кваліфікацію інженера-землевпорядника. У 2015 році здобув науковий ступінь кандидата економічних наук.'\n'` +
                    `З липня 2009 року по грудень 2015 року – директор Державного підприємства „Рівненський науково-дослідний та проектний' інститут землеустрою”.'\n'` +
                    `З лютого 2016 року по квітень 2016 року – фізична особа-підприємець.'\n'` +
                    `З липня 2016 року по березень 2017 року працював на посаді директора технічного ТзОВ „Березне-Землемір”.'\n'` +
                    `З 27 березня 2017 року розпорядженням Президента України був призначений головою Березнівської районної державної адміністрації Рівненської області.'\n'`;

    
        // Set canvas to full window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const {
        startCol = 10, // Increased default for better margins
        startRow = 30, // Increased default for better margins
        effectCompletionTime = 1000,
        cycleCount = 10,
        cycleTimeout = 20,
        textColor = "#000000ff",
        fontSize = "18px", // Slightly larger for better readability on full screen
        fontFamily = "monospace",
        margin = 20, // Margin from edges
        onComplete = null,
        onLineStart = null,
        onLineEnd = null
    } = options;
    
    const context = canvas.getContext("2d", { willReadFrequently: true });

        context.fillStyle = "#000000ff";
    context.font = "16px monospace";
    // Measure text for accurate positioning
    const metrics = context.measureText("M");
    const charWidth = metrics.width;
    const lineHeight = parseInt(fontSize) * 1.2; // Increased line height for full screen
    
    let currentCol = startCol;
    let currentRow = startRow;
    let lineIndex = 0;
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    // Calculate available width for text wrapping
    const maxWidth = canvas.width - margin * 2;
    
    // Calculate time per line based on total completion time
    const lineTimeout = Math.max(500, Math.floor(effectCompletionTime / Math.max(1, lines.length)));
    const interLineDelay = Math.min(200, Math.floor(lineTimeout * 0.15));
    
    function getRandomChar() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return chars[Math.floor(Math.random() * chars.length)];
    }
    
    //@ts-ignore
    function drawCharAtPosition(char, col, row) {
        // Clear a slightly larger area to prevent artifacts
        context.clearRect(col - 2, row - parseInt(fontSize) - 2, charWidth + 4, parseInt(fontSize) + 8);
        context.fillText(char, col, row);
    }
    
    function processLine() {
        if (lineIndex >= lines.length) {
            if (onComplete) onComplete();
            return;
        }
        
        const line = lines[lineIndex];
        if (onLineStart) onLineStart(lineIndex, line, lineTimeout);
        
            //@ts-ignore
        const charPositions = [];
        let tempCol = currentCol;
        let tempRow = currentRow;
        
        // Handle text wrapping for each character in the line
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            // Handle newlines within lines
            if (char === '\n') {
                tempCol = startCol;
                tempRow += lineHeight;
                continue;
            }
            
            // Check if we need to wrap to next line
            if (tempCol + charWidth > maxWidth) {
                tempCol = startCol;
                tempRow += lineHeight;
            }
            
            charPositions.push({ col: tempCol, row: tempRow, char: char });
            tempCol += charWidth;
        }
        
            //@ts-ignore
        let cycleInterval;
        let currentCycle = 0;
        const maxCycles = Math.max(5, Math.min(cycleCount, Math.floor(lineTimeout / cycleTimeout)));
        
        function cycleLine() {
            if (currentCycle < maxCycles) {
                // Draw random characters for all positions
                for (let i = 0; i < charPositions.length; i++) {
                        //@ts-ignore
                    drawCharAtPosition(getRandomChar(), charPositions[i].col, charPositions[i].row);
                }
                currentCycle++;
            } else {
                // Stop cycling and show final text
                    //@ts-ignore
                clearInterval(cycleInterval);
                for (let i = 0; i < charPositions.length; i++) {
                        //@ts-ignore
                    drawCharAtPosition(charPositions[i].char, charPositions[i].col, charPositions[i].row);
                }
            }
        }
        
        function finalizeAndMove() {
                //@ts-ignore
            clearInterval(cycleInterval);
            
            // Ensure final text is drawn
            for (let i = 0; i < charPositions.length; i++) {
                    //@ts-ignore
                drawCharAtPosition(charPositions[i].char, charPositions[i].col, charPositions[i].row);
            }
            
            if (onLineEnd) onLineEnd(lineIndex, line);
            
            // Update position for next line
            currentCol = startCol;
            currentRow = tempRow + lineHeight; // Move to next line position
            
            // Check if we're going off screen
            if (currentRow > canvas.height - margin) {
                // Reset to top if we reach bottom (optional: could pause or stop)
                currentRow = startRow;
            }
            
            lineIndex++;
            
            if (lineIndex < lines.length) {
                setTimeout(processLine, interLineDelay);
            } else {
                if (onComplete) onComplete();
            }
        }
        
        // Start the cycling effect
        cycleInterval = setInterval(cycleLine, cycleTimeout);
        
        // Set timeout to move to next line
        setTimeout(finalizeAndMove, lineTimeout);
    }
    
    // Clear canvas with a dark background for better contrast
    context.fillStyle = "#ffffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = textColor;
    
    // Handle window resize
    function handleResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        context.fillStyle = "#ffffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = textColor;
        context.font = `${fontSize} ${fontFamily}`;
    }
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    const cleanup = () => {
        window.removeEventListener('resize', handleResize);
    };
    
    if (lines.length > 0) {
        processLine();
    } else if (onComplete) {
        onComplete();
    }
    
    return cleanup; // Return cleanup function
}

private drawTextWithOverlappingLineCycle = (canvas = this._graphic, options: any = {}) => {
    const {
        startCol = 10,
        startRow = 30,
        lineTimeout = 2000,
        cycleCount = 10,
        cycleTimeout = 20,
        lineStartDelay = 100, // Delay before starting next line
        textColor = "#00ff00",
        fontSize = "16px",
        fontFamily = "monospace",
        onComplete = null
    } = options;
    
    const context = canvas.getContext("2d", { willReadFrequently: true });
                        const w = (canvas.width = window.innerWidth);
        const h = (canvas.height = window.innerHeight);
    context.fillStyle = "#000000ff";
    context.font = "16px monospace";
    
    const charWidth = 10;
    const lineHeight = 20;
    const lines = this.text.split('\n');
    let lineIndex = 0;
    let currentRow = startRow;
    
    // Store all line intervals for cleanup
    //@ts-ignore
    const lineIntervals = [];
        //@ts-ignore
    const lineTimeouts = [];
    
    function getRandomChar() {
        return 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 52)];
    }
        //@ts-ignore
    function processLine(lineIndex) {
        if (lineIndex >= lines.length) {
            // Check if all lines are done
            if (lineIndex === lines.length && onComplete) {
                setTimeout(onComplete, lineTimeout);
            }
            return;
        }
        
        const line = lines[lineIndex];
        let cycle = 0;
        const maxCycles = cycleCount;
            //@ts-ignore
        const charPositions = [];
        
        // Calculate character positions for this line
        let currentCol = startCol;
        for (let i = 0; i < line.length; i++) {
            charPositions.push(currentCol);
            currentCol += charWidth;
        }
        
        function drawRandomLine() {
            // Clear only this line's area
            context.clearRect(startCol - 5, currentRow - 18, canvas.width - startCol, 22);
            
            // Draw random characters for entire line
            for (let i = 0; i < line.length; i++) {
                    //@ts-ignore
                context.fillText(getRandomChar(), charPositions[i], currentRow);
            }
        }
        
        function drawFinalLine() {
            // Draw final text for this line
            for (let i = 0; i < line.length; i++) {
                    //@ts-ignore
                context.fillText(line[i], charPositions[i], currentRow);
            }
        }
        
        function cycleCurrentLine() {
            if (cycle < maxCycles) {
                drawRandomLine();
                cycle++;
            } else {
                // Stop cycling and show final text
                drawFinalLine();
                clearInterval(intervalId);
                
                // Remove from intervals array
                    //@ts-ignore
                const index = lineIntervals.indexOf(intervalId);
                if (index > -1) {
                        //@ts-ignore
                    lineIntervals.splice(index, 1);
                }
            }
        }
        
        // Start cycling for this line
        const intervalId = setInterval(cycleCurrentLine, cycleTimeout);
        lineIntervals.push(intervalId);
        
        // Set timeout to stop cycling and show final text for this line
        const timeoutId = setTimeout(() => {
            clearInterval(intervalId);
            drawFinalLine();
            
            // Remove from arrays
                //@ts-ignore
            const intervalIndex = lineIntervals.indexOf(intervalId);
            if (intervalIndex > -1) {
                    //@ts-ignore
                lineIntervals.splice(intervalIndex, 1);
            }
                //@ts-ignore
            const timeoutIndex = lineTimeouts.indexOf(timeoutId);
            if (timeoutIndex > -1) {
                    //@ts-ignore
                lineTimeouts.splice(timeoutIndex, 1);
            }
        }, lineTimeout);
        
        lineTimeouts.push(timeoutId);
        
        // Move to next line position
        currentRow += lineHeight;
        
        // Start next line after delay (if there are more lines)
        if (lineIndex + 1 < lines.length) {
            setTimeout(() => processLine(lineIndex + 1), lineStartDelay);
        }
    }
    
    // Clear canvas and start first line
    context.clearRect(0, 0, canvas.width, canvas.height);
    processLine(0);
    
    // Return cleanup function
    return () => {
            //@ts-ignore
        lineIntervals.forEach(clearInterval);
            //@ts-ignore
        lineTimeouts.forEach(clearTimeout);
    };
}*/



private drawTextWithAdvancedStyledParts(canvas = this._graphic, textParts = this.text, options: any = {}) {
    const {
        startCol = 20,
        startRow = 50,
        lineDuration = 2500,
        cycleSpeed = 25,
        lineSpacing = 120,
        defaultTextColor = "#000000ff",
        defaultFont = "18px monospace",
        backgroundColor = "#000000",
        onComplete = null,
        onPartStart = null,
        onPartEnd = null
    } = options;
    
   // const context = canvas.getContext("2d", { willReadFrequently: true });
            const context = canvas.getContext("2d", { willReadFrequently: true });
                        const w = (canvas.width = window.innerWidth);
        const h = (canvas.height = window.innerHeight);
    context.fillStyle = "#000000ff";
    context.font = "bold 16px monospace";
    // Set background
  //  context.fillStyle = backgroundColor;
  //  context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Process text parts with individual styles
    //@ts-ignore
    const animatedLines = [];
    let currentY = startRow;
        //@ts-ignore
    textParts.forEach((textPart, partIndex) => {
        const {
            part: text,
            font = defaultFont,
            color = defaultTextColor,
            align = "left",
            //@ts-ignore
            spacing = 0
        } = textPart;
        
        const lines = text.split('\n');
        const fontSize = parseInt(font);
            //@ts-ignore
        lines.forEach((line, lineIndex) => {
            if (line.trim().length > 0) {
                animatedLines.push({
                    text: line,
                    font,
                    color,
                    align,
                    y: currentY,
                    partIndex,
                    lineIndex
                });
            }
            currentY += fontSize * 1.5 + spacing;
        });
        
        // Add extra spacing after each part
        currentY += 10;
    });
    
    const activeAnimations = new Map();
    let completedCount = 0;
    
    function getRandomChar() {
            //@ts-ignore
        return 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 30)];
    }
        //@ts-ignore
    function startLineAnimation(lineData, index) {
        const { text, font, color, align, y, partIndex } = lineData;
        const startTime = Date.now();
        
        context.font = 'bold ' + font;
        context.fillStyle = color;
        const charWidth = context.measureText("M").width;
        const fontSize = parseInt(font);
        
        // Calculate starting position based on alignment
        let startX;
        const textWidth = text.length * charWidth;
        
        switch (align) {
            case "center":
                startX = (canvas.width - textWidth) / 2;
                break;
            case "right":
                startX = canvas.width - textWidth - startCol;
                break;
            default: // left
                startX = startCol;
        }
            //@ts-ignore
        const charPositions = [];
        let currentX = startX;
        for (let i = 0; i < text.length; i++) {
            charPositions.push(currentX);
            currentX += charWidth;
        }
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(1, elapsed / lineDuration);
            
            // Clear line area
            context.clearRect(0, y - fontSize - 5, canvas.width, fontSize + 10);
            
            if (progress < 1) {
                // Animation in progress - mix random and final chars
                for (let i = 0; i < text.length; i++) {
                    if (Math.random() > progress * 0.6) {
                            //@ts-ignore
                        context.fillText(getRandomChar(), charPositions[i], y);
                    } else {
                            //@ts-ignore
                        context.fillText(text[i], charPositions[i], y);
                    }
                }
            } else {
                // Animation complete
                clearInterval(intervalId);
                activeAnimations.delete(index);
                
                // Draw final text
                for (let i = 0; i < text.length; i++) {
                        //@ts-ignore
                    context.fillText(text[i], charPositions[i], y);
                }
                
                completedCount++;
                if (onPartEnd) onPartEnd(partIndex, text, font, color);
                
                if (completedCount === animatedLines.length && onComplete) {
                    onComplete();
                }
            }
        }
        
        if (onPartStart) onPartStart(partIndex, text, font, color);
        
        const intervalId = setInterval(animate, cycleSpeed);
        activeAnimations.set(index, { intervalId, startTime, y });
    }
    
    // Start all line animations
        //@ts-ignore
    animatedLines.forEach((lineData, index) => {
        setTimeout(() => {
            startLineAnimation(lineData, index);
        }, index * lineSpacing);
    });
    
    return () => {
        activeAnimations.forEach((animation, index) => {
            clearInterval(animation.intervalId);
            // Draw final state
                //@ts-ignore
            const lineData = animatedLines[index];
            context.font = lineData.font;
            context.fillStyle = lineData.color;
            
            const charWidth = context.measureText("M").width;
            let startX;
            const textWidth = lineData.text.length * charWidth;
            
            switch (lineData.align) {
                case "center":
                    startX = (canvas.width - textWidth) / 2;
                    break;
                case "right":
                    startX = canvas.width - textWidth - startCol;
                    break;
                default:
                    startX = startCol;
            }
            
            context.clearRect(0, lineData.y - parseInt(lineData.font) - 5, canvas.width, parseInt(lineData.font) + 10);
            for (let i = 0; i < lineData.text.length; i++) {
                context.fillText(lineData.text[i], startX + i * charWidth, lineData.y);
            }
        });
        activeAnimations.clear();
    };
}



}

export default new Matrix();