import {CanvasContent, Loader, SubmitBtn} from "../TimelineComponents";
import {useEffect} from "react";
import {MdCancel} from "react-icons/md";

/** Funkce pro úpravu rozměrů plochy **/
export const transitionOption = (type,
                                 videoRef,
                                 canvasSelector,
                                 setRatioCanvas,
                                 setBtnName,
                                 btnName,
                                 setCurrentTime,
                                 setBarPosition,
                                 setTransition,
                                 setPieceClicked,
                                 handlePieceClick,
) => {

    const transitionIndex = 4;

    const canvas = videoRef.current;

    // Kontrola názvu tlačítka
    const btnCondition = btnName === "Zvolte 2 snímky na časové ose";

    // Funkce pro resetování přechodu u vybraných částic uživatelem
    const transitionReset = () => {

        setCurrentTime(0);
        setBarPosition(0);
        setTransition(prev => ({
            ...prev,
            idPieces: {},
            transitionID: prev.transitionID,
        }));

        setPieceClicked(false);
        handlePieceClick(false)

    };

    const divStyles = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative',
        width: '100%',
        gap: '10px'
    }

    return (
        <div>

            <div
                style={divStyles}
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

            <div style={{...divStyles, flexDirection: 'row'}}>

                <SubmitBtn

                    style={{
                        width: '75%',
                        background: '#4000c7',
                        boxShadow: '0 2px 10px #5960ff',
                        letterSpacing: '1px'
                    }}

                    onClick={() => {

                        console.log(canvasSelector[transitionIndex]);

                        // Nastavení nápovědy pro uživatele dle aktivity
                        if (canvasSelector[transitionIndex] === null) {

                            console.log("NN", canvasSelector[transitionIndex]);
                            setBtnName("Vyberte prosím jeden z přechodů");

                        } else {

                            setBtnName("Zvolte 2 snímky na časové ose");
                            transitionReset();
                        }
                    }}
                >
                    {btnCondition ? <Loader/> : "VYTVOŘIT"}

                </SubmitBtn>

                {btnCondition &&
                    <button
                        onClick={() => {

                            setBtnName("Vyberte prosím jeden z přechodů");
                            transitionReset();
                        }}
                        style={{background: '#9e1a1f', borderRadius: '50%', padding: '5px'}}>
                        <MdCancel
                            style={{color: 'white'}}/>
                    </button>}

            </div>

            <div style={{marginTop: "10px", fontSize: "11px", color: "#ffe564"}}>{btnName}</div>

        </div>);
};