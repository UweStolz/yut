// @ts-ignore
import Canvas from 'drawille';
import bresenham from 'bresenham/generator';

export default function calculatePoints(frequenzyData: number[]): any {
  const canvas = new Canvas(64, 64);
  canvas.clear();
  frequenzyData.forEach((height: number, index) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const point of bresenham(index, 64, index, 64 - height)) {
      const { x, y } = point;
      canvas.set(x, y);
    }
  });
  const output = canvas.frame();
  return output;
}
