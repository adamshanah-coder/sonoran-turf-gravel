'use client';

import { useEffect, useRef, useState } from 'react';

const materials = [
  { name: 'Sonoran Olive Turf', group: 'Turf', note: 'Natural multi-tone', color: '#667f35', atlas: 'variants', column: 0, row: 0 },
  { name: 'Emerald Turf', group: 'Turf', note: 'Deep showcase green', color: '#225d24', atlas: 'variants', column: 1, row: 0 },
  { name: 'Spring Turf', group: 'Turf', note: 'Soft fresh green', color: '#78964a', atlas: 'variants', column: 2, row: 0 },
  { name: 'Pet-Ready Turf', group: 'Turf', note: 'Short pile · drainage system', color: '#617a3f', atlas: 'variants', column: 3, row: 0, petReady: true },
  { name: 'Arizona Tan Pavers', group: 'Stone & Pavers', note: 'Warm desert blend', color: '#b89b78', atlas: 'variants', column: 0, row: 1 },
  { name: 'Ivory Travertine', group: 'Stone & Pavers', note: 'French pattern', color: '#d7c39e', atlas: 'variants', column: 1, row: 1 },
  { name: 'Red Clay Brick', group: 'Stone & Pavers', note: 'Classic running bond', color: '#9b4935', atlas: 'variants', column: 2, row: 1 },
  { name: 'Charcoal Pavers', group: 'Stone & Pavers', note: 'Modern dark blend', color: '#4f5051', atlas: 'variants', column: 3, row: 1 },
  { name: 'Apache Brown Gravel', group: 'Gravel', note: 'Warm brown', color: '#806348', atlas: 'variants', column: 0, row: 2 },
  { name: 'Madison Gold Gravel', group: 'Gravel', note: 'Golden desert tone', color: '#b58d4d', atlas: 'variants', column: 1, row: 2 },
  { name: 'Desert Rose Gravel', group: 'Gravel', note: 'Soft coral-red', color: '#aa655b', atlas: 'variants', column: 2, row: 2 },
  { name: 'Salt & Pepper Gravel', group: 'Gravel', note: 'Cool gray granite', color: '#77797a', atlas: 'variants', column: 3, row: 2 },
  { name: 'Pool Water', group: 'Features', note: 'Turquoise water', color: '#35a9c7', atlas: 'features', column: 2, row: 0 },
  { name: 'Fire Glow', group: 'Features', note: 'Ember texture', color: '#ef7136', atlas: 'features', column: 0, row: 1 },
  { name: 'Landscape Lighting', group: 'Features', note: 'Warm illumination', color: '#f4cf55', atlas: 'features', column: 2, row: 1 },
];

const atlasDefinitions = {
  variants: { src: '/material-variants-atlas.webp', columns: 4, rows: 3 },
  features: { src: '/material-texture-atlas.png', columns: 3, rows: 2 },
};

const materialGroups = ['Turf', 'Stone & Pavers', 'Gravel', 'Features'];

const tools = [
  ['brush', 'Brush'],
  ['area', 'Outline area'],
  ['rectangle', 'Rectangle'],
  ['ellipse', 'Ellipse'],
  ['eraser', 'Eraser'],
];

function Arrow() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

