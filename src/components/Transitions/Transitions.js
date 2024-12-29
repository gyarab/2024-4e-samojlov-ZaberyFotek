/** Hlavní funkce jednotlivých přechodů **/
export const Transitions = (ctx,
                            canvas,
                            cameraWidth,
                            cameraHeight,
                            currentPiece,
                            nextPiece,
                            count,
                            coordinateX,
                            coordinateY,
                            videoLength,
                            barWidth,
                            getSquareRotation,
                            arrowSetUp) => {

    // Načtení obrázků pro přechod
    const img = new Image();
    const nextImg = new Image();

    if (currentPiece?.src) {
        img.src = currentPiece.src;
    }

    if (nextPiece?.src) {
        nextImg.src = nextPiece.src;
    }

    // Nastavení velikosti kamery u aktuálního obrázku
    const sizeCurrent = currentPiece?.isSubmitted
        ? {x: cameraWidth, y: cameraHeight}
        : {x: img.width, y: img.height};

    // Nastavení velikosti kamery u dalšího obrázku
    const sizeNext = nextPiece?.isSubmitted
        ? {x: cameraWidth, y: cameraHeight}
        : {x: nextImg.width, y: nextImg.height};

    // Souřadnice kamery u aktuálního obrázku
    const coordinateCurrent = currentPiece?.isSubmitted
        ? {x: coordinateX, y: coordinateY}
        : {x: 0, y: 0};

    // Výpočet počátečních a cílových pozic pro kameru
    const startPiece = (nextPiece?.left * videoLength) / barWidth;
    const endPiece = ((nextPiece?.left + nextPiece?.width) * videoLength) / barWidth;
    const duration = endPiece - startPiece;
    const startClip = count - startPiece;
    const arrowPosition = nextPiece?.arrowDirection || {x: "+", y: "-"};
    let speedX = ((nextImg?.width - cameraWidth) / duration);
    let speedY = ((nextImg?.height - cameraHeight) / duration);

    // Nastavení pozic kamery na základě typu přechodu (zoom, rotace, šipky)
    let positionXStart, positionYStart;

    // Počáteční posun
    let amount = 0;

    // Délka jednoho snímku
    let frameDuration = 1000 / 60;

    // Celkový počet snímků
    let totalFrames;

    // Rychlost posunu
    let step;

    /** Funkce rozlišující typ směru **/
    const arrowPositionType = (arrowPosition, arrowSetUp) => {

        if (arrowPositionType.x === "zoom") {

            // Přiblížení nebo oddálení kamery
            const zoomProgress = (startClip / duration);

            if (arrowPositionType.y === "in") {
                cameraWidth = nextImg?.width / (1 + zoomProgress);
                cameraHeight = nextImg?.height / (1 + zoomProgress);

            } else {
                cameraWidth = (nextImg?.width / 2) * (1 + zoomProgress);
                cameraHeight = (nextImg?.height / 2) * (1 + zoomProgress);
            }

            positionXStart = (nextImg?.width - cameraWidth) / 2;
            positionYStart = (nextImg?.height - cameraHeight) / 2;

        } else if (arrowPositionType.x === "rotation") {

            // Výpočet pozice při rotaci
            const squareRotation = getSquareRotation(arrowPosition, 0, speedX, 0, cameraWidth, speedY, cameraHeight, startClip, duration);
            positionXStart = squareRotation.positionX;
            positionYStart = squareRotation.positionY;

        } else {

            if (arrowSetUp !== null) {

                // Nastavení pozic pro šipkový přechod (- endPiece)
                positionXStart = arrowSetUp(arrowPosition.x, 0, nextImg?.width, cameraWidth);
                positionYStart = arrowSetUp(arrowPosition.y, 0, nextImg?.height, cameraHeight);
            }
        }

        // Zajištění, že pozice nezačnou mimo obraz
        positionXStart = Math.max(0, positionXStart);
        positionYStart = Math.max(0, positionYStart);

        return {x: positionXStart, y: positionYStart};
    }

    // Nastavení aktuálních souřadnic a vykreslení dalšího obrázku
    const positionX = arrowPositionType(arrowPosition, arrowSetUp).x;
    const positionY = arrowPositionType(arrowPosition, arrowSetUp).y;

    // Souřadnice kamery u dalšího obrázku
    const coordinateNext = nextPiece?.isSubmitted
        ? {x: positionX, y: positionY}
        : {x: 0, y: 0};

    /**
     * Funkce pro vytvoření přechodu typu "Blink" (Záblesk)
     */
    const blinkTransition = (totalDuration, onComplete) => {

        totalFrames = totalDuration / frameDuration;
        const halfFrames = totalFrames / 2;
        amount = 0;

        // Výpočet kroku pro změnu výšky bloků
        step = (canvas.height / 2) / halfFrames;

        const blink = () => {

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Výpočet intenzity rozmazání
            const blurAmount = (amount / totalFrames) * 20;

            if (amount <= halfFrames) {  // Záblesk - rozmazání

                ctx.filter = `blur(${Math.min(blurAmount, 20)}px)`;
                ctx.drawImage(
                    img,
                    coordinateCurrent.x,
                    coordinateCurrent.y,
                    sizeCurrent.x,
                    sizeCurrent.y,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

            } else {  // Záblesk - postupné odstraňování rozmazání

                const unblurAmount = 20 - (amount - halfFrames) / halfFrames * 20;
                ctx.filter = `blur(${Math.max(unblurAmount, 0)}px)`;
                ctx.drawImage(
                    nextImg,
                    coordinateNext.x,
                    coordinateNext.y,
                    sizeNext.x,
                    sizeNext.y,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
            }

            ctx.filter = 'none';
            let blockHeight;

            if (amount <= halfFrames) {  // Výška černých bloků při záblesku
                blockHeight = step * amount;
            } else {
                blockHeight = step * (totalFrames - amount);
            }

            ctx.fillStyle = 'black';  // Nastavení barvy bloků
            ctx.fillRect(0, 0, canvas.width, blockHeight);  // Horní blok
            ctx.fillRect(0, canvas.height - blockHeight, canvas.width, blockHeight);  // Dolní blok

            amount++;  // Aktualizace počítadla snímků

            if (amount <= totalFrames) {
                requestAnimationFrame(blink);

            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.filter = 'none';  // Resetování filtru
                ctx.drawImage(
                    nextImg,
                    coordinateNext.x,
                    coordinateNext.y,
                    sizeNext.x,
                    sizeNext.y,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                if (onComplete) onComplete();
            }
        };

        blink();
    };

    /**
     * Funkce pro vytvoření přechodu typu "Fade" (Plynule zesílit)
     */
    const fadeTransition = (totalDuration,
                            onComplete) => {

        amount = 0;
        step = frameDuration / (totalDuration / 2);

        /** Funkce pro vykreslení postupného zeslabování aktuálního obrázku **/
        const fadeOut = () => {

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Snížení průhlednosti
            ctx.globalAlpha = 1 - amount;

            ctx.drawImage(img, coordinateCurrent.x, coordinateCurrent.y, sizeCurrent.x, sizeCurrent.y, 0, 0, canvas.width, canvas.height);
            amount += step;

            if (amount < 1) {
                requestAnimationFrame(fadeOut);
            } else {
                amount = 0;
                requestAnimationFrame(fadeIn);
            }
        };

        /** Funkce pro vykreslení postupného zesilování dalšího obrázku **/
        const fadeIn = () => {

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Zvýšení průhlednosti
            ctx.globalAlpha = amount;

            ctx.drawImage(nextImg, coordinateNext.x, coordinateNext.y, sizeNext.x, sizeNext.y, 0, 0, canvas.width, canvas.height);

            // Postupné zesilování průhlednosti
            amount += step;

            if (amount < 1) {
                requestAnimationFrame(fadeIn)

            } else {
                // Obnovení neprůhlednosti
                ctx.globalAlpha = 1;

                if (onComplete) {
                    onComplete();
                }
            }
        }

        fadeOut();
    };

    /**
     * Funkce pro vytvoření přechodu typu "Slide" (Snímek zprava a zleva)
     */
    const slideTransition = (totalDuration, onComplete, type) => {
        amount = 0;
        totalFrames = totalDuration / frameDuration;
        step = canvas.width / totalFrames;

        const slide = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (type === "right") {
                // Vykreslení obrázků pro posun zprava
                ctx.drawImage(img, coordinateCurrent.x, coordinateCurrent.y, sizeCurrent.x, sizeCurrent.y, -amount, 0, canvas.width, canvas.height);
                ctx.drawImage(nextImg, coordinateNext.x, coordinateNext.y, sizeNext.x, sizeNext.y, canvas.width - amount, 0, canvas.width, canvas.height);

            } else if (type === "left") {

                // Vykreslení obrázků pro posun zleva
                ctx.drawImage(img, coordinateCurrent.x, coordinateCurrent.y, sizeCurrent.x, sizeCurrent.y, amount, 0, canvas.width, canvas.height);
                ctx.drawImage(nextImg, coordinateNext.x, coordinateNext.y, sizeNext.x, sizeNext.y, amount - canvas.width, 0, canvas.width, canvas.height);
            }

            amount += step;

            if (amount < canvas.width) {
                requestAnimationFrame(slide);  // Pokračování animace

            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(nextImg, coordinateNext.x, coordinateNext.y, sizeNext.x, sizeNext.y, 0, 0, canvas.width, canvas.height);  // Konečný obrázek

                if (onComplete) onComplete();
            }
        };

        slide();
    };


    /**
     * Funkce pro vytvoření přechodu typu "Flip" (Překlopit)
     */
    const flipTransition = (totalDuration, onComplete) => {

        totalFrames = totalDuration / frameDuration;
        amount = 0;

        const flip = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Výpočet fáze flipu
            const progress = amount / totalFrames;
            const isFlippingOut = progress <= 0.5; // První polovina animace

            const scaleX = isFlippingOut
                ? -(1 - (progress * 2))  // Zmenšení do středu
                : (progress - 0.5) * 2; // Zvětšení od středu


            const currentImage = isFlippingOut ? img : nextImg;

            const coordinate = isFlippingOut
                ? {x: coordinateCurrent.x, y: coordinateCurrent.y}
                : {x: coordinateNext.x, y: coordinateNext.y};

            // Vykreslení aktuálního nebo dalšího obrázku
            ctx.save(); // Uložení kontextu
            ctx.translate(canvas.width / 2, canvas.height / 2); // Přesun na střed plátna
            ctx.scale(scaleX, 1); // Překlopení podle X a zmenšení/zvětšení
            ctx.drawImage(
                currentImage,
                coordinate.x,
                coordinate.y,
                sizeCurrent.x,
                sizeCurrent.y,
                -canvas.width / 2, // Vycentrování na střed
                -canvas.height / 2,
                canvas.width,
                canvas.height
            );
            ctx.restore(); // Obnovení kontextu

            // Pokračování animace
            amount++;

            if (amount <= totalFrames) {
                requestAnimationFrame(flip);
            } else {
                // Dokončení animace, vykreslení finálního obrázku
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(
                    nextImg,
                    coordinateNext.x,
                    coordinateNext.y,
                    sizeNext.x,
                    sizeNext.y,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                if (onComplete) {
                    onComplete();
                }
            }
        };

        flip(); // Spuštění animace
    };

    /**
     * Funkce pro vytvoření přechodu typu "Pull IN" (Vtáhnout)
     */
    const pullInTransition = (totalDuration, onComplete) => {

        totalFrames = totalDuration / frameDuration;
        amount = 0;

        let scale = (sizeCurrent.x === img.width) ? 1 : 5;  // Počáteční měřítko
        let blurAmount = 0;  // Počáteční rozmazání
        const maxBlur = 15;  // Maximální rozmazání
        const stepScale = 2 / totalFrames;  // Rychlost změny měřítka
        const stepBlur = maxBlur / (totalFrames / 2);  // Rychlost změny rozmazání

        const pullIn = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (amount < totalFrames / 2) {  // První fáze (zoom a blur)
                ctx.filter = `blur(${blurAmount}px)`;  // Nastavení rozmazání
                ctx.drawImage(
                    img,
                    coordinateCurrent.x,
                    coordinateCurrent.y,
                    sizeCurrent.x,
                    sizeCurrent.y,
                    (canvas.width - sizeCurrent.x * scale) / 2,
                    (canvas.height - sizeCurrent.y * scale) / 2,
                    sizeCurrent.x * scale,
                    sizeCurrent.y * scale
                );

                blurAmount += stepBlur;  // Zvýšení rozmazání
                scale += stepScale;  // Zvýšení měřítka

            } else {  // Druhá fáze (odstranění blur a přechod na druhý obrázek)

                blurAmount = Math.max(blurAmount - stepBlur, 0);  // Redukce rozmazání
                ctx.filter = `blur(${blurAmount}px)`;  // Nastavení rozmazání

                if (amount < totalFrames - 1) {
                    ctx.drawImage(
                        nextImg,
                        coordinateNext.x,
                        coordinateNext.y,
                        sizeNext.x,
                        sizeNext.y,
                        (canvas.width - sizeNext.x * scale) / 2,
                        (canvas.height - sizeNext.y * scale) / 2,
                        sizeNext.x * scale,
                        sizeNext.y * scale
                    );
                    scale -= stepScale / 2;  // Zpomalení měřítka

                } else {  // Konec (vyčištění a vykreslení druhého obrázku bez rozmazání)

                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.filter = "none";
                    ctx.drawImage(
                        nextImg,
                        coordinateNext.x,
                        coordinateNext.y,
                        sizeNext.x,
                        sizeNext.y,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );
                }
            }

            if (amount >= totalFrames) {
                if (onComplete) onComplete();
            } else {
                amount++;
                requestAnimationFrame(pullIn);  // Další snímek
            }
        };

        pullIn();  // Spuštění přechodu
    };

    /**
     * Funkce pro vytvoření přechodu typu "Blur" (Rozmazat)
     */
    const blurTransition = (totalDuration, onComplete) => {
        amount = 0;
        const halfFrames = totalFrames / 2;

        const blur = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Vypočítání intenzity rozmazání a opacity
            const blurAmount = amount <= halfFrames ? (amount / halfFrames) * 20 : (1 - (amount - halfFrames) / halfFrames) * 20;
            const opacity = amount <= halfFrames ? 1 - (amount / halfFrames) : (amount - halfFrames) / halfFrames;

            // První polovina: rozmazání aktuálního obrázku
            if (amount <= halfFrames) {
                ctx.filter = `blur(${blurAmount}px)`;
                ctx.globalAlpha = opacity;
                ctx.drawImage(img, coordinateCurrent.x, coordinateCurrent.y, sizeCurrent.x, sizeCurrent.y, 0, 0, canvas.width, canvas.height);
            } else {
                // Druhá polovina: rozmazání dalšího obrázku
                ctx.filter = `blur(${blurAmount}px)`;
                ctx.globalAlpha = opacity;
                ctx.drawImage(nextImg, coordinateNext.x, coordinateNext.y, sizeNext.x, sizeNext.y, 0, 0, canvas.width, canvas.height);
            }

            // Resetování filtrů
            ctx.filter = 'none';
            ctx.globalAlpha = 1;

            amount++;

            // Pokračování přechodu
            if (amount <= totalFrames) {
                requestAnimationFrame(blur);
            } else {
                // Konec přechodu, vykreslení konečného obrázku
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(nextImg, coordinateNext.x, coordinateNext.y, sizeNext.x, sizeNext.y, 0, 0, canvas.width, canvas.height);

                if (onComplete) onComplete();
            }
        };

        blur();
    };


    return {
        fadeTransition,
        slideTransition,
        flipTransition,
        pullInTransition,
        blinkTransition,
        blurTransition
    };
}