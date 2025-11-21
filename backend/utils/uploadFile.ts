// utils/uploadFile.ts
"use client";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/backend/firebase/config";

export function uploadFileWithProgress(file: File, path: string, onProgress?: (percent: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {

    const fileRef = ref(storage, path);
    const task = uploadBytesResumable(fileRef, file);

    task.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(Math.round(progress));
      },
      (error) => {
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(task.snapshot.ref);
          resolve(downloadURL);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}
