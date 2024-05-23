const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    // Menggunakan dua label: Cancer dan Non-Cancer
    const classes = ['Non-Cancer', 'Cancer'];

    const classResult = tf.argMax(prediction, 1).dataSync()[0];
    const label = classes[classResult];

    let explanation, suggestion;

    if (label === 'Non-Cancer') {
      explanation = "Hasil prediksi menunjukkan bahwa gambar tersebut tidak mengandung kanker.";
      suggestion = "Tetap jaga kesehatan Anda dan lakukan pemeriksaan rutin.";
    }
  
    if (label === 'Cancer') {
      explanation = "Hasil prediksi menunjukkan bahwa gambar tersebut mengandung tanda-tanda kanker.";
      suggestion = "Segera konsultasi dengan dokter terdekat untuk pemeriksaan lebih lanjut.";
    }

    return { confidenceScore, label, explanation, suggestion };
  } catch (error) {
    throw new InputError(`Terjadi kesalahan input: ${error.message}`);
  }
}

module.exports = predictClassification;
