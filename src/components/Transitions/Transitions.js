function Transitions({ctx, canvas, cameraWidth, cameraHeight, prevClip, nextClip, count, endPiece, totalDuration}) {

    // /** Funkce pro vytvoření plynulého přechodu (Fade Transition) **/
    // const fadeTransition = () => {
    //
    //     let fadeAmount = 0;
    //     const frameDuration = 1000 / 60;
    //     const fadeStep = frameDuration / (totalDuration / 2);
    //
    //     const fadeOut = () => {
    //         ctx.clearRect(0, 0, canvas.width, canvas.height);
    //         ctx.globalAlpha = 1 - fadeAmount;
    //         ctx.drawImage(prevClip, cameraWidth, cameraHeight, canvas.width, canvas.height);
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
    //     const fadeIn = () => {
    //         ctx.clearRect(0, 0, canvas.width, canvas.height);
    //         ctx.globalAlpha = fadeAmount;
    //         ctx.drawImage(nextClip, cameraWidth, cameraHeight, canvas.width, canvas.height);
    //         fadeAmount += fadeStep;
    //
    //         if (fadeAmount < 1) {
    //             requestAnimationFrame(fadeIn);
    //         } else {
    //             ctx.globalAlpha = 1;
    //         }
    //     };
    //
    //     if (count < endPiece) {
    //         fadeOut();
    //     } else {
    //         fadeIn();
    //     }
    // };
}