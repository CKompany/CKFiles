import { useCallback, useEffect, useState } from 'react';
import './App.css';

interface coordinates {
  x: number;
  y: number;
  size: number;
}
function App() {
  const [position, setPosition] = useState<coordinates>({ x: 0, y: 0, size: 1 });

  const handleArrowKeyEvent = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setPosition({ x: position.x - 10, y: position.y, size: position.size });
          break;
        case 'ArrowDown':
          setPosition({ x: position.x + 10, y: position.y, size: position.size });
          break;
        case 'ArrowLeft':
          setPosition({ x: position.x, y: position.y - 10, size: position.size });
          break;
        case 'ArrowRight':
          setPosition({ x: position.x, y: position.y + 10, size: position.size });
          break;
        default:
          break;
      }
    },
    [setPosition, position]
  );

  const handleScrollEvent = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const size = position.size + (e.deltaY * -1) / 100;
      if (size > 0 && size < 20) {
        setPosition({ x: position.x, y: position.y, size: size });
      }
    },
    [setPosition, position]
  );

  const handleDragEvent = useCallback((e: DragEvent) => {
    console.log(e);
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleArrowKeyEvent);
    document.addEventListener('wheel', handleScrollEvent, {
      passive: false
    });
    document.addEventListener('drag', handleDragEvent);

    return () => {
      document.removeEventListener('wheel', handleScrollEvent);
      document.removeEventListener('keydown', handleArrowKeyEvent);
      document.removeEventListener('drag', handleDragEvent);
    };
  }, [handleScrollEvent, handleArrowKeyEvent, handleDragEvent]);

  return (
    <div
      className='min-w-[100dvw] w-full min-h-[100dvh] h-full  flex justify-center items-center overflow-hidden'
      draggable='true'
      style={{
        transform: `translate(${position.y}px, ${position.x}px) scale(${position.size})`
      }}
    >
      <div className={`w-10 h-10 relative rounded-full bg-red-500`}></div>
    </div>
  );
}

export default App;
