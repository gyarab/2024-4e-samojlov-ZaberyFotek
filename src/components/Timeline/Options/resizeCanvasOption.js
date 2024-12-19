import {CanvasContent} from "../TimelineComponents";

/** Funkce pro úpravu rozměrů plochy **/
export const resizeCanvasOption = (type, videoRef, canvasSelector, setRatioCanvas) => {

    const resizeIndex = 1;

    const canvas = videoRef.current;

    return type.map((item, index) => {

        return (
            <CanvasContent
                key={index}
                isClicked={index === canvasSelector[resizeIndex]}
                onClick={() => setRatioCanvas(canvas, index, item, resizeIndex)}
                title={item.name}
            >
                {item.icon} {item.ratio}
            </CanvasContent>
        );
    });
};