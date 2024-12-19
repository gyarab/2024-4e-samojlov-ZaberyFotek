import {CanvasContent, SubmitBtn} from "../TimelineComponents";

/** Funkce pro úpravu rozměrů plochy **/
export const transitionOption = (type, videoRef, canvasSelector, setRatioCanvas) => {

    const transitionIndex = 4;

    const canvas = videoRef.current;

    return (
        <div>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    gap: "10px",
                    position: 'relative',
                    width: '100%'
                }}
            >

                {type.map((item, index) => {

                    return (
                        <CanvasContent
                            key={index}
                            isClicked={index === canvasSelector[transitionIndex]}
                            onClick={() => setRatioCanvas(canvas, index, item, transitionIndex)}
                            style={{width: "100%", justifyContent: "center"}}
                        >
                            {item.name}
                        </CanvasContent>
                    );
                })}
            </div>

            <SubmitBtn

                style={{marginTop: '10px', width: '75%', background: '#4000c7', boxShadow: '0 2px 10px #5960ff', letterSpacing: '1px'}}

                onClick={() => {
                    // setSelectedCounts({});
                    // setRatioSelection([]);
                    // setCountClicks(0);
                    //
                    // setRatioCanvas(videoRef.current, 1, null, cameraIndex);

                    // // Výchozí možnost výběru
                    // setTimeout(() => {
                    //     setCanvasSelector(prev => {
                    //         const updatedArray = [...prev];
                    //         updatedArray[5] = 1;
                    //         return updatedArray;
                    //     });
                    // }, 0);
                    //
                    // setCameraSize({width: "100 px", height: "100 px", currentIndex: 1});
                }}
            >
                VYTVOŘIT
            </SubmitBtn>

        </div>);
};