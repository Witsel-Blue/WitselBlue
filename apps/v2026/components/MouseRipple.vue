<template>
    <div class='mouse-ripple' aria-hidden='true'>
        <canvas v-if='debug' ref='debugCanvas' class='mouse-ripple__debug' />
    </div>
</template>

<script>
const SVG_NS = 'http://www.w3.org/2000/svg';
const XLINK_NS = 'http://www.w3.org/1999/xlink';

const FILTER_ID = 'mouse-ripple-filter';
const POOL_SIZE = 80;
const BRUSH_SIZE = 260;
const BRUSH_THRESHOLD = 4;
const SPACING = 18;
const CANVAS_WIDTH = 384;
// In objectBoundingBox primitive units, this is a fraction of the filtered
// element's width/height. Max actual displacement is ~scale/2.
const DISPLACEMENT_SCALE = 0.15;

export default {
    name: 'MouseRipple',

    props: {
        debug: {
            type: Boolean,
            default: false,
        },
    },

    mounted() {
        this.initRipple();
    },

    beforeDestroy() {
        this.disposeRipple();
    },

    methods: {
        initRipple() {
            // Build SVG/filter imperatively so the elements live in the SVG
            // namespace regardless of how Vue parses the template. Lots of
            // SVG-in-HTML edge cases vanish with createElementNS.
            this.buildSvgFilter();

            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d', { alpha: false });
            this.updateCanvasSize();

            this.brushImage = this.createBrushImage();
            this.brushes = [];
            for (let i = 0; i < POOL_SIZE; i += 1) {
                this.brushes.push({
                    visible: false,
                    x: 0,
                    y: 0,
                    scale: 1,
                    opacity: 0,
                    rotation: 0,
                });
            }
            this.currentWave = 0;

            this.mouse = { x: 0, y: 0 };
            this.prevMouse = { x: 0, y: 0 };
            this.firstMove = true;

            this.onMouseMove = (event) => {
                this.mouse.x = event.clientX;
                this.mouse.y = event.clientY;
                if (this.firstMove) {
                    this.prevMouse.x = this.mouse.x;
                    this.prevMouse.y = this.mouse.y;
                    this.firstMove = false;
                }
            };

            this.onTouchMove = (event) => {
                if (!event.touches.length) return;
                this.mouse.x = event.touches[0].clientX;
                this.mouse.y = event.touches[0].clientY;
                if (this.firstMove) {
                    this.prevMouse.x = this.mouse.x;
                    this.prevMouse.y = this.mouse.y;
                    this.firstMove = false;
                }
            };

            this.onResize = () => this.updateCanvasSize();

            window.addEventListener('mousemove', this.onMouseMove, { passive: true });
            window.addEventListener('touchmove', this.onTouchMove, { passive: true });
            window.addEventListener('resize', this.onResize, { passive: true });

            this.drawNeutral();
            this.pushDisplacement();

            this.running = true;
            this.animate();
        },

        buildSvgFilter() {
            // Remove any leftover filter (hot reload safety)
            const existing = document.getElementById(FILTER_ID);
            if (existing && existing.parentNode) {
                const oldSvg = existing.closest('svg');
                if (oldSvg && oldSvg.parentNode) {
                    oldSvg.parentNode.removeChild(oldSvg);
                }
            }

            const svg = document.createElementNS(SVG_NS, 'svg');
            svg.setAttribute('width', '0');
            svg.setAttribute('height', '0');
            svg.style.cssText =
                'position:fixed;top:0;left:0;width:0;height:0;pointer-events:none;overflow:hidden;';
            svg.setAttribute('aria-hidden', 'true');

            const defs = document.createElementNS(SVG_NS, 'defs');
            const filter = document.createElementNS(SVG_NS, 'filter');
            filter.setAttribute('id', FILTER_ID);
            // Both units use the filtered element's bounding box so percentages
            // (and feDisplacementMap.scale) don't depend on the SVG host size.
            filter.setAttribute('filterUnits', 'objectBoundingBox');
            filter.setAttribute('primitiveUnits', 'objectBoundingBox');
            filter.setAttribute('x', '0');
            filter.setAttribute('y', '0');
            filter.setAttribute('width', '1');
            filter.setAttribute('height', '1');
            filter.setAttribute('color-interpolation-filters', 'sRGB');

            const feImage = document.createElementNS(SVG_NS, 'feImage');
            feImage.setAttribute('result', 'DISP');
            feImage.setAttribute('preserveAspectRatio', 'none');
            feImage.setAttribute('x', '0');
            feImage.setAttribute('y', '0');
            feImage.setAttribute('width', '1');
            feImage.setAttribute('height', '1');

            const feDisp = document.createElementNS(SVG_NS, 'feDisplacementMap');
            feDisp.setAttribute('in', 'SourceGraphic');
            feDisp.setAttribute('in2', 'DISP');
            feDisp.setAttribute('scale', String(DISPLACEMENT_SCALE));
            feDisp.setAttribute('xChannelSelector', 'R');
            feDisp.setAttribute('yChannelSelector', 'G');

            filter.appendChild(feImage);
            filter.appendChild(feDisp);
            defs.appendChild(filter);
            svg.appendChild(defs);
            document.body.appendChild(svg);

            this.svgEl = svg;
            this.feImage = feImage;
            this.feDisp = feDisp;
        },

        updateCanvasSize() {
            this.viewportWidth = window.innerWidth;
            this.viewportHeight = window.innerHeight;
            const aspect = this.viewportWidth / this.viewportHeight;
            this.canvasW = CANVAS_WIDTH;
            this.canvasH = Math.max(1, Math.round(CANVAS_WIDTH / aspect));
            if (this.canvas) {
                this.canvas.width = this.canvasW;
                this.canvas.height = this.canvasH;
            }
        },

        // Brush encodes a radial displacement vector in R/G channels with
        // grain so the trail looks like watery turbulence rather than a clean
        // ring.
        createBrushImage() {
            const size = 128;
            const c = document.createElement('canvas');
            c.width = size;
            c.height = size;
            const ctx = c.getContext('2d');
            const img = ctx.createImageData(size, size);
            const center = (size - 1) / 2;

            for (let y = 0; y < size; y += 1) {
                for (let x = 0; x < size; x += 1) {
                    const idx = (y * size + x) * 4;
                    const dx = (x - center) / center;
                    const dy = (y - center) / center;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist > 1) {
                        img.data[idx] = 128;
                        img.data[idx + 1] = 128;
                        img.data[idx + 2] = 128;
                        img.data[idx + 3] = 0;
                        continue;
                    }

                    const falloff = Math.cos(dist * Math.PI * 0.5) ** 2;
                    const grain = (Math.random() - 0.5) * 0.3;
                    const ndx = dist > 0.001 ? dx / dist : 0;
                    const ndy = dist > 0.001 ? dy / dist : 0;

                    const dispX = (ndx + grain) * falloff;
                    const dispY = (ndy + grain) * falloff;

                    img.data[idx] = Math.max(0, Math.min(255, 128 + dispX * 127));
                    img.data[idx + 1] = Math.max(0, Math.min(255, 128 + dispY * 127));
                    img.data[idx + 2] = 128;
                    img.data[idx + 3] = Math.floor(falloff * 255);
                }
            }

            ctx.putImageData(img, 0, 0);
            return c;
        },

        spawnWave(x, y) {
            this.currentWave = (this.currentWave + 1) % POOL_SIZE;
            const brush = this.brushes[this.currentWave];
            brush.visible = true;
            brush.x = x;
            brush.y = y;
            brush.scale = 0.2;
            brush.opacity = 0.55;
            brush.rotation = Math.random() * Math.PI * 2;
        },

        trackMouseTrail() {
            if (this.firstMove) return;
            const dx = this.mouse.x - this.prevMouse.x;
            const dy = this.mouse.y - this.prevMouse.y;
            const distance = Math.hypot(dx, dy);

            if (distance < BRUSH_THRESHOLD) return;

            const steps = Math.min(Math.ceil(distance / SPACING), 8);
            for (let i = 1; i <= steps; i += 1) {
                const t = i / steps;
                this.spawnWave(
                    this.prevMouse.x + dx * t,
                    this.prevMouse.y + dy * t,
                );
            }

            this.prevMouse.x = this.mouse.x;
            this.prevMouse.y = this.mouse.y;
        },

        updateBrushes() {
            for (let i = 0; i < this.brushes.length; i += 1) {
                const b = this.brushes[i];
                if (!b.visible) continue;
                b.rotation += 0.02;
                b.opacity *= 0.96;
                b.scale = 0.982 * b.scale + 0.108;
                if (b.opacity < 0.005) b.visible = false;
            }
        },

        drawNeutral() {
            this.ctx.fillStyle = 'rgb(128,128,128)';
            this.ctx.fillRect(0, 0, this.canvasW, this.canvasH);
        },

        drawCanvas() {
            this.drawNeutral();

            const sx = this.canvasW / this.viewportWidth;
            const sy = this.canvasH / this.viewportHeight;
            const brushBase = BRUSH_SIZE * sx;

            for (let i = 0; i < this.brushes.length; i += 1) {
                const b = this.brushes[i];
                if (!b.visible) continue;
                this.ctx.save();
                this.ctx.translate(b.x * sx, b.y * sy);
                this.ctx.rotate(b.rotation);
                this.ctx.globalAlpha = b.opacity;
                const s = brushBase * b.scale;
                this.ctx.drawImage(this.brushImage, -s / 2, -s / 2, s, s);
                this.ctx.restore();
            }
            this.ctx.globalAlpha = 1;

            if (this.debug && this.$refs.debugCanvas) {
                const dc = this.$refs.debugCanvas;
                if (dc.width !== this.canvasW || dc.height !== this.canvasH) {
                    dc.width = this.canvasW;
                    dc.height = this.canvasH;
                }
                const dctx = dc.getContext('2d');
                dctx.clearRect(0, 0, this.canvasW, this.canvasH);
                dctx.drawImage(this.canvas, 0, 0);
            }
        },

        pushDisplacement() {
            // Data URL is slower than blob URL but is the most reliable way to
            // get feImage to actually re-evaluate the filter. We avoid the
            // bandwidth issue by keeping the canvas small (384px wide).
            if (!this.feImage) return;
            const dataUrl = this.canvas.toDataURL('image/png');
            this.feImage.setAttribute('href', dataUrl);
            this.feImage.setAttributeNS(XLINK_NS, 'xlink:href', dataUrl);
        },

        animate() {
            if (!this.running) return;
            this.trackMouseTrail();
            this.drawCanvas();
            this.updateBrushes();
            this.pushDisplacement();
            this.animId = requestAnimationFrame(this.animate);
        },

        disposeRipple() {
            this.running = false;
            if (this.animId) cancelAnimationFrame(this.animId);
            if (this.onMouseMove) window.removeEventListener('mousemove', this.onMouseMove);
            if (this.onTouchMove) window.removeEventListener('touchmove', this.onTouchMove);
            if (this.onResize) window.removeEventListener('resize', this.onResize);
            if (this.svgEl && this.svgEl.parentNode) {
                this.svgEl.parentNode.removeChild(this.svgEl);
            }
        },
    },
};
</script>

<style scoped>
.mouse-ripple {
    position: fixed;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    pointer-events: none;
}

.mouse-ripple__debug {
    position: fixed;
    bottom: 12px;
    right: 12px;
    width: 240px;
    height: auto;
    border: 1px solid rgba(255, 255, 255, 0.4);
    background: #222;
    pointer-events: none;
    z-index: 10000;
}
</style>
