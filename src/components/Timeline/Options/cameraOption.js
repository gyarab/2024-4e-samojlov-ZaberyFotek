import {CanvasContent, SubmitBtn} from "../TimelineComponents";
import {CiImageOn} from "react-icons/ci";
import {useState} from "react";

/** Funkce pro výběr optimální rozměrů kamery dle uživatele **/
export const cameraOption = (
                      type,
                      videoRef,
                      canvasSelector,
                      setRatioCanvas,
                      setSelectedCounts,
                      selectedCounts,
                      setRatioSelection,
                      ratioSelection,
                      setCountClicks,
                      countClicks,
                      setWidthDecimal,
                      widthDecimal,
                      setHeightDecimal,
                      heightDecimal,
                      setErrorMessage,
                      errorMessage,
                      cameraSize,
                      pieceIsClicked) => {

    // Maximální délka vstupu
    const maxLength = 3;

    // Index možnosti
    const cameraIndex = 5;

    /** Kontrola nastavené šířky nebo výšky **/
    const handleInputChange = (e, setter) => {

        const value = e.target.value;

        if (value.length <= maxLength) {
            setter(value);
        }
        if (value === "" || value < 10) {

            setErrorMessage("Hodnota musí být dvojciferné číslo a žádný z parametrů nesmí být prázdný");

        } else {
            setErrorMessage("");
        }
    };

    // Styly pro odlišení výběru výšky a šířky
    const stylesWidth = {textAlign: 'center', color: '#f7ff63'};
    const stylesHeight = {textAlign: 'center', color: '#52ffe4'};

    return (
        <div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px',
                width: '100%',
                gap: '25px'
            }}>
                <div style={stylesWidth}>ŠÍŘKA</div>
                <div style={stylesHeight}>VÝŠKA</div>
            </div>

            <hr style={{
                margin: '10px 0',
                border: 'none',
                height: '1px',
                background: 'linear-gradient(to right, #f7ff63, #52ffe4)'
            }}/>


            {type.map((item, index) => {

                if (!item.sizeX || !item.sizeY) {
                    return null;
                }

                return (
                    <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        gap: '25px',
                        marginTop: "10px"
                    }}>

                        <CanvasContent
                            style={{width: "100%"}}
                            key={index}
                            isClicked={index === canvasSelector[cameraIndex] && (ratioSelection.length === 0 || false)}
                            onClick={() => {

                                console.log("RATIO SSS " + ratioSelection.length)

                                setSelectedCounts({});
                                setRatioSelection([]);
                                setCountClicks(0);

                                setRatioCanvas(videoRef.current, index, item, cameraIndex)
                            }
                            }
                        >
                            <div style={{textAlign: 'center'}}>

                                {item.sizeX}

                            </div>
                            <div style={{textAlign: 'center'}}>

                                {item.sizeY}

                            </div>
                        </CanvasContent>
                    </div>
                );
            })}

            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: '10px',
                color: '#f7ff63',
                gap: '5px'
            }}>
                POMĚRY <CiImageOn style={{fontSize: '22px'}}/></div>
            <hr style={{margin: '10px 0', border: '1px solid #f9ffa6'}}/>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '5px',
                    marginTop: '10px',
                }}
            >

                {/** Výběr poměru z nabídky **/}
                {type.map((item, index) => {

                    // console.log("PPPP " + pieceIsClicked, ratioSelection[0]?.index, index)

                    if (!item.imgRatio) {
                        return null;
                    }

                    const count = selectedCounts[index] || 0;
                    const circleColors = [];

                    // Rozlišování barev dle kliknutí
                    const circleColor = countClicks % 2 === 0 ? `${stylesHeight.color}` : `${stylesWidth.color}`;

                    if (count === 1) {
                        circleColors.push(circleColor);
                    }

                    if (count === 2) {
                        circleColors.push(circleColor);
                        circleColors.push(stylesWidth.color);
                    }

                    return (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '50px',
                                gap: '10px',
                                marginTop: '10px',
                                position: 'relative'
                            }}
                        >
                            <CanvasContent
                                style={{
                                    width: '100%'
                                }}
                                key={index}
                                isClicked={count > 0 && pieceIsClicked && Object.keys(selectedCounts).length > 0}

                                onClick={() => {

                                    if (countClicks >= 2) {
                                        return;
                                    }

                                    // Maximální počet bodů je 2
                                    if (count < 2) {

                                        // Nastavení pro index počet bodů
                                        setSelectedCounts((prev) => ({
                                            ...prev,
                                            [index]: count + 1,
                                        }));

                                        Object.keys(selectedCounts).forEach(key => {
                                            console.log(`${key}: ${selectedCounts[key]}`);
                                        });

                                        // Zvětšění počet kliknutí o jedna
                                        setCountClicks(prev => prev + 1);
                                    }

                                    setRatioCanvas(videoRef.current, index, item, cameraIndex);
                                }}
                            >
                                <div style={{textAlign: 'center'}}>
                                    {item.imgRatio}
                                </div>

                            </CanvasContent>

                            <div
                                style={{
                                    display: 'flex',
                                    gap: '5px',
                                    position: 'absolute',
                                    top: '35px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                }}
                            >
                                {

                                    circleColors.map((color, i) => {
                                        console.log('pieceIsClicked:', pieceIsClicked, index, color, cameraSize?.currentIndex);

                                        const checkIndices = cameraSize?.currentIndex?.toString().split('').map(Number) || [];

                                        console.log(checkIndices[0], checkIndices[1])

                                        return (
                                            <span
                                                key={i}
                                                style={{
                                                    width: '10px',
                                                    height: '10px',
                                                    borderRadius: '50%',
                                                    backgroundColor: pieceIsClicked &&
                                                    (index === canvasSelector[cameraIndex] || checkIndices[1] === index)
                                                        ? color
                                                        : pieceIsClicked && (checkIndices[0] === index && count !== 2 ? stylesWidth.color : "none")
                                                }}
                                            />
                                        );
                                    })
                                }
                            </div>
                        </div>
                    );
                })}

            </div>

            <div style={{textAlign: 'center', marginTop: "25px", color: "#f7ff63"}}>VLASTNÍ</div>
            <hr style={{margin: '10px 0', border: '1px solid #f9ffa6'}}/>

            <CanvasContent
                style={{width: "100%"}}
                key={5}
                isClicked={5 === canvasSelector[cameraIndex] && (ratioSelection.length === 0 || false)}

                onClick={() => {

                    setSelectedCounts({});
                    setRatioSelection([]);
                    setCountClicks(0);

                    setRatioCanvas(videoRef.current, 5, "vlastni", cameraIndex)

                }
                }
                hasError={!!errorMessage}
            >
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <input
                        id="widthDecimal"
                        type="number"
                        value={widthDecimal}
                        onChange={(e) => handleInputChange(e, setWidthDecimal)}
                        style={{
                            width: '100%',
                            padding: '4px',
                            borderRadius: '10px',
                            textAlign: "center",
                            background: "transparent",
                            border: "none"
                        }}
                    />
                    <div>px</div>
                </div>

                <div style={{display: 'flex', alignItems: 'center'}}>
                    <input
                        id="heightDecimal"
                        type="number"
                        value={heightDecimal}
                        onChange={(e) => handleInputChange(e, setHeightDecimal)}
                        style={{
                            width: '100%',
                            padding: '4px',
                            borderRadius: '10px',
                            textAlign: "center",
                            background: "transparent",
                            border: "none"
                        }}
                    />
                    <div>px</div>
                </div>

            </CanvasContent>

            <div style={{marginTop: "10px", fontSize: "12px", color: "#ffe564"}}>{errorMessage}</div>

            <SubmitBtn

                style={{marginTop: "5px"}}

                onClick={() => {
                    setSelectedCounts({});
                    setRatioSelection([]);
                    setCountClicks(0);

                    setRatioCanvas(videoRef.current, 1, null, cameraIndex);

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
                RESET
            </SubmitBtn>

        </div>
    );
};