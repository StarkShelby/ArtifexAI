import {surpriseMePrompts} from '../Built-In-Prompts'
import FileSaver from 'file-saver'

export function getRandomPrompts(prompt){
    const randomindex = Math.floor(Math.random() * surpriseMePrompts.length)
    if(randomPromt=== prompt )
        return getRandomPrompts[prompt]
    
    const randomPromt= surpriseMePrompts[randomindex]
}

export async function downloadImage(_id,photo){
    FileSaver.saveAs(photo,`download-${_id}.jpg`)
}

export const convertImageUrlToBase64 = async (url) => {
  const response = await fetch(url)
  const blob = await response.blob()

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

