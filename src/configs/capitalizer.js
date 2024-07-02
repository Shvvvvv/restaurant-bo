export const convertToTitleCase = (str) => {
  // Pisahkan string berdasarkan underscore
  const words = str.split("_");

  // Ubah setiap kata menjadi huruf besar pada awal katanya
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Gabungkan kembali kata-kata tersebut dengan spasi
  return capitalizedWords.join(" ");
};