export default function YardDesigner() {
  const baseCanvasRef = useRef(null);
  const drawCanvasRef = useRef(null);
  const guideCanvasRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const shapeStartRef = useRef(null);
  const textureSourcesRef = useRef({});
  const [fileName, setFileName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('/project-travertine.png');
  const [material, setMaterial] = useState(materials[0]);
  const [tool, setTool] = useState('area');
  const [brushSize, setBrushSize] = useState(42);
  const [opacity, setOpacity] = useState(78);
  const [textureScale, setTextureScale] = useState(100);
  const [areaPoints, setAreaPoints] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showDrawing, setShowDrawing] = useState(true);
  const [usedMaterials, setUsedMaterials] = useState([]);
  const [plannedPlants, setPlannedPlants] = useState([]);

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
    Object.entries(atlasDefinitions).forEach(([atlasName, definition]) => {
      const atlas = new Image();
      atlas.onload = () => {
        const tileWidth = atlas.width / definition.columns;
        const tileHeight = atlas.height / definition.rows;
        materials.filter(choice => choice.atlas === atlasName).forEach(choice => {
          const source = document.createElement('canvas');
          source.width = tileWidth;
          source.height = tileHeight;
          source.getContext('2d').drawImage(
            atlas,
            choice.column * tileWidth,
            choice.row * tileHeight,
            tileWidth,
            tileHeight,
            0,
            0,
            tileWidth,
            tileHeight
          );
          textureSourcesRef.current[choice.name] = source;
        });
      };
      atlas.src = definition.src;
    });
  }, []);

  useEffect(() => {
    const updatePlants = event => setPlannedPlants(event.detail || []);
    window.addEventListener('plant-plan-update', updatePlants);
    return () => window.removeEventListener('plant-plan-update', updatePlants);
  }, []);

  useEffect(() => {
    drawAreaGuide(areaPoints);
  }, [areaPoints]);

  const getPoint = event => {
    const canvas = guideCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const createMaterialPattern = context => {
    const source = textureSourcesRef.current[material.name];
    if (!source) return material.color;
    const size = Math.max(80, Math.round(240 * (textureScale / 100)));
    const tile = document.createElement('canvas');
    tile.width = size;
    tile.height = size;
    tile.getContext('2d').drawImage(source, 0, 0, size, size);
    return context.createPattern(tile, 'repeat');
  };

  const configureMaterial = context => {
    context.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    context.globalAlpha = tool === 'eraser' ? 1 : opacity / 100;
    context.fillStyle = createMaterialPattern(context);
    context.strokeStyle = createMaterialPattern(context);
    context.shadowColor = tool === 'eraser' ? 'transparent' : 'rgba(0,0,0,.16)';
    context.shadowBlur = tool === 'eraser' ? 0 : 3;
  };

  const noteMaterial = () => {
    if (tool === 'eraser') return;
    setUsedMaterials(current => current.includes(material.name) ? current : [...current, material.name]);
  };

  const saveHistory = () => {
    const snapshot = drawCanvasRef.current.toDataURL();
    setHistory(current => {
      const next = current.slice(0, historyIndex + 1);
      next.push(snapshot);
      setHistoryIndex(next.length - 1);
      return next;
    });
  };

  const clearGuide = () => {
    const canvas = guideCanvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  };

  const drawAreaGuide = points => {
    const canvas = guideCanvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (!points.length) return;
    context.save();
    context.strokeStyle = '#f0c76b';
    context.fillStyle = '#f0c76b';
    context.lineWidth = 3;
    context.setLineDash([10, 8]);
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach(point => context.lineTo(point.x, point.y));
    context.stroke();
    context.setLineDash([]);
    points.forEach(point => {
      context.beginPath();
      context.arc(point.x, point.y, 7, 0, Math.PI * 2);
      context.fill();
    });
    context.restore();
  };

  const applyArea = () => {
    if (areaPoints.length < 3) return;
    const context = drawCanvasRef.current.getContext('2d');
    context.save();
    configureMaterial(context);
    context.beginPath();
    context.moveTo(areaPoints[0].x, areaPoints[0].y);
    areaPoints.slice(1).forEach(point => context.lineTo(point.x, point.y));
    context.closePath();
    context.fill();
    context.restore();
    noteMaterial();
    setAreaPoints([]);
    saveHistory();
  };

  const cancelArea = () => {
    setAreaPoints([]);
    clearGuide();
  };

  const startPointer = event => {
    event.preventDefault();
    const point = getPoint(event);
    if (tool === 'area') {
      setAreaPoints(current => [...current, point]);
      return;
    }
    drawingRef.current = true;
    lastPointRef.current = point;
    shapeStartRef.current = point;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const movePointer = event => {
    if (!drawingRef.current) return;
    event.preventDefault();
    const point = getPoint(event);
    if (tool === 'brush' || tool === 'eraser') {
      const context = drawCanvasRef.current.getContext('2d');
      context.save();
      configureMaterial(context);
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.lineWidth = brushSize;
      context.beginPath();
      context.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      context.lineTo(point.x, point.y);
      context.stroke();
      context.restore();
      lastPointRef.current = point;
      return;
    }
    drawShapeGuide(shapeStartRef.current, point, tool);
  };

  const drawShapeGuide = (start, end, shape) => {
    const context = guideCanvasRef.current.getContext('2d');
    clearGuide();
    context.save();
    context.strokeStyle = '#f0c76b';
    context.fillStyle = 'rgba(240,199,107,.16)';
    context.lineWidth = 3;
    context.setLineDash([10, 8]);
    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);
    context.beginPath();
    if (shape === 'ellipse') context.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
    else context.rect(x, y, width, height);
    context.fill();
    context.stroke();
    context.restore();
  };

  const commitShape = (start, end, shape) => {
    const context = drawCanvasRef.current.getContext('2d');
    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);
    if (width < 8 || height < 8) return;
    context.save();
    configureMaterial(context);
    context.beginPath();
    if (shape === 'ellipse') context.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
    else context.rect(x, y, width, height);
    context.fill();
    context.restore();
    noteMaterial();
  };

  const stopPointer = event => {
    if (!drawingRef.current) return;
    const point = getPoint(event);
    if (tool === 'rectangle' || tool === 'ellipse') commitShape(shapeStartRef.current, point, tool);
    else noteMaterial();
    drawingRef.current = false;
    lastPointRef.current = null;
    shapeStartRef.current = null;
    clearGuide();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    saveHistory();
  };

  const clearDrawing = () => {
    const canvas = drawCanvasRef.current;
    if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setHistory([]);
    setHistoryIndex(-1);
    setUsedMaterials([]);
    cancelArea();
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

  const chooseTool = nextTool => {
    cancelArea();
    setTool(nextTool);
  };

  return (
    <section id="studio" className="studio sectionPad">
      <div className="yardDesigner">
        <div className="canvasStage" aria-label="Yard design drawing area">
          <canvas ref={baseCanvasRef} width="1200" height="675" />
          <canvas ref={drawCanvasRef} width="1200" height="675" className={showDrawing ? '' : 'drawingHidden'} />
          <canvas
            ref={guideCanvasRef}
            width="1200"
            height="675"
            className={`guideCanvas tool-${tool}`}
            onPointerDown={startPointer}
            onPointerMove={movePointer}
            onPointerUp={stopPointer}
            onPointerCancel={stopPointer}
          />
          <span>{fileName ? 'Your yard photo' : 'Try it on this sample'}</span>
          {tool === 'area' && <div className="canvasHint">Click around an area, then choose Apply area</div>}
        </div>
        {tool === 'area' && areaPoints.length > 0 && (
          <div className="areaActions">
            <span>{areaPoints.length} point{areaPoints.length === 1 ? '' : 's'} placed</span>
            <button type="button" onClick={cancelArea}>Cancel</button>
            <button type="button" onClick={applyArea} disabled={areaPoints.length < 3}>Apply area</button>
          </div>
        )}
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
        <h2>Shape a more believable outdoor concept.</h2>
        <p>Outline full areas for a clean material fill, use shapes for structured features, or switch to the brush for finishing touches. Everything stays private in your browser.</p>
        <fieldset className="studioToolPicker">
          <legend>1. Choose a tool</legend>
          <div className="toolChoices">
            {tools.map(([value, label]) => (
              <button type="button" className={tool === value ? 'selected' : ''} onClick={() => chooseTool(value)} key={value}>{label}</button>
            ))}
          </div>
        </fieldset>
        <fieldset className="studioToolPicker">
          <legend>2. Choose a material</legend>
          <div className="materialGroups">
            {materialGroups.map(group => (
              <div className="materialGroup" key={group}>
                <span>{group}</span>
                <div className="studioChoices">
                  {materials.filter(choice => choice.group === group).map(choice => {
                    const atlas = atlasDefinitions[choice.atlas];
                    const x = atlas.columns === 1 ? 0 : (choice.column / (atlas.columns - 1)) * 100;
                    const y = atlas.rows === 1 ? 0 : (choice.row / (atlas.rows - 1)) * 100;
                    return (
                      <button
                        type="button"
                        className={material.name === choice.name && tool !== 'eraser' ? 'selected' : ''}
                        aria-pressed={material.name === choice.name && tool !== 'eraser'}
                        onClick={() => { setMaterial(choice); if (tool === 'eraser') setTool('area'); }}
                        key={choice.name}
                      >
                        <i style={{ backgroundImage: `url(${atlas.src})`, backgroundPosition: `${x}% ${y}%`, backgroundSize: `${atlas.columns * 100}% ${atlas.rows * 100}%` }} />
                        <b>{choice.name}</b>
                        <small>{choice.note}</small>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {material.petReady && <p className="petTurfNote">Pet-ready refers to the complete turf system: permeable backing, drainage base, pet-safe infill, odor control, and correct installation—not color alone.</p>}
        </fieldset>
        <div className="designerSliders">
          <label>Opacity
            <input type="range" min="30" max="100" value={opacity} onChange={event => setOpacity(Number(event.target.value))} />
            <span>{opacity}%</span>
          </label>
          <label>Texture scale
            <input type="range" min="45" max="180" value={textureScale} onChange={event => setTextureScale(Number(event.target.value))} />
            <span>{textureScale}%</span>
          </label>
          {(tool === 'brush' || tool === 'eraser') && <label>Brush size
            <input type="range" min="12" max="120" value={brushSize} onChange={event => setBrushSize(Number(event.target.value))} />
            <span>{brushSize}px</span>
          </label>}
        </div>
        <label className="uploadButton">
          <input type="file" accept="image/*" onChange={choosePhoto} />
          {fileName ? 'Choose a different photo' : 'Upload your yard photo'} <Arrow />
        </label>
        {fileName && <p className="selectedFile">{fileName}</p>}
        <div className="designSummary">
          <span>Design summary</span>
          <p>{usedMaterials.length ? usedMaterials.join(' · ') : 'Your selected materials will appear here.'}</p>
          {plannedPlants.length > 0 && <p className="plantSummary">Plants: {plannedPlants.join(' · ')}</p>}
        </div>
        <p className="finePrint">Start with Outline area for the cleanest result. This is a planning concept, not a construction document.</p>
      </div>
    </section>
  );
}
