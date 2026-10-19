// Hover crosshair for the elevation profile chart.
// The chart is fully readable without this script: the SVG carries a text
// description and the profile data table lists every figure.

const SVG_NS = 'http://www.w3.org/2000/svg';

const initProfileHover = (container) => {
  const svg = container.querySelector('svg');
  let payload;
  try {
    payload = JSON.parse(container.dataset.points || 'null');
  } catch {
    payload = null;
  }
  if (!svg || !payload || !Array.isArray(payload.points) || payload.points.length === 0) {
    return;
  }

  const points = payload.points;
  const plot = payload.plot;
  const viewWidth = svg.viewBox.baseVal.width;
  const viewHeight = svg.viewBox.baseVal.height;

  const cursor = document.createElementNS(SVG_NS, 'g');
  cursor.setAttribute('class', 'chart-cursor');
  cursor.style.display = 'none';

  const cursorLine = document.createElementNS(SVG_NS, 'line');
  cursorLine.setAttribute('y1', String(plot.top));
  cursorLine.setAttribute('y2', String(plot.bottom));

  const cursorDot = document.createElementNS(SVG_NS, 'circle');
  cursorDot.setAttribute('r', '4.5');

  cursor.append(cursorLine, cursorDot);
  svg.append(cursor);

  const tooltip = document.createElement('div');
  tooltip.className = 'chart-tooltip';
  tooltip.hidden = true;
  const tooltipValue = document.createElement('span');
  tooltipValue.className = 'chart-tooltip-value';
  const tooltipLabel = document.createElement('span');
  tooltipLabel.className = 'chart-tooltip-label';
  tooltip.append(tooltipValue, tooltipLabel);
  container.append(tooltip);

  const showAt = (clientX) => {
    const rect = svg.getBoundingClientRect();
    const viewX = ((clientX - rect.left) / rect.width) * viewWidth;

    let nearest = points[0];
    for (const point of points) {
      if (Math.abs(point.x - viewX) < Math.abs(nearest.x - viewX)) {
        nearest = point;
      }
    }

    cursorLine.setAttribute('x1', String(nearest.x));
    cursorLine.setAttribute('x2', String(nearest.x));
    cursorDot.setAttribute('cx', String(nearest.x));
    cursorDot.setAttribute('cy', String(nearest.y));
    cursor.style.display = '';

    tooltipValue.textContent = `${nearest.m.toLocaleString('en-GB')} m`;
    tooltipLabel.textContent = `at ${nearest.km} km`;
    tooltip.hidden = false;

    const cssX = (nearest.x / viewWidth) * rect.width;
    const cssY = (nearest.y / viewHeight) * rect.height;
    const half = tooltip.offsetWidth / 2;
    const clampedX = Math.min(Math.max(cssX, half + 4), rect.width - half - 4);
    tooltip.style.left = `${clampedX}px`;
    tooltip.style.top = `${cssY}px`;
  };

  svg.addEventListener('pointermove', (event) => {
    showAt(event.clientX);
  });
  svg.addEventListener('pointerleave', () => {
    cursor.style.display = 'none';
    tooltip.hidden = true;
  });
};

const chartContainer = document.querySelector('[data-profile-chart]');
if (chartContainer) {
  initProfileHover(chartContainer);
}
