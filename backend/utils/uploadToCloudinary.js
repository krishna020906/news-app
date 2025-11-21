// utils/uploadToCloudinary.js
"use client";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/**
 * Upload a file to Cloudinary with progress callback.
 * Returns a Promise that resolves to secure_url.
 */
export function uploadToCloudinary(file, folder, onProgress) {
  return new Promise((resolve, reject) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      return reject(new Error("Cloudinary env vars are missing"));
    }

    // image or video endpoint
    const isVideo = file.type.startsWith("video/");
    const resourceType = isVideo ? "video" : "image";

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    if (folder) {
      formData.append("folder", folder); // matches your preset folder or subfolder
    }

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && typeof onProgress === "function") {
        const percent = Math.round((event.loaded * 100) / event.total);
        onProgress(percent);
      }
    });

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;

      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url);
        } catch (err) {
          reject(err);
        }
      } else {
        reject(new Error("Cloudinary upload failed: " + xhr.statusText));
      }
    };

    xhr.open("POST", url);
    xhr.send(formData);
  });
}
