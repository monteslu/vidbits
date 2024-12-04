import React, {useEffect, useRef, useState} from 'react';
import floydSteinberg from 'floyd-steinberg';
import './App.css';


const styles = {

}

function App() {

  const vidRef = useRef();
  const canvasRefB8 = useRef();
  const canvasRefB6 = useRef();
  const canvasRefB4 = useRef();
  const canvasRefB4Red = useRef();
  const canvasRefB4Blue = useRef();
  
  const canvasRefBW = useRef();
  const canvasRefFS = useRef();
  const canvasRefDM4 = useRef();
  const canvasRefDM8 = useRef();
  const canvasRefInvert = useRef();
  const canvasRefSepia = useRef();

  const canvasRefTB = useRef();
  const canvasRefB16 = useRef();
  const canvasRefB12 = useRef();
  const canvasRefB8G = useRef();
  const canvasRefB7 = useRef();
  const canvasRefB4G = useRef();
  const canvasRefB2G = useRef();

  const canvasRefB2NoGreen = useRef();
  const canvasRefB2NoBlue = useRef();
  const canvasRefB2NoRed = useRef();

  const [stream, setStream] = useState();

  // this effect is only called once, so cleanup will only be called when the component unmounts
  useEffect(() => {
    return function cleanup() {
      console.log('Cleaning up: turning off video camera')
      vidOff()
    }
  }, [])

  // turn-of the camera
  const vidOff = () => {
    if (vidRef && vidRef.current && vidRef.current.srcObject) {
      const vid = vidRef.current
      const tracks = vid.srcObject.getTracks()
      tracks.forEach(track => {
        track.stop()
      })
    }
  }

  const startVid = async () => {
    let camStream;
    const constraints = {
      //video: camCount > 1 ? { facingMode: { exact: 'environment' } } : true,
      video: true,
      audio: false,
    }
    console.log('Attemping to get camera')
    try {
      camStream = await navigator.mediaDevices.getUserMedia(constraints)
    } catch (err) {
      console.log('Failed to get camera')
    }

    if (!camStream) {
      console.log('Attemping to get any camera')
      try {
        camStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        })
      } catch (err) {
        console.log('Failed to get camera')
      }
    }

    const vid = vidRef.current;
    console.log({stream, vid});
    vid.srcObject = camStream;

    vid.addEventListener('loadeddata', () => {
      const width = 240;
      const height = vid.videoHeight * (width / vid.videoWidth);
      vid.height = vid.videoHeight;
      vid.width = vid.videoWidth;
      vid.style.width = width + 'px';
      vid.style.height = height + 'px';
      const offCnv = document.createElement('canvas');
      offCnv.width = width;
      offCnv.height = height;
      const offCtx = offCnv.getContext('2d');

      function getCC(ref) {
        const c = ref.current;
        c.height = height;
        c.width = width;
        const ct = c.getContext('2d');
        return {c, ct};
      }
      
      
      const {ct: ctxB8} = getCC(canvasRefB8);
      const {ct: ctxB7} = getCC(canvasRefB7);
      const {ct: ctxB6} = getCC(canvasRefB6);
      const {ct: ctxB4} = getCC(canvasRefB4);
      const {ct: ctxB4Red} = getCC(canvasRefB4Red);
      const {ct: ctxB4Blue} = getCC(canvasRefB4Blue);

      const {ct: ctxB8G} = getCC(canvasRefB8G);
      const {ct: ctxB4G} = getCC(canvasRefB4G);
      const {ct: ctxB2G} = getCC(canvasRefB2G);

      const {ct: ctxB2NoGreen} = getCC(canvasRefB2NoGreen);
      const {ct: ctxB2NoBlue} = getCC(canvasRefB2NoBlue);
      const {ct: ctxB2NoRed} = getCC(canvasRefB2NoRed);

      const {ct: ctxFS} = getCC(canvasRefFS);
      const {ct: ctxDM4} = getCC(canvasRefDM4);
      const {ct: ctxDM8} = getCC(canvasRefDM8);
      const {ct: ctxBW} = getCC(canvasRefBW);
      const {ct: ctxInvert} = getCC(canvasRefInvert);
      const {ct: ctxSepia} = getCC(canvasRefSepia);
      const {ct: ctxTB} = getCC(canvasRefTB);
      const {ct: ctxB16} = getCC(canvasRefB16);
      const {ct: ctxB12} = getCC(canvasRefB12);

      function getImgData() {
        return offCtx.getImageData(0, 0, width, height);
      }
      

      const onframe = async () => {
        if (vid.videoWidth > 0) {

          offCtx.drawImage(vid, 0, 0,  width, height);

          // 16-bit
          const B16Data = getImgData();
          for(let i = 0; i < (B16Data.data.length / 4); i++) {
            B16Data.data[i * 4] = (B16Data.data[i * 4] >> 3) << 3;
            B16Data.data[i * 4 + 1] = (B16Data.data[i * 4 + 1] >> 2) << 2;
            B16Data.data[i * 4 + 2] = (B16Data.data[i * 4 + 2] >> 3) << 3;
          }
          ctxB16.putImageData(B16Data, 0 , 0);

          // 12-bit
          const B12Data = getImgData();
          for(let i = 0; i < (B12Data.data.length / 4); i++) {
            B12Data.data[i * 4] = (B12Data.data[i * 4] >> 4) << 4;
            B12Data.data[i * 4 + 1] = (B12Data.data[i * 4 + 1] >> 4) << 4;
            B12Data.data[i * 4 + 2] = (B12Data.data[i * 4 + 2] >> 4) << 4;
          }
          ctxB12.putImageData(B12Data, 0 , 0);

          const B8Data = getImgData();
          for(let i = 0; i < (B8Data.data.length / 4); i++) {
            B8Data.data[i * 4] = (B8Data.data[i * 4] >> 5) << 5;
            B8Data.data[i * 4 + 1] = (B8Data.data[i * 4 + 1] >> 5) << 5;
            B8Data.data[i * 4 + 2] = (B8Data.data[i * 4 + 2] >> 6) << 6;
          }
          ctxB8.putImageData(B8Data, 0 , 0);

          const B7Data = getImgData();
          for(let i = 0; i < (B7Data.data.length / 4); i++) {
            B7Data.data[i * 4] = (B7Data.data[i * 4] >> 6) << 6;
            B7Data.data[i * 4 + 1] = (B7Data.data[i * 4 + 1] >> 5) << 5;
            B7Data.data[i * 4 + 2] = (B7Data.data[i * 4 + 2] >> 6) << 6;
          }
          ctxB7.putImageData(B7Data, 0 , 0);

          const B6Data = getImgData();
          for(let i = 0; i < (B6Data.data.length / 4); i++) {
            B6Data.data[i * 4] = (B6Data.data[i * 4] >> 6) << 6;
            B6Data.data[i * 4 + 1] = (B6Data.data[i * 4 + 1] >> 6) << 6;
            B6Data.data[i * 4 + 2] = (B6Data.data[i * 4 + 2] >> 6) << 6;
          }
          ctxB6.putImageData(B6Data, 0 , 0);

          // 4 bit color - red
          const B4RedData = getImgData();
          for(let i = 0; i < (B4RedData.data.length / 4); i++) {
            B4RedData.data[i * 4] = (B4RedData.data[i * 4] >> 6) << 6;
            B4RedData.data[i * 4 + 1] = (B4RedData.data[i * 4 + 1] >> 7) << 7;
            B4RedData.data[i * 4 + 2] = (B4RedData.data[i * 4 + 2] >> 7) << 7;
          }
          ctxB4Red.putImageData(B4RedData, 0 , 0);


          // 4 bit color - green
          const B4Data = getImgData();
          for(let i = 0; i < (B4Data.data.length / 4); i++) {
            B4Data.data[i * 4] = (B4Data.data[i * 4] >> 7) << 7;
            B4Data.data[i * 4 + 1] = (B4Data.data[i * 4 + 1] >> 6) << 6;
            B4Data.data[i * 4 + 2] = (B4Data.data[i * 4 + 2] >> 7) << 7;
          }
          ctxB4.putImageData(B4Data, 0 , 0);

          // 4 bit color - blue
          const B4BlueData = getImgData();
          for(let i = 0; i < (B4BlueData.data.length / 4); i++) {
            B4BlueData.data[i * 4] = (B4BlueData.data[i * 4] >> 7) << 7;
            B4BlueData.data[i * 4 + 1] = (B4BlueData.data[i * 4 + 1] >> 7) << 7;
            B4BlueData.data[i * 4 + 2] = (B4BlueData.data[i * 4 + 2] >> 6) << 6;
          }
          ctxB4Blue.putImageData(B4BlueData, 0 , 0);

          // 2 bit color - no green
          const B2NoGreenData = getImgData();
          for(let i = 0; i < (B2NoGreenData.data.length / 4); i++) {
            B2NoGreenData.data[i * 4] = B2NoGreenData.data[i * 4] > 127 ? 255 : 0;
            B2NoGreenData.data[i * 4 + 1] = 0;
            B2NoGreenData.data[i * 4 + 2] = B2NoGreenData.data[i * 4 + 2] > 127 ? 255 : 0;
          }
          ctxB2NoGreen.putImageData(B2NoGreenData, 0 , 0);

          // 2 bit color - no blue
          const B2NoBlueData = getImgData();
          for(let i = 0; i < (B2NoBlueData.data.length / 4); i++) {
            B2NoBlueData.data[i * 4] = B2NoBlueData.data[i * 4] > 127 ? 255 : 0;
            B2NoBlueData.data[i * 4 + 1] = B2NoBlueData.data[i * 4 + 1] > 127 ? 255 : 0;
            B2NoBlueData.data[i * 4 + 2] = 0;
          }
          ctxB2NoBlue.putImageData(B2NoBlueData, 0 , 0);

          // 2 bit color - no red
          const B2NoRedData = getImgData();
          for(let i = 0; i < (B2NoRedData.data.length / 4); i++) {
            B2NoRedData.data[i * 4] = 0;
            B2NoRedData.data[i * 4 + 1] = B2NoRedData.data[i * 4 + 1] > 127 ? 255 : 0;
            B2NoRedData.data[i * 4 + 2] = B2NoRedData.data[i * 4 + 2] > 127 ? 255 : 0;
          }
          ctxB2NoRed.putImageData(B2NoRedData, 0 , 0);
          
          const B8GData = getImgData();
          for(let i = 0; i < (B8GData.data.length / 4); i++) {
            const total = B8GData.data[i * 4] + B8GData.data[i * 4 + 1] + B8GData.data[i * 4 + 2];
            const avg = Math.round(total / 3);
            B8GData.data[i * 4] = avg;
            B8GData.data[i * 4 + 1] = avg;
            B8GData.data[i * 4 + 2] = avg;
          }
          ctxB8G.putImageData(B8GData, 0 , 0);

          for(let i = 0; i < (B8GData.data.length / 4); i++) {
            const val = (B8GData.data[i * 4] >> 4) << 4;
            B8GData.data[i * 4] = val;
            B8GData.data[i * 4 + 1] = val;
            B8GData.data[i * 4 + 2] = val;
          }
          ctxB4G.putImageData(B8GData, 0 , 0);

          for(let i = 0; i < (B8GData.data.length / 4); i++) {
            const val = (B8GData.data[i * 4] >> 6) << 6;
            B8GData.data[i * 4] = val;
            B8GData.data[i * 4 + 1] = val;
            B8GData.data[i * 4 + 2] = val;
          }
          ctxB2G.putImageData(B8GData, 0 , 0);

          for(let i = 0; i < (B8GData.data.length / 4); i++) {
            const val = B8GData.data[i * 4] > 127 ? 255 : 0;
            B8GData.data[i * 4] = val;
            B8GData.data[i * 4 + 1] = val;
            B8GData.data[i * 4 + 2] = val;
          }
          ctxBW.putImageData(B8GData, 0 , 0);

          // 3 bit color
          const TBData = getImgData();
          for(let i = 0; i < (TBData.data.length / 4); i++) {
            TBData.data[i * 4] = TBData.data[i * 4] > 127 ? 255 : 0;
            TBData.data[i * 4 + 1] = TBData.data[i * 4 + 1] > 127 ? 255 : 0;
            TBData.data[i * 4 + 2] = TBData.data[i * 4 + 2] > 127 ? 255 : 0;
          }
          ctxTB.putImageData(TBData, 0 , 0);

          const InvertData = getImgData();
          for(let i = 0; i < (InvertData.data.length / 4); i++) {
            InvertData.data[i * 4] = 255 - InvertData.data[i * 4];
            InvertData.data[i * 4 + 1] = 255 - InvertData.data[i * 4 + 1];
            InvertData.data[i * 4 + 2] = 255 - InvertData.data[i * 4 + 2];
          }
          ctxInvert.putImageData(InvertData, 0 , 0);

          // 8 bit sepia
          const SepiaData = getImgData();
          for(let i = 0; i < (SepiaData.data.length / 4); i++) {
            const total = SepiaData.data[i * 4] + SepiaData.data[i * 4 + 1] + SepiaData.data[i * 4 + 2];
            const avg = Math.round(total / 3);
            //sepia is rgb(112, 66, 20)
            SepiaData.data[i * 4] = 112 + Math.round(avg * (143 / 255));
            SepiaData.data[i * 4 + 1] = 66 + Math.round(avg * (189 / 255));;
            SepiaData.data[i * 4 + 2] = 20 + Math.round(avg * (235 / 255));;
          }
          ctxSepia.putImageData(SepiaData, 0 , 0);

          // 1 bit dithered (floyd-steinberg)
          const FSData = getImgData();
          floydSteinberg(FSData);
          ctxFS.putImageData(FSData, 0 , 0);

          const DM4Data = getImgData();
          for(let i = 0; i < (DM4Data.data.length / 4); i++) {
            const db = FSData.data[ i * 4] ? 128 : -127
            DM4Data.data[i * 4] = Math.max(0, (DM4Data.data[i * 4] > 127 ? 255 : 0) + db);
            DM4Data.data[i * 4 + 1] = Math.max(0, (DM4Data.data[i * 4 + 1] > 127 ? 255 : 0) + db);
            DM4Data.data[i * 4 + 2] = Math.max(0, (DM4Data.data[i * 4 + 2] > 127 ? 255 : 0) + db);
          }
          ctxDM4.putImageData(DM4Data, 0 , 0);

          const DM8Data = getImgData();
          for(let i = 0; i < (DM8Data.data.length / 4); i++) {
            const db = FSData.data[ i * 4] ? 64 : -63
            DM8Data.data[i * 4] = Math.max(0, ((DM8Data.data[i * 4] >> 6) << 6) + db);
            DM8Data.data[i * 4 + 1] = Math.max(0, ((DM8Data.data[i * 4 + 1] >> 5) << 5) + db);
            DM8Data.data[i * 4 + 2] = Math.max(0, ((DM8Data.data[i * 4 + 2] >> 6) << 6) + db);
          }
          ctxDM8.putImageData(DM8Data, 0 , 0);


          requestAnimationFrame(onframe)
        }
      }
      requestAnimationFrame(onframe)
    });

    setStream(camStream);
    
  }

  console.log('render', stream);
  const display = stream ? '' : 'none';
  return (
    <div className="App">
      <button onClick={startVid} style={{display: stream ? 'none' : '', margin: '20px'}}>start cam</button>
    
      <div className="vidDisplay" style={{display}}>
        <div className="vidText">Cam RGB - 8,8,8(16.8M colors)</div>
        <video
          ref={vidRef}
          id={styles.video}
          muted
          autoPlay
          playsInline
        />
      </div>

      <div className="vidDisplay" style={{display}}>
        <div className="vidText">16bit - 5,6,5(65K colors)</div>
        <canvas ref={canvasRefB16}/>
      </div>

      <div className="vidDisplay" style={{display}}>
        <div className="vidText">12bit - 4,4,4(4096 colors)</div>
        <canvas ref={canvasRefB12}/>
      </div>

      <div className="vidDisplay" style={{display}}>
        <div className="vidText">8bit - 3,3,2(256 colors)</div>
        <canvas ref={canvasRefB8}/>
      </div>

      <div className="vidDisplay" style={{display}}>
        <div className="vidText">7bit - 2,3,2(128 colors)</div>
        <canvas ref={canvasRefB7}/>
      </div>

      <div className="vidDisplay" style={{display}}>
        <div className="vidText">6bit - 2,2,2(64 colors)</div>
        <canvas ref={canvasRefB6}/>
      </div>

      <div className="vidDisplay" style={{display}}>
        <div className="vidText">4bit - 2,1,1(16 colors)</div>
        <canvas ref={canvasRefB4Red}/>
      </div>

      <div className="vidDisplay" style={{display}}>
        <div className="vidText">4bit - 1,2,1(16 colors)</div>
        <canvas ref={canvasRefB4}/>
      </div>

      <div className="vidDisplay" style={{display}}>
        <div className="vidText">4bit - 1,1,2(16 colors)</div>
        <canvas ref={canvasRefB4Blue}/>
      </div>

      <div className="vidDisplay" style={{display}}>
        <div className="vidText">3bit - 1,1,1(8 colors)</div>
        <canvas ref={canvasRefTB}/>
      </div>

      <div className="vidDisplay" style={{display}}>
        <div className="vidText">2bit(<a rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/Color_Graphics_Adapter" target="_blank">CGA</a>) - 1,0,1</div>
        <canvas ref={canvasRefB2NoGreen}/>
      </div>

      <div className="vidDisplay" style={{display}}>
        <div className="vidText">2bit(<a rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/Color_Graphics_Adapter" target="_blank">CGA</a>) - 1,1,0</div>
        <canvas ref={canvasRefB2NoBlue}/>
      </div>

      <div className="vidDisplay" style={{display}}>
        <div className="vidText">2bit(<a rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/Color_Graphics_Adapter" target="_blank">CGA</a>) - 0,1,1</div>
        <canvas ref={canvasRefB2NoRed}/>
      </div>

      <div className="vidDisplay" style={{display}}>
        <div className="vidText">Invert RGB - 8,8,8</div>
        <canvas ref={canvasRefInvert}/>
      </div>

      <div className="vidDisplay" style={{display}}>
        <div className="vidText"><a rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/Sepia_(color)" target="_blank">Sepia</a> - 8bit(256 shades)</div>
        <canvas ref={canvasRefSepia}/>
      </div>

      <div className="vidDisplay" style={{display}}>
        <div className="vidText">Grayscale - 8bit(256 shades)</div>
        <canvas ref={canvasRefB8G}/>
      </div>

      <div className="vidDisplay" style={{display}}>
        <div className="vidText">Grayscale - 4bit(16 shades)</div>
        <canvas ref={canvasRefB4G}/>
      </div>

      <div className="vidDisplay" style={{display}}>
        <div className="vidText">Grayscale - 2bit(4 shades)</div>
        <canvas ref={canvasRefB2G}/>
      </div>

      <div className="vidDisplay" style={{display}}>
        <div className="vidText">1bit(black & white)</div>
        <canvas ref={canvasRefBW}/>
      </div>

      <div className="vidDisplay" style={{display}}>
        <div className="vidText">1bit(black & white) - <a rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering" target="_blank">dithered</a></div>
        <canvas ref={canvasRefFS}/>
      </div>

      <div className="vidDisplay" style={{display}}>
        <div className="vidText">4bit(1,1,1-8colors) + <a rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering" target="_blank">dither</a> bit</div>
        <canvas ref={canvasRefDM4}/>
      </div>

      <div className="vidDisplay" style={{display}}>
        <div className="vidText">8bit(2,3,2-128colors) + <a rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering" target="_blank">dither</a></div>
        <canvas ref={canvasRefDM8}/>
      </div>
      
      <br/><br/>
      <a rel="noopener noreferrer" href="https://github.com/monteslu/vidbits" target="_blank">source on github</a>
    </div>
  );
}

export default App;
