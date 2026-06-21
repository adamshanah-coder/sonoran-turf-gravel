'use client';

import { useEffect, useRef, useState } from 'react';

const materials = [
  { name: 'Turf', color: '#3d8b37', column: 0, row: 0, position: '0% 0%' },
  { name: 'Travertine', color: '#d7c39e', column: 1, row: 0, position: '50% 0%' },
  { name: 'Pool', color: '#35a9c7', column: 2, row: 0, position: '100% 0%' },
  { name: 'Fire', color: '#ef7136', column: 0, row: 1, position: '0% 100%' },
  { name: 'Gravel', color: '#9a7955', column: 1, row: 1, position: '50% 100%' },
  { name: 'Lighting', color: '#f4cf55', column: 2, row: 1, position: '100% 100%' },
];

function Arrow() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

export default function YardDesigner() {
  const baseCanvasRef = useRef(null);
  const drawCanvasRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const textureTilesRef = useRef({});
  const [fileName, setFileName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('/project-travertine.png');
  const [material, setMaterial] = useState(materials[0]);
  const [brushSize, setBrushSize] = useState(42);
  const [isErasing, setIsErasing] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showDrawing, setShowDrawing] = useState(true);

  useEffect(() => {
    const canvas = baseCanvasRef.current;
    const image = new Image();
    image.onload = () => {
      const context = canvas.getContext('2d');
      const scale = Math.max(canvas.width / image.width, canvas.height / image.height);
      const width = image.width * scale;
      const height = image.height * scale;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
    };
    image.src = photoUrl;
  }, [photoUrl]);

  useEffect(() => {
    const atlas = new Image();
    atlas.onload = () => {
      const tileWidth = atlas.width / 3;
      const tileHeight = atlas.height / 2;
      materials.forEach(choice => {
        const tile = document.createElement('canvas');
        tile.width = 240;
        tile.height = 240;
        tile.getContext('2d').drawImage(
          atlas,
          choice.column * tileWidth,
          choice.row * tileHeight,
          tileWidth,
          tileHeight,
          0,
          0,
          tile.width,
          tile.height
        );
        textureTilesRef.current[choice.name] = tile;
      });
    };
    atlas.src = '/material-texture-atlas.png';
  }, []);

  const clearDrawing = () => {
    const canvas = drawCanvasRef.current;
    if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setHistory([]);
    setHistoryIndex(-1);
  };

  const choosePhoto = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoUrl(reader.result);
      clearDrawing();
    };
    reader.readAsDataURL(file);
  };

  const getPoint = event => {
    const canvas = drawCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDrawing = event => {
    event.preventDefault();
    drawingRef.current = true;
    lastPointRef.current = getPoint(event);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const draw = event => {
    if (!drawingRef.current) return;
    event.preventDefault();
    const context = drawCanvasRef.current.getContext('2d');
    const point = getPoint(event);
    context.save();
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = brushSize;
    context.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';
    if (!isErasing && textureTilesRef.current[material.name]) {
      context.strokeStyle = context.createPattern(textureTilesRef.current[material.name], 'repeat');
    } else {
      context.strokeStyle = material.color;
    }
    context.globalAlpha = isErasing ? 1 : .82;
    context.shadowColor = isErasing ? 'transparent' : 'rgba(0,0,0,.18)';
    context.shadowBlur = isErasing ? 0 : 3;
    context.beginPath();
    context.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    context.lineTo(point.x, point.y);
    context.stroke();
    context.restore();
    lastPointRef.current = point;
  };

  const saveHistory = () => {
    const snapshot = drawCanvasRef.current.toDataURL();
    const next = history.slice(0, historyIndex + 1);
    next.push(snapshot);
    setHistory(next);
    setHistoryIndex(next.length - 1);
  };

  const stopDrawing = event => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastPointRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    saveHistory();
  };

  const restoreSnapshot = index => {
    const canvas = drawCanvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (index < 0) return;
    const image = new Image();
    image.onload = () => context.drawImage(image, 0, 0);
    image.src = history[index];
  };

  const undo = () => {
    if (historyIndex < 0) return;
    const nextIndex = historyIndex - 1;
    setHistoryIndex(nextIndex);
    restoreSnapshot(nextIndex);
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    const nextIndex = historyIndex + 1;
    setHistoryIndex(nextIndex);
    restoreSnapshot(nextIndex);
  };

  const downloadDesign = () => {
    const output = document.createElement('canvas');
    output.width = 1200;
    output.height = 675;
    const context = output.getContext('2d');
    context.drawImage(baseCanvasRef.current, 0, 0);
    context.drawImage(drawCanvasRef.current, 0, 0);
    const link = document.createElement('a');
    link.download = 'sonoran-yard-concept.png';
    link.href = output.toDataURL('image/png');
    link.click();
  };

  return (
    <section id="studio" className="studio sectionPad">
      <div className="yardDesigner">
        <div className="canvasStage" aria-label="Yard design drawing area">
          <canvas ref={baseCanvasRef} width="1200" height="675" />
          <canvas
            ref={drawCanvasRef}
            width="1200"
            height="675"
            className={showDrawing ? '' : 'drawingHidden'}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerCancel={stopDrawing}
          />
          <span>{fileName ? 'Your yard photo' : 'Try it on this sample'}</span>
        </div>
        <div className="canvasActions">
          <button type="button" onClick={undo} disabled={historyIndex < 0}>Undo</button>
          <button type="button" onClick={redo} disabled={historyIndex >= history.length - 1}>Redo</button>
          <button type="button" onClick={() => setShowDrawing(value => !value)}>{showDrawing ? 'Show before' : 'Show design'}</button>
          <button type="button" onClick={clearDrawing}>Clear</button>
          <button type="button" className="downloadDesign" onClick={downloadDesign}>Download</button>
        </div>
      </div>
      <div className="studioCopy">
        <p className="kicker">Free Yard Design Studio</p>
        <h2>Sketch your ideas directly onto your yard.</h2>
        <p>Upload a photo, choose a material, and paint over the areas you want to transform. This simple planning tool stays in your browser and costs nothing to use.</p>
        <fieldset className="studioToolPicker">
          <legend>Choose a material</legend>
          <div className="studioChoices">
            {materials.map(choice => (
              <button
                type="button"
                className={!isErasing && material.name === choice.name ? 'selected' : ''}
                aria-pressed={!isErasing && material.name === choice.name}
                onClick={() => { setMaterial(choice); setIsErasing(false); }}
                key={choice.name}
              >
                <i
                  style={{
                    backgroundImage: 'url(/material-texture-atlas.png)',
                    backgroundPosition: choice.position,
                    backgroundSize: '300% 200%',
                  }}
                />
                {choice.name}
              </button>
            ))}
            <button type="button" className={isErasing ? 'selected' : ''} aria-pressed={isErasing} onClick={() => setIsErasing(true)}>Eraser</button>
          </div>
        </fieldset>
        <label className="brushControl">Brush size
          <input type="range" min="12" max="120" value={brushSize} onChange={event => setBrushSize(Number(event.target.value))} />
          <span>{brushSize}px</span>
        </label>
        <label className="uploadButton">
          <input type="file" accept="image/*" onChange={choosePhoto} />
          {fileName ? 'Choose a different photo' : 'Upload your yard photo'} <Arrow />
        </label>
        {fileName && <p className="selectedFile">{fileName}</p>}
        <p className="finePrint">Tip: broad strokes work best for turf, patios, pools, and gravel. This is a planning sketch, not a construction document.</p>
      </div>
    </section>
  );
}
