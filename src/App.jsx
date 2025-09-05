import images from './data/putDataHere.json';
import './App.css';
import { resolveAssetPath } from './utils/resolveAssetPath';

function App() {
  return (
    <div className='centered'>
      {images.map(({ src, width, height, alt }) => (
        <img
          key={src}
          src={resolveAssetPath(src)}
          width={width}
          height={height}
          alt={alt || 'image'}
          style={{ margin: '0 20px' }}
        />
      ))}
    </div>
  );
}

export default App;
