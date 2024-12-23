import React, {useState, useRef, useCallback, useEffect, useMemo} from 'react';
import {MdCancel} from "react-icons/md";

/** Funkce pro ovládání jednotlivých prvků časové osy **/
const TimelinePieces = ({
                            piece,
                            pieceLeft,
                            piecesArray,
                            onPieceUpdate,
                            barWidth,
                            handlePieceUpdate,
                            activeIndex,
                            pieceIsClicked,
                            timelineWidth,
                            btnName
                        }) => {

    // Změna velikosti prvku
    const [isResizing, setIsResizing] = useState(null);

    const startX = useRef(0);
    const startWidth = useRef(0);
    const startLeft = useRef(0);

    const containerRef = useRef(null);

    // Šířka prvku
    const [width, setWidth] = useState(piece.width || 100);

    // Levá odchylka prvku
    const [left, setLeft] = useState(piece.left || 0);

    // // Počet stisknutí částice uživatelem
    // const [clicks, setClicks] = useState(() => (clicks !== undefined ? clicks : 0));

    // // Aktuální velikost kamery
    // const [transition, setTransition] = useState(piece.transition || {id: {}, transitionID: 0, clicks: 0});

    /** Tah je detekován **/
    const onMouseDown = useCallback((e, direction) => {

        e.preventDefault();
        setIsResizing(direction);
        startX.current = e.clientX;
        startWidth.current = width;
        startLeft.current = left;

    }, [width, left]);

    /** Tah je v pohybu **/
    const onMouseMove = useCallback((e) => {

        const MIN_WIDTH = 100;

        if (isResizing) {

            // ID prvku
            const pieceID = piecesArray.findIndex(p => p.id === piece.id);

            const deltaX = e.clientX - startX.current;

            // Parametry pro novou šířku a levou odchylku
            let newWidth = Math.max(startWidth.current + (isResizing === 'right' ? deltaX : -deltaX), MIN_WIDTH);
            let newLeft = startLeft.current + (isResizing === 'left' ? deltaX : 0);

            // Nejbližší levý prvek
            const leftSidePiece = pieceID > 0 ? piecesArray[pieceID - 1] : null;

            // Nejbližší pravý prvek
            const rightSidePiece = pieceID < piecesArray.length - 1 ? piecesArray[pieceID + 1] : null;

            // Změna velikosti levé strany
            if (isResizing === 'left') {

                if ((leftSidePiece && newLeft < leftSidePiece.left + leftSidePiece.width) || newWidth === MIN_WIDTH) {

                    // newLeft = leftSidePiece.left + leftSidePiece.width;
                    //
                    // if (deltaX > 0) {
                    //
                    //     newWidth = startWidth.current;
                    //
                    // } else {
                    //
                    //     newWidth = -startWidth.current;
                    // }

                    return;

                }

                // Funkce drag-resize je zastavena tak, aby nepřesahovala počátek prvku Timeline
                if (newLeft <= 0) {

                    return;
                }

                // Změna velikosti pravé strany
            } else if (isResizing === 'right') {

                if (rightSidePiece && newLeft + newWidth > rightSidePiece.left) {

                    // newWidth = rightSidePiece.left - newLeft;

                    return;
                }

                // Funkce drag-resize je zastavena tak, aby nepřesahovala konec prvku Timeline
                if ((newLeft + newWidth) >= barWidth) {

                    return;
                }
            }

            // Nastavení nové šířky a levé odchylky
            setWidth(newWidth);
            setLeft(newLeft);

            // Nastavení aktuální šířky a levé odchylky prvku
            containerRef.current.style.width = `${newWidth}px`;
            containerRef.current.style.left = `${newLeft}px`;
        }

    }, [isResizing, piecesArray, piece.id]);

    const [cancelClipBtn, setCancelBtn] = useState(true);

    const checkCancel = piece.isSubmitted && !cancelClipBtn;

    /** Funkce spravující kliknutí na částici v Timeline **/
    const handleClick = (type) => {

        pieceIsClicked = true;

        if (type === "piece" && cancelClipBtn) {

            handlePieceUpdate(
                piece.id, piece.src, piece.width, piece.left, piece.isSubmitted, piece.arrow,
                piece.duration, 0, piece.arrowDirection, piece.transition, piece.cameraSize
            );

        } else if (type === "cancel") {

            // Zabraňuje spuštění kliknutí na prvek
            // event.stopPropagation();

            handlePieceUpdate(
                piece.id, piece.src, width, left, false, piece.arrow,
                piece.duration, 0, piece.arrowDirection, piece.transition, piece.cameraSize
            );

            // Smazání tlačítka
            setCancelBtn(true);
        }
    };

    /** Tah je ukončen **/
    const onMouseUp = useCallback(() => {

        // Aktualizace dat o prvku
        if (isResizing) {

            onPieceUpdate(piece.id, piece.src, width, left, piece.isSubmitted, piece.arrow,
                piece.duration, 0, piece.arrowDirection, piece.transition, piece.cameraSize);
        }

        setIsResizing(null);

    }, [isResizing, width, left, onPieceUpdate, piece.id, piece.isSubmitted, piece.arrow, piece.duration, piece.arrowDirection, piece.transition, piece.cameraSize]);

    useEffect(() => {

        if (!piece) return;

        // ID prvku
        const pieceID = piecesArray.findIndex(p => p.id === piece.id);

        // Nejbližší pravý prvek
        const rightSidePiece = pieceID < piecesArray.length - 1 ? piecesArray[pieceID + 1] : null;

        if (piece.isSubmitted && !isResizing) {

            setCancelBtn(false);

            const timelineWidthPX = timelineWidth.current.offsetWidth;

            const durationWidth = (timelineWidthPX / 60) * piece.duration;

            if (rightSidePiece !== null && (piece.left + durationWidth) < piecesArray[pieceID + 1].left) {

                console.log("V PORADKU");

                // Nastavení délky částice z výběru časového úseku
                setWidth(durationWidth);

            } else if (rightSidePiece !== null && (piece.left + durationWidth) > piecesArray[pieceID + 1].left) {

                const maxWidth = piecesArray[pieceID + 1].left - (piece.left);

                console.log(maxWidth);

                setWidth(maxWidth);
            }

            handlePieceUpdate(
                piece.id, piece.src, width, left, piece.isSubmitted, piece.arrow,
                piece.duration, 0, piece.arrowDirection, piece.transition, piece.cameraSize
            );
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

    }, [piece.isSubmitted, width, left, piece.transition, onMouseMove, onMouseUp]);

    // Stanovení stylů pro částici
    const boxStyles = useMemo(() => {

        console.log("PP", piece?.transition?.idPieces, piece.id, btnName)

        if (piece?.transition?.idPieces) {

            console.log("ZE BY?", Object.values(piece?.transition?.idPieces).some(value => value === piece.id));
        }

        return {
            display: 'flex',
            width: `${width}px`,
            height: '50px',
            border: pieceIsClicked &&
            piece?.transition?.idPieces &&
            Object.values(piece.transition.idPieces).some(value => value === piece.id)
                ? '2px solid #9e1a1f'
                : activeIndex === piece.id && pieceIsClicked
                    ? '2px solid var(--color-blue-8)'
                    : 'none',
            position: 'absolute',
            backgroundImage: `url(${piece.src})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'repeat-x',
            left: `${pieceLeft}px`,
            justifyContent: 'center'
        };
    }, [piece.transition]);

    const handleStyles = {
        position: 'absolute',
        top: 0,
        width: '10px',
        height: '100%',
        backgroundColor: 'var(--color-blue-4)',
        cursor: 'ew-resize',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const leftHandleStyles = {
        ...handleStyles,
        left: 0,
    };

    const rightHandleStyles = {
        ...handleStyles,
        right: 0,
    };

    return (

        <div
            key={piece.id}
            ref={containerRef}
            style={boxStyles}
            onClick={(e) => handleClick("piece", e)}
        >
            <div
                style={leftHandleStyles}
                onMouseDown={(e) => onMouseDown(e, 'left')}
            >|
            </div>

            <div
                style={rightHandleStyles}
                onMouseDown={(e) => onMouseDown(e, 'right')}
            >|
            </div>

            {/** Nabídka klip zrušit **/}
            {piece.isSubmitted && checkCancel && (
                <div
                    onClick={(e) => handleClick("cancel", e)}
                    style={{
                        display: checkCancel ? 'flex' : 'none',
                        position: 'absolute',
                        bottom: '0',
                        transform: 'translateY(30px)',
                        cursor: 'pointer',
                        background: "#9e1a1f",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "5px",
                        color: "white",
                        width: "100%",
                        gap: "5px",
                        maxWidth: "100px"
                    }}
                >
                    <MdCancel/> Zrušit

                </div>
            )}

        </div>
    );
};

export default TimelinePieces;