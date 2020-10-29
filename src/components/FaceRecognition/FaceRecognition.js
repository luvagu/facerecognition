import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imgUrl, bBoxes }) => {
    // console.log('bBoxes', bBoxes)
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id='inputImage' src={imgUrl} alt="" width='500px' height='auto' />
                {
                    bBoxes.map((box, i) => {
                        return (
                            <div key={i} 
                                className='bounding-box' 
                                style={{ top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol }}>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default FaceRecognition;