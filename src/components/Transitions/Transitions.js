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
                    setCoordinateX,
                    setCoordinateY) => {

    // Načtení obrázků pro přechod
    const img = new Image();
    const nextImg = new Image();

    if (currentPiece?.src) {
        img.src = currentPiece.src;
    }

    if (nextPiece?.src) {
        nextImg.src = nextPiece.src;
    }

    // Nastavení velikosti kaery
    const sizeCurrent = currentPiece?.isSubmitted
        ? {x: cameraWidth, y: cameraHeight}
        : {x: img.width, y: img.height};

    const sizeNext = nextPiece?.isSubmitted
        ? {x: cameraWidth, y: cameraHeight}
        : {x: nextImg.width, y: nextImg.height};

    const coordinateCurrent = nextPiece?.isSubmitted
        ? {x: coordinateX, y: coordinateY}
        : {x: 0, y: 0};

    // Výpočet počátečních a cílových pozic pro kameru
    const startPiece = (nextPiece?.left * videoLength) / barWidth;
    const endPiece = ((nextPiece?.left + nextPiece?.width) * videoLength) / barWidth;
    const duration = endPiece - startPiece;
    const startClip = count - startPiece;
    const arrowPosition = nextPiece?.arrowDirection || {x: "+", y: "-"};
    let speedX = ((img?.width - cameraWidth) / duration);
    let speedY = ((img?.height - cameraHeight) / duration);

    // Nastavení pozic kamery na základě typu přechodu (zoom, rotace, šipky)
    let positionXStart, positionYStart;

    /** Funkce rozlišující typ směru **/
    const arrowPositionType = (arrowPosition, arrowSetUp) => {

        if (arrowPositionType.x === "zoom") {

            // Přiblížení nebo oddálení kamery
            const zoomProgress = (startClip / duration);

            if (arrowPositionType.y === "in") {
                cameraWidth = img?.width / (1 + zoomProgress);
                cameraHeight = img?.height / (1 + zoomProgress);

            } else {
                cameraWidth = (img?.width / 2) * (1 + zoomProgress);
                cameraHeight = (img?.height / 2) * (1 + zoomProgress);
            }

            positionXStart = (img?.width - cameraWidth) / 2;
            positionYStart = (img?.height - cameraHeight) / 2;

        } else if (arrowPositionType.x === "rotation") {

            // Výpočet pozice při rotaci
            const squareRotation = getSquareRotation(arrowPosition, coordinateX, speedX, coordinateY, cameraWidth, speedY, cameraHeight, startClip, duration);
            positionXStart = squareRotation.positionX;
            positionYStart = squareRotation.positionY;

        } else {

            if (arrowSetUp !== null) {

                // Nastavení pozic pro šipkový přechod (- endPiece)
                positionXStart = arrowSetUp(arrowPosition.x, coordinateX, img?.width, cameraWidth) - coordinateX - speedX;
                positionYStart = arrowSetUp(arrowPosition.y, coordinateY, img?.height, cameraHeight) - coordinateY - speedY;
            }
        }

        // Zajištění, že pozice nezačnou mimo obraz
        positionXStart = Math.max(0, positionXStart);
        positionYStart = Math.max(0, positionYStart);

        return {x: positionXStart, y: positionYStart};
    }

    /** Funkce pro vytvoření plynulého přechodu (Fade Transition) **/
    const fadeTransition = (totalDuration,
                            onComplete,
                            arrowSetUp) => {

        let amount = 0;
        const frameDuration = 1000 / 60;
        const step = frameDuration / (totalDuration / 2);

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

            // Nastavení aktuálních souřadnic a vykreslení dalšího obrázku
            const positionX = arrowPositionType(arrowPosition, arrowSetUp).x;
            const positionY = arrowPositionType(arrowPosition, arrowSetUp).y;

            setCoordinateX(positionX);
            setCoordinateY(positionY);

            const coordinateNext = nextPiece?.isSubmitted
                ? {x: positionX, y: positionY}
                : {x: 0, y: 0};

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

    /** Funkce pro vytvoření přechodu typu "Slide from Right" **/
    const slideTransitionRight = (totalDuration,
                                  onComplete,
                                  arrowSetUp) => {

        let amount = 0;
        let frameDuration = 1000 / 60;
        let totalFrames = totalDuration / frameDuration;
        let step = canvas.width / totalFrames;


        const slide = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Vykreslení aktuálního obrázku
            ctx.drawImage(
                img,
                coordinateCurrent.x,
                coordinateCurrent.y,
                sizeCurrent.x,
                sizeCurrent.y,
                -amount,
                0,
                canvas.width,
                canvas.height
            );

            // Nastavení aktuálních souřadnic a vykreslení dalšího obrázku
            const positionX = arrowPositionType(arrowPosition, arrowSetUp).x;
            const positionY = arrowPositionType(arrowPosition, arrowSetUp).y;

            setCoordinateX(positionX);
            setCoordinateY(positionY);

            const coordinateNext = nextPiece?.isSubmitted
                ? {x: positionX, y: positionY}
                : {x: 0, y: 0};

            // Vykreslení dalšího obrázku (posun z pravé strany)
            ctx.drawImage(
                nextImg,
                coordinateNext.x,
                coordinateNext.y,
                sizeNext.x,
                sizeNext.y,
                canvas.width - amount,
                0,
                canvas.width,
                canvas.height
            );

            // Postupný posun obrázku
            amount += step;

            // Pokračování animace, dokud obrázek nebude celý posunut
            if (amount < canvas.width) {
                requestAnimationFrame(slide);

            } else {

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

        slide();
    };

    return {
        fadeTransition,
        slideTransitionRight
    };
}

// /** Funkce pro vytvoření plynulého přechodu (Fade Transition) **/
// export const fadeTransition = (
//     ctx,
//     canvas,
//     cameraWidth,
//     cameraHeight,
//     currentPiece,
//     nextPiece,
//     count,
//     coordinateX,
//     coordinateY,
//     totalDuration,
//     onComplete,
//     arrowSetUp,
//     videoLength,
//     barWidth,
//     getSquareRotation,
//     setCoordinateX,
//     setCoordinateY
// ) => {
//
//     // Inicializace proměnných pro postupné zeslabování a zesilování
//     let fadeAmount = 0;
//     const frameDuration = 1000 / 60; // Trvání jednoho snímku
//     const fadeStep = frameDuration / (totalDuration / 2); // Krok zeslabování/zvyšování průhlednosti
//
//     // Načtení obrázků pro přechod
//     const img = new Image();
//     const nextImg = new Image();
//     img.src = currentPiece.src;
//     nextImg.src = nextPiece.src;
//
//     if (currentPiece?.src) {
//         img.src = currentPiece.src;
//     }
//
//     if (nextPiece?.src) {
//         nextImg.src = nextPiece.src;
//     }
//
//     // Nastavení velikosti kaery
//     const sizeCurrent = currentPiece?.isSubmitted
//         ? {x: cameraWidth, y: cameraHeight}
//         : {x: img.width, y: img.height};
//
//     const sizeNext = nextPiece?.isSubmitted
//         ? {x: cameraWidth, y: cameraHeight}
//         : {x: nextImg.width, y: nextImg.height};
//
//     const coordinateCurrent = nextPiece?.isSubmitted
//         ? {x: coordinateX, y: coordinateY}
//         : {x: 0, y: 0};
//
//     let imagesLoaded = 0;
//
//     /** Kontrola pro načtení obrázků **/
//     const checkImagesLoaded = () => {
//         imagesLoaded++;
//         if (imagesLoaded === 2) fadeOut();
//     };
//
//     // Kontrola, že jsou oba obrázky načteny před spuštěním přechodu
//     img.onload = checkImagesLoaded;
//     nextImg.onload = checkImagesLoaded;
//
//     /** Funkce pro vykreslení postupného zeslabování aktuálního obrázku **/
//     const fadeOut = () => {
//
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//
//         // Snížení průhlednosti
//         ctx.globalAlpha = 1 - fadeAmount;
//
//         ctx.drawImage(img, coordinateCurrent.x, coordinateCurrent.y, sizeCurrent.x, sizeCurrent.y, 0, 0, canvas.width, canvas.height);
//         fadeAmount += fadeStep;
//
//         if (fadeAmount < 1) {
//             requestAnimationFrame(fadeOut);
//         } else {
//             fadeAmount = 0;
//             requestAnimationFrame(fadeIn);
//         }
//     };
//
//     /** Funkce pro vykreslení postupného zesilování dalšího obrázku **/
//     const fadeIn = () => {
//
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//
//         // Zvýšení průhlednosti
//         ctx.globalAlpha = fadeAmount;
//
//         // Výpočet počátečních a cílových pozic pro kameru
//         const startPiece = (nextPiece.left * videoLength) / barWidth;
//         const endPiece = ((nextPiece.left + nextPiece.width) * videoLength) / barWidth;
//         const duration = endPiece - startPiece;
//         const startClip = count - startPiece;
//         const arrowPosition = nextPiece.arrowDirection || {x: "+", y: "-"};
//         let speedX = ((img.width - cameraWidth) / duration);
//         let speedY = ((img.height - cameraHeight) / duration);
//
//         // Nastavení pozic kamery na základě typu přechodu (zoom, rotace, šipky)
//         let positionXStart, positionYStart;
//
//         if (arrowPosition.x === "zoom") {
//
//             // Přiblížení nebo oddálení kamery
//             const zoomProgress = (startClip / duration);
//
//             if (arrowPosition.y === "in") {
//                 cameraWidth = img.width / (1 + zoomProgress);
//                 cameraHeight = img.height / (1 + zoomProgress);
//
//             } else {
//                 cameraWidth = (img.width / 2) * (1 + zoomProgress);
//                 cameraHeight = (img.height / 2) * (1 + zoomProgress);
//             }
//
//             positionXStart = (img.width - cameraWidth) / 2;
//             positionYStart = (img.height - cameraHeight) / 2;
//
//         } else if (arrowPosition.x === "rotation") {
//
//             // Výpočet pozice při rotaci
//             const squareRotation = getSquareRotation(arrowPosition, coordinateX, speedX, coordinateY, cameraWidth, speedY, cameraHeight, startClip, duration);
//             positionXStart = squareRotation.positionX;
//             positionYStart = squareRotation.positionY;
//
//         } else {
//
//             if (arrowSetUp !== null) {
//
//                 // Nastavení pozic pro šipkový přechod
//                 positionXStart = arrowSetUp(arrowPosition.x, coordinateX, img.width, cameraWidth) - coordinateX - speedX;
//                 positionYStart = arrowSetUp(arrowPosition.y, coordinateY, img.height, cameraHeight) - coordinateY - speedY;
//             }
//         }
//
//         // Zajištění, že pozice nezačnou mimo obraz
//         positionXStart = Math.max(0, positionXStart);
//         positionYStart = Math.max(0, positionYStart);
//
//         // Nastavení aktuálních souřadnic a vykreslení dalšího obrázku
//         const positionX = positionXStart;
//         const positionY = positionYStart;
//
//         setCoordinateX(positionX);
//         setCoordinateY(positionY);
//
//         const coordinateNext = nextPiece?.isSubmitted
//             ? {x: positionX, y: positionY}
//             : {x: 0, y: 0};
//
//         ctx.drawImage(nextImg, coordinateNext.x, coordinateNext.y, sizeNext.x, sizeNext.y, 0, 0, canvas.width, canvas.height);
//
//         // Postupné zesilování průhlednosti
//         fadeAmount += fadeStep;
//
//         if (fadeAmount < 1) {
//             requestAnimationFrame(fadeIn)
//
//         } else {
//             // Obnovení neprůhlednosti
//             ctx.globalAlpha = 1;
//
//             if (onComplete) {
//                 onComplete();
//             }
//         }
//     }
// };

// /** Funkce pro vytvoření přechodu typu "Slide from Right" **/
// export const slideFromRightTransition = (ctx,
//                                          canvas,
//                                          cameraWidth,
//                                          cameraHeight,
//                                          currentPiece,
//                                          nextPiece,
//                                          coordinateX,
//                                          coordinateY,
//                                          totalDuration) => {
//
//     let slideAmount = 0;
//     const frameDuration = 1000 / 60; // Approximately 60 frames per second
//     const totalFrames = totalDuration / frameDuration;
//     const slideStep = canvas.width / totalFrames; // Amount to slide each frame
//
//     const img = new Image();
//     img.src = currentPiece.src;
//
//     const nextImg = new Image();
//     nextImg.src = nextPiece.src;
//
//     // Define size and coordinates for the images
//     const sizeCurrent = currentPiece?.isSubmitted ? { x: cameraWidth, y: cameraHeight } : { x: img.width, y: img.height };
//     const sizeNext = nextPiece?.isSubmitted ? { x: cameraWidth, y: cameraHeight } : { x: nextImg.width, y: nextImg.height };
//     const coordinateCurrent = currentPiece?.isSubmitted ? { x: coordinateX, y: coordinateY } : { x: 0, y: 0 };
//     const coordinateNext = nextPiece?.isSubmitted ? { x: coordinateX, y: coordinateY } : { x: 0, y: 0 };
//
//     const slide = () => {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//
//
//         ctx.drawImage(
//             img,
//             coordinateCurrent.x,
//             coordinateCurrent.y,
//             sizeCurrent.x,
//             sizeCurrent.y,
//             -slideAmount,
//             0,
//             canvas.width,
//             canvas.height
//         );
//
//
//         ctx.drawImage(
//             nextImg,
//             coordinateNext.x,
//             coordinateNext.y,
//             sizeNext.x,
//             sizeNext.y,
//             canvas.width - slideAmount,
//             0,
//             canvas.width,
//             canvas.height
//         );
//
//         slideAmount += slideStep;
//
//         if (slideAmount < canvas.width) {
//             requestAnimationFrame(slide);
//         } else {
//             ctx.clearRect(0, 0, canvas.width, canvas.height);
//             ctx.drawImage(
//                 nextImg,
//                 coordinateNext.x,
//                 coordinateNext.y,
//                 sizeNext.x,
//                 sizeNext.y,
//                 0,
//                 0,
//                 canvas.width,
//                 canvas.height
//             );
//         }
//     };
//
//     slide();
// };