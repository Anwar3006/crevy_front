// utils/cloudinary.ts
export const getOptimizedVideoUrl = (publicId: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
  if (!baseUrl) {
    console.error("CLOUDINARY_URL is not defined");
    return "";
  }
  const transformations = "q_auto,f_auto,vc_auto";
  const version = "v1781051645";
  const folder = "crevy_frontend";

  // Returns: https://res.cloudinary.com/.../upload/q_auto,f_auto,vc_auto/v1781051645/crevy_frontend/vid1_evu7tf.mp4
  return `${baseUrl}/${transformations}/${version}/${folder}/${publicId}`;
};
