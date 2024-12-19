import {CanvasContent, SubmitBtn} from "../TimelineComponents";

/** Funkce pro úpravu rozměrů plochy **/
export const transitionOption = (type, videoRef, canvasSelector, setRatioCanvas, setBtnName, btnName) => {

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

            <hr
                style={{
                    margin: '10px 0',
                    width: '100%',
                    height: '2px',
                    border: 'none',
                    backgroundImage: 'repeating-linear-gradient(45deg, #ffe564 0, #ffe564 10px, transparent 10px, transparent 20px)',
                }}
            />


            <SubmitBtn

                style={{
                    width: '75%',
                    background: '#4000c7',
                    boxShadow: '0 2px 10px #5960ff',
                    letterSpacing: '1px'
                }}

                onClick={() => {

                    if (canvasSelector[transitionIndex] === undefined) {

                        console.log("NN", canvasSelector[transitionIndex]);
                        setBtnName("Vyberte prosím jeden z přechodů");

                    } else {

                        setBtnName("Zvolte 2 snímky na časové ose");
                    }
                }}
            >
                VYTVOŘIT
            </SubmitBtn>

            <div style={{marginTop: "15px", fontSize: "11px", color: "#ffe564"}}>{btnName}</div>

        </div>);
};