import React, { useState, useEffect } from 'react';
import { customizableComponent } from 'hocs/customization';

import { ImageContainer, ProgressBar, RemoveIcon, NumberOfHiddenImagesOverlay } from './styles';

const Image = ({ editing, image, onClick, onRemove, numberOfHiddenImages }) => {
  // simulate progress animation
  const [progress, setProgress] = useState(editing ? 0 : 100);
  useEffect(() => {
    if (progress >= 100) return;
    const timeout = setTimeout(() => {
      setProgress(progress + 0.5);
    }, 50);
    return () => clearTimeout(timeout);
  }, [progress]);

  const removeImage = e => {
    e.stopPropagation();
    onRemove(image);
  };

  return (
    <ImageContainer editing={editing} onClick={onClick}>
      {numberOfHiddenImages > 0 && (
        <NumberOfHiddenImagesOverlay>+ {numberOfHiddenImages}</NumberOfHiddenImagesOverlay>
      )}
      <ProgressBar progress={progress} />
      <img src={image.url} alt="" />
      {!!onRemove && <RemoveIcon onClick={removeImage} />}
    </ImageContainer>
  );
};

export default customizableComponent('Image', Image);