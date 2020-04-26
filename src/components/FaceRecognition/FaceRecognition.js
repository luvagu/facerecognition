import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imgUrl, bBox }) => {
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id='inputImage' src={imgUrl} alt="" width='500px' height='auto' />
                <div className='bounding-box' style={{top: bBox.topRow, right: bBox.rightCol, bottom: bBox.bottomRow, left: bBox.leftCol}}></div>
            </div>
        </div>
    )
}

export default FaceRecognition;