import { pipeline } from '@xenova/transformers'

let model;

const loadModel = async () => {
    if (!model) {
        model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
};



const getSentenceEmbeddings = async (text) => {
    if (!model) await loadModel();
    const output = await model(text, { pooling: 'mean', normalize: true });
    return output.data;
}



export { getSentenceEmbeddings };