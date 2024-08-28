import React, {useState, useRef, useCallback, useEffect} from 'react';

const ResizableImage = ({piece, pieceLeft, piecesArray}) => {

    const [isResizing, setIsResizing] = useState(null);
    const startX = useRef(0);
    const startWidth = useRef(0);
    const startLeft = useRef(0);

    const containerRef = useRef(null);

    const gap = 10;

    const [width, setWidth] = useState(piece.width || 100);
    const [left, setLeft] = useState(piece.left || 0);

    const onMouseDown = useCallback((e, direction) => {

        e.preventDefault();
        setIsResizing(direction);
        startX.current = e.clientX;
        startWidth.current = width;
        startLeft.current = left;

    }, [width, left]);

    const onMouseMove = useCallback((e) => {

        if (isResizing) {

            console.log(piecesArray);

            const deltaX = e.clientX - startX.current;

            const index = piece.id;

            const rightSideItem = index < piecesArray.length - 1 ? piecesArray[index + 1].left : null;
            const leftSideItem = index > 0 ? piecesArray[index - 1].left + piecesArray[index - 1].width : null;

            if (isResizing === 'left') {

                let newWidth = Math.max(startWidth.current - deltaX, 50);
                let newLeft = startLeft.current + deltaX;


                if (leftSideItem !== null && newLeft < leftSideItem) {
                    newLeft = leftSideItem;
                    newWidth = startWidth.current - (newLeft - startLeft.current);
                }

                console.log(index, "item left", leftSideItem, "my item", newLeft);

                piecesArray[index].left = newLeft;
                piecesArray[index].width = newWidth;

                setWidth(newWidth);
                setLeft(newLeft);

                containerRef.current.style.width = `${newWidth}px`;
                containerRef.current.style.left = `${newLeft}px`;

            } else if (isResizing === 'right') {

                let newWidth = Math.max(startWidth.current + deltaX, 50);

                const rightSide = newWidth + piecesArray[index].left;

                console.log(index, "item right", rightSideItem, "my item", rightSide);

                if (rightSideItem !== null && rightSide > rightSideItem) {

                    newWidth = rightSideItem - piecesArray[index].left;
                }

                // piecesArray[index].left = left;
                piecesArray[index].width = newWidth;

                setWidth(newWidth);

                containerRef.current.style.width = `${newWidth}px`;
            }
        }

    }, [isResizing, piecesArray, piece.id]);

    const onMouseUp = useCallback(() => {
        setIsResizing(null);
    }, []);

    useEffect(() => {
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, [onMouseMove, onMouseUp]);

    const boxStyles = {
        width: `${width}px`,
        height: '50px',
        border: '1px solid #ccc',
        position: 'absolute',
        backgroundImage: `url(${piece.src})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'repeat-x',
        left: `${pieceLeft}px`
    };

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
            ref={containerRef}
            style={boxStyles}
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
        </div>
    );
};

export default ResizableImage;