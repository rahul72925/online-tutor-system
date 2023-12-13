export function getFileTypeFromMimeType(mimeType) {
  const audioTypes = ["audio/mp3", "audio/wav", "audio/mpeg"];
  const videoTypes = ["video/mp4", "video/webm", "video/ogg"];
  const imageTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];

  if (audioTypes.includes(mimeType)) {
    return "AUDIO";
  } else if (videoTypes.includes(mimeType)) {
    return "VIDEO";
  } else if (imageTypes.includes(mimeType)) {
    return "IMAGE";
  } else {
    return "UNKNOWN";
  }
}
