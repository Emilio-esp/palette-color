class Palette {
    constructor() {
        this.palette = document.querySelector('.palette_container');
        this.refreshBtn = document.getElementById('refresh-pallet');
        this.colorValEl = document.querySelectorAll('.palette__value');
        this.colorBlockEls = document.querySelectorAll('.palette__color-block');
        this.saveBtn = document.getElementById('save-palette');
        this.showLibrarybtn = document.getElementById('show-library');
        this.changeValueCurrentColorEl = document.querySelectorAll('.change-values-color');
        this.currentItemPaletteSelected = null;
    }

    refresh() {
        this.closeSliderChangeColor()
        this.setPaletteColors();
    }

    HandleCloseModal() {
        
        let modal = document.querySelector('.modal__container');
        document.body.removeChild(modal)
    }
    
    handleSavePalette (e) {
        let namePalette = e.target.parentElement.querySelector('input').value;
        
        let arrColorsHex = Array.from(this.colorValEl).map(el => el.textContent);

        localStorage.setItem(namePalette, JSON.stringify(arrColorsHex));

        this.HandleCloseModal();
        
    }

    handleOpenPalette (e) {
        let keyPalette = e.target.parentNode.parentNode.querySelector('h3').innerText;

        let arrColors = JSON.parse(localStorage.getItem(keyPalette));
        this.setPaletteColors(arrColors);
        this.HandleCloseModal();        
    }

    changeColorCurrentItem (e) { 

        this.closeSliderChangeColor();

        let itemPaletteEl = e.target.parentNode.parentNode;
        let currentColor = itemPaletteEl.querySelector('.palette__value').innerText;

        let currentColorHSL  = this.hexToHSL(currentColor);

        let colorValuesHSLEl = document.createElement('div');
        let colorValuesHtml = `
            <i class="close-palette fa fa-times"></i>
                <input class="change-color__slider huge" value="${currentColorHSL.huge}" min="0" max="360" type="range" name="huge">
                <input class="change-color__slider saturation" value="${currentColorHSL.saturation}" min="0" max="100" type="range" name="saturation">
                <input class="change-color__slider lightness" value="${currentColorHSL.lightness}" min="0" max="100" type="range" name="lightness">`;

        colorValuesHSLEl.classList.add('palette__chagenColor');
        colorValuesHSLEl.innerHTML = colorValuesHtml;
        itemPaletteEl.appendChild(colorValuesHSLEl);
        colorValuesHSLEl.style.top = '70%';

        this.setCurrentItemPalette( itemPaletteEl );
        this.UpdateValuesItemPalette( );

        //attach event listener close slider change color
        let sliderChangeColorCloseEl = itemPaletteEl.querySelector('.close-palette')    ;
        sliderChangeColorCloseEl.addEventListener('click', (e)=>this.handleClosePaletteChangeColors(e));
        
        // attach de event listener to change color modal options
        colorValuesHSLEl.addEventListener('input', (e)=>this.changeColorItemPalette(e))
        colorValuesHSLEl.addEventListener('change', (e)=>this.UpdateValuesItemPalette(e))
    
    }

    changeColorItemPalette(e){
        this.UpdateValuesItemPalette(e)
    }

    UpdateValuesItemPalette(e){

        let hugeEL = this.currentItemPaletteSelected.querySelector('input[name=huge]');
        let saturationEL = this.currentItemPaletteSelected.querySelector('input[name=saturation]');
        let lightnessEl = this.currentItemPaletteSelected.querySelector('input[name=lightness]');

        let huge = hugeEL.value;
        let saturation = saturationEL.value;
        let lightness = lightnessEl.value;
        
        hugeEL.value = huge;
        saturationEL.value = saturation ;
        lightnessEl.value = lightness;

        hugeEL.style.background = this.generateLinearGradient(huge, "huge");
        saturationEL.style.background = this.generateLinearGradient(huge, "saturation");
        lightnessEl.style.background = this.generateLinearGradient(huge, "lightness");

        this.setColorItem( this.currentItemPaletteSelected, {huge,saturation, lightness})

    }

    closeSliderChangeColor() {
        Array.from(this.palette.children).forEach(item=>{
            let itemChangeColor = item.querySelector('.palette__chagenColor');
            
            if (itemChangeColor) {
                item.removeChild(itemChangeColor)
            }
        });
    }

    setCurrentItemPalette ( item ) {
        this.currentItemPaletteSelected = item;
    }

    handleClosePaletteChangeColors(e){
        let modalEl = e.target.parentNode;
        let parentItemPalette = modalEl.parentNode;

        parentItemPalette.removeChild(modalEl);
    }

    generateLinearGradient(colorHSL, type) {
        let strGradientValues = '';
        let max =  type === "huge" ? 36
                : type === "saturation" ? 10
                : type === "lightness" ? 10
                : 0;    

        for (let i = 0; i <= max; i++) {
            strGradientValues += type === 'huge' ? `,hsl(${i * 10}, 100%, 50%)`
                : type === "saturation" ? `,hsl(${colorHSL}, ${i * 10}%, 50%)`
                    : type === "lightness" ? `,hsl(${colorHSL}, 100%, ${i * 10}%)`
                    : "";
        }

        return `linear-gradient(to right${strGradientValues})`
    }

    ShowLibraryModal() {
        
        let library = this.buildLibraryHtml();
        this.buildModal( library );

        let libraryOption = document.querySelectorAll('.open-library');

        libraryOption.forEach(el => el.addEventListener('click', (e) => this.handleOpenPalette(e)))
    }

    buildLibraryHtml() {
        let library = `<h2>Pick your Palette</h2>`;

        for (let i = localStorage.length-1; i >= 0 ; i--) {
            let keyLibrary = localStorage.key(i);
            let arrColors = JSON.parse(localStorage.getItem(keyLibrary));
            let libraryColorsHTML = ``;

            for (let j = 0; j < arrColors.length; j++) {
                libraryColorsHTML += `
                    <div class="library__item-color" style="background-color:${arrColors[j]};">
                    </div>`;
            }

            let tempLibrary = `
                <div class="library__item">
                    <h3>${keyLibrary}</h3>
                    <div class="library__item-colors">
                        ${libraryColorsHTML}
                        <button class="open-library"> Select </button>
                    </div>
                </div>`;

            library += tempLibrary;
        }


        return library;
    }

    ModalSavePalette() {
        let savePaletteForm = `
            <h2>Give a name to your Palette!</h2>
            <input />
            <button id="savePaletteModal"> Save </button>`;
        
        this.buildModal(savePaletteForm);
        let elSave = document.querySelector("#savePaletteModal");
        
        elSave.addEventListener("click", (e) => this.handleSavePalette(e))
    }

    buildModal( html) {
        let modal = document.createElement('div');
        modal.classList.add('modal__container');
        modal.innerHTML = `
             <div class="modal__content">
                <i class="close-modal fa fa-times"></i>
                ${html}
            </div>`;
        document.body.appendChild(modal);

        this.assingEvent('.close-modal', 'click', this.HandleCloseModal);
    }

    assingEvent( el, event, handleFunction) {
        let element = document.querySelector(el);
        element.addEventListener(event, () => handleFunction())
    }

    blockColor(e) {
        let iconBlock = e.target;

        if (iconBlock.classList.contains('fa-unlock')) {

            iconBlock.classList.remove('fa-unlock');
            iconBlock.classList.add('fa-lock');
            iconBlock.parentElement.parentElement.classList.add('lock-color')    
        } else {
            iconBlock.classList.remove('fa-lock');
            iconBlock.classList.add('fa-unlock');
            iconBlock.parentElement.parentElement.classList.remove('lock-color')    
        }   
    }

    copyColor (e) {
        let colorValue = e.target.innerText;

        let inputEl = document.createElement("input");
        document.body.appendChild(inputEl);
        inputEl.value = colorValue;
        inputEl.select();
        document.execCommand('copy');
        document.body.removeChild(inputEl);
    }

    setPaletteColors (arrColors = null) {

        let palettes = Array.from(this.palette.children);

        for (let i = 0; i < palettes.length; i++) {

            let paletteContainer = palettes[i];

            let HSLcolor = arrColors ? this.hexToHSL(arrColors[i]) : this.generateHSLRandomColor();

            if (!paletteContainer.classList.contains('lock-color')) {

                this.setColorItem(paletteContainer, HSLcolor)
            }
        }
    }

    setColorItem(item, HSLcolor ) {

        let valueEl = item.querySelector('.palette__value');
        let colorHex = this.HSLToHex(HSLcolor.huge, HSLcolor.saturation, HSLcolor.lightness);
        valueEl.textContent = `${colorHex}`;

        item.style.backgroundColor = `hsl( ${HSLcolor.huge}, ${HSLcolor.saturation}%, ${HSLcolor.lightness}% )`;

        if (HSLcolor.lightness > 50) {
            item.style.color = 'black';
        } else if (HSLcolor.saturation < 25) {
            item.style.color = 'white';
        } else {
            item.style.color = 'white';
        }
    }

    generateHSLRandomColor(){
        let huge, saturation, lightness;

        huge = this.randomFromInterval(0, 360);
        saturation = this.randomFromInterval(0, 100);
        lightness = this.randomFromInterval(0, 100);

        return ({
            huge,
            saturation,
            lightness
        });
    }

    randomFromInterval(min, max) { 
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    HSLToHex(h, s, l) {
        s /= 100;
        l /= 100;

        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
            m = l - c / 2,
            r = 0,
            g = 0,
            b = 0;

        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }
        // Having obtained RGB, convert channels to hex
        r = Math.round((r + m) * 255).toString(16);
        g = Math.round((g + m) * 255).toString(16);
        b = Math.round((b + m) * 255).toString(16);

        // Prepend 0s, if necessary
        if (r.length == 1)
            r = "0" + r;
        if (g.length == 1)
            g = "0" + g;
        if (b.length == 1)
            b = "0" + b;

        return "#" + r + g + b;
    }

    hexToHSL(H) {
        // Convert hex to RGB first
        let r = 0, g = 0, b = 0;
        if (H.length == 4) {
            r = "0x" + H[1] + H[1];
            g = "0x" + H[2] + H[2];
            b = "0x" + H[3] + H[3];
        } else if (H.length == 7) {
            r = "0x" + H[1] + H[2];
            g = "0x" + H[3] + H[4];
            b = "0x" + H[5] + H[6];
        }
        // Then to HSL
        r /= 255;
        g /= 255;
        b /= 255;
        let cmin = Math.min(r, g, b),
            cmax = Math.max(r, g, b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;

        if (delta == 0)
            h = 0;
        else if (cmax == r)
            h = ((g - b) / delta) % 6;
        else if (cmax == g)
            h = (b - r) / delta + 2;
        else
            h = (r - g) / delta + 4;

        h = Math.round(h * 60);

        if (h < 0)
            h += 360;

        l = (cmax + cmin) / 2;
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);

        return ({
            huge:parseInt(h),
            saturation:parseInt(s),
            lightness:parseInt(l)
        });
    }
}

myPalette = new Palette();
myPalette.setPaletteColors();

myPalette.refreshBtn.addEventListener('click', function() { 
    myPalette.refresh()
});

myPalette.saveBtn.addEventListener('click', function() { 
    myPalette.ModalSavePalette()
});

myPalette.showLibrarybtn.addEventListener('click', function() { 
    myPalette.ShowLibraryModal()
});

// add Event listeners

Array.from(myPalette.colorValEl).forEach(onePalette => {
    onePalette.addEventListener('click',function(e){
        myPalette.copyColor(e);
    })
})

Array.from(myPalette.colorBlockEls).forEach(onePalette => {
    onePalette.addEventListener('click',function(e){
        myPalette.blockColor(e);
    })
})

Array.from(myPalette.changeValueCurrentColorEl).forEach(currentPaletteContainer => {
    currentPaletteContainer.addEventListener('click',function(e){
        myPalette.changeColorCurrentItem(e);
    })
})