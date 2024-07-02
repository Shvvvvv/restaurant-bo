const readerFileImage = (file) => {
  const reader = new FileReader(file);
  reader.onload = (e) => {
    setImageUpload(e.target.result);
  };
  reader.readAsDataURL(file);
};

export default readerFileImage;
