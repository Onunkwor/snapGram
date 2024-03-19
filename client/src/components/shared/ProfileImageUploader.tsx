import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
type ProfileImageProps = {
    fieldChange: (Files: File[]) => void;
    mediaUrl?: string;
}
const ProfileImageUploader = ({fieldChange, mediaUrl}: ProfileImageProps) => {
 const [fileUrl, setFileUrl] = useState(mediaUrl);
 const onDrop = useCallback(
   (acceptedFiles: FileWithPath[]) => {
     fieldChange(acceptedFiles);
     setFileUrl(URL.createObjectURL(acceptedFiles[0]));
   },
   [fieldChange]
 );
 const { getRootProps, getInputProps } = useDropzone({
   onDrop,
   accept: {
     "image/*": [".png", ".jpg", ".jpeg", ".svg"],
   },
 });
 return (
   <div
     {...getRootProps()}
   >
     <input {...getInputProps()} className="cursor-pointer" />
       <div className="flex items-center gap-3">
        <img src={fileUrl} alt="profile image" className="rounded-full w-[100px] h-[100px]" />
        <p className="text-[#0095F6]">Change Profile Image</p>
       </div>
   </div>
 );
}

export default ProfileImageUploader