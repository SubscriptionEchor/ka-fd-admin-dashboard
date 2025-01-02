// import React, { useState, useRef } from "react";
// import Cropper from "react-cropper";
// import "cropperjs/dist/cropper.css";
// import { Modal, Box, Button, Typography, Grid } from '@mui/material';

// const ImageCropper = ({ onCropComplete }) => {
//     const [image, setImage] = useState("");
//     const [croppedImage, setCroppedImage] = useState("");
//     const [open, setOpen] = useState(false);
//     const cropperRef = useRef(null);

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = () => {
//                 setImage(reader.result);
//                 setOpen(true);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleCrop = () => {
//         const cropper = cropperRef.current?.cropper;
//         if (cropper) {
//             const croppedDataUrl = cropper.getCroppedCanvas().toDataURL();
//             setCroppedImage(croppedDataUrl);
//         }
//     };

//     const handleUpload = () => {
//         onCropComplete?.(croppedImage);
//         setOpen(false);
//     };

//     const handleClose = () => {
//         setOpen(false);
//     };

//     return (
//         <div className="image-cropper">
//             <input type="file" accept="image/*" onChange={handleFileChange} />
//             <Modal open={open} onClose={handleClose}>
//                 <Box sx={{
//                     position: 'absolute',
//                     top: '50%',
//                     left: '50%',
//                     transform: 'translate(-50%, -50%)',
//                     width: 800,
//                     bgcolor: 'background.paper',
//                     boxShadow: 24,
//                     p: 4
//                 }}>
//                     <Typography variant="h6" component="h2" gutterBottom>
//                         Crop Image
//                     </Typography>
//                     {image && (
//                         <Grid container spacing={2}>
//                             <Grid item xs={12} style={{ textAlign: 'center' }}>
//                                 <Button variant="contained" onClick={handleCrop} style={{ marginBottom: 10 }}>Crop Image</Button>
//                             </Grid>
//                             <Grid item xs={12}>
//                                 <Cropper
//                                     ref={cropperRef}
//                                     style={{ height: 300, width: "100%" }}
//                                     zoomTo={0.5}
//                                     initialAspectRatio={1}
//                                     src={image}
//                                     viewMode={1}
//                                     minCropBoxHeight={10}
//                                     minCropBoxWidth={10}
//                                     background={false}
//                                     responsive={true}
//                                     autoCropArea={1}
//                                     checkOrientation={false}
//                                     guides={true}
//                                     preview=".img-preview"
//                                 />
//                             </Grid>
//                             <Grid item xs={6} style={{ textAlign: 'center' }}>
//                                 <Typography variant="subtitle1" gutterBottom>Crop</Typography>
//                                 <div className="cropped-image" style={{ height: 100, border: '1px solid #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//                                     {croppedImage ? (
//                                         <img src={croppedImage} alt="Cropped" style={{ maxWidth: "100%", maxHeight: "100%" }} />
//                                     ) : (
//                                         <Typography variant="body2">Cropped image will appear here</Typography>
//                                     )}
//                                 </div>
//                                 {croppedImage && (
//                                     <Button variant="contained" color="primary" onClick={handleUpload} style={{ marginTop: 10 }}>
//                                         Upload Image
//                                     </Button>
//                                 )}
//                             </Grid>
//                             <Grid item xs={6} style={{ textAlign: 'center' }}>
//                                 <Typography variant="subtitle1" gutterBottom>Preview</Typography>
//                                 <div className="img-preview" style={{ width: '100%', height: 100, overflow: "hidden", border: '1px solid #ccc' }} />
//                             </Grid>
//                         </Grid>
//                     )}
//                 </Box>
//             </Modal>
//         </div>
//     );
// };

// export default ImageCropper;

// import React, { useState, useRef } from "react";
// import Cropper from "react-cropper";
// import "cropperjs/dist/cropper.css";
// import { Modal, Box, Button, Typography, Grid } from '@mui/material';

// const ImageCropper = ({ onCropComplete }) => {
//     const [image, setImage] = useState("");
//     const [croppedImage, setCroppedImage] = useState("");
//     const [open, setOpen] = useState(false);
//     const cropperRef = useRef(null);

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = () => {
//                 setImage(reader.result);
//                 setOpen(true);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleCrop = () => {
//         const cropper = cropperRef.current?.cropper;
//         if (cropper) {
//             const croppedDataUrl = cropper.getCroppedCanvas().toDataURL();
//             setCroppedImage(croppedDataUrl);
//         }
//     };

//     const handleUpload = () => {
//         onCropComplete?.(croppedImage);
//         setOpen(false);
//     };

//     const handleClose = () => {
//         setOpen(false);
//     };

//     return (
//         <div className="image-cropper">
//             <input type="file" accept="image/*" onChange={handleFileChange} />
//             <Modal open={open} onClose={handleClose}>
//                 <Box sx={{
//                     position: 'absolute',
//                     top: '50%',
//                     left: '50%',
//                     transform: 'translate(-50%, -50%)',
//                     width: 800,
//                     bgcolor: 'background.paper',
//                     boxShadow: 24,
//                     p: 4
//                 }}>
//                     <Typography variant="h6" component="h2" gutterBottom>
//                         Crop Image
//                     </Typography>
//                     {image && (
//                         <Grid container spacing={2}>
//                             <Grid item xs={12} style={{ textAlign: 'center' }}>
//                                 <Button variant="contained" onClick={handleCrop} style={{ marginBottom: 10 }}>Crop Image</Button>
//                             </Grid>
//                             <Grid item xs={12}>
//                                 <Cropper
//                                     ref={cropperRef}
//                                     style={{ height: 300, width: "100%" }}
//                                     zoomTo={0.5}
//                                     initialAspectRatio={1} // Ensures the crop area is a square
//                                     aspectRatio={1} // Locks the crop area to a square
//                                     src={image}
//                                     viewMode={1}
//                                     minCropBoxHeight={10}
//                                     minCropBoxWidth={10}
//                                     background={false}
//                                     responsive={true}
//                                     autoCropArea={1}
//                                     checkOrientation={false}
//                                     guides={true}
//                                     cropBoxResizable={false} // Disables resizing of the crop box
//                                     dragMode="move" // Allows only moving the crop box
//                                     preview=".img-preview"
//                                 />
//                             </Grid>
//                             <Grid item xs={6} style={{ textAlign: 'center' }}>
//                                 <Typography variant="subtitle1" gutterBottom>Crop</Typography>
//                                 <div className="cropped-image" style={{ height: 100, border: '1px solid #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//                                     {croppedImage ? (
//                                         <img src={croppedImage} alt="Cropped" style={{ maxWidth: "100%", maxHeight: "100%" }} />
//                                     ) : (
//                                         <Typography variant="body2">Cropped image will appear here</Typography>
//                                     )}
//                                 </div>
//                                 {croppedImage && (
//                                     <Button variant="contained" color="primary" onClick={handleUpload} style={{ marginTop: 10 }}>
//                                         Upload Image
//                                     </Button>
//                                 )}
//                             </Grid>
//                             <Grid item xs={6} style={{ textAlign: 'center'}}>
//                                 <Typography variant="subtitle1" gutterBottom>Preview</Typography>
//                                 <div className="img-preview" style={{ width: '100%', height: 100, overflow: "hidden", border: '1px solid #ccc' }} />
//                             </Grid>
//                         </Grid>
//                     )}
//                 </Box>
//             </Modal>
//         </div>
//     );
// };

// export default ImageCropper;


// import React, { useState, useRef } from "react";
// import Cropper from "react-cropper";
// import "cropperjs/dist/cropper.css";
// import { Modal, Box, Button, Typography, Grid } from "@mui/material";

// const ImageCropper = ({ onCropComplete }) => {
//     const [image, setImage] = useState("");
//     const [croppedImage, setCroppedImage] = useState("");
//     const [open, setOpen] = useState(false);
//     // const [showUploadButton, setShowUploadButton] = useState(false);
//     const cropperRef = useRef(null);

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = () => {
//                 setImage(reader.result);
//                 setOpen(true);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleCrop = () => {
//         const cropper = cropperRef.current?.cropper;
//         if (cropper) {
//             const croppedDataUrl = cropper.getCroppedCanvas().toDataURL();
//             setCroppedImage(croppedDataUrl);
//             // setShowUploadButton(true); // Show the upload button after cropping
//         }
//     };

//     const handleUpload = () => {
//         onCropComplete?.(croppedImage);
//         setOpen(false);
//     };

//     const handleClose = () => {
//         setOpen(false);
//     };

//     return (
//         <div className="image-cropper">
//             <input type="file" accept="image/*" onChange={handleFileChange} />
//             <Modal open={open} onClose={handleClose}>
//                 <Box
//                     sx={{
//                         position: "absolute",
//                         top: "50%",
//                         left: "50%",
//                         transform: "translate(-50%, -50%)",
//                         width: 800,
//                         bgcolor: "background.paper",
//                         boxShadow: 24,
//                         p: 4,
//                     }}
//                 >
//                     <Typography
//                         variant="h6"
//                         component="h2"
//                         gutterBottom
//                         style={{ textAlign: "center", marginBottom: 20 }}
//                     >
//                         Change Your Dish Image
//                     </Typography>
//                     {image && (
//                         <Grid container spacing={2}>
//                             {/* Cropper Section */}
//                             {/* <Grid item xs={12}>
//                                 <Cropper
//                                     ref={cropperRef}
//                                     style={{ height: 300, width: "100%" }}
//                                     zoomTo={0} // Zoom level when the image is loaded
//                                     initialAspectRatio={1}
//                                     aspectRatio={1}
//                                     src={image}
//                                     viewMode={1}
//                                     minCropBoxHeight={10}
//                                     minCropBoxWidth={10}
//                                     background={false}
//                                     responsive={true}
//                                     autoCropArea={1}
//                                     checkOrientation={false}
//                                     guides={true}
//                                     cropBoxResizable={false}
//                                     dragMode="move"
//                                     preview=".img-preview"
//                                 />
//                             </Grid> */}
//                             <Grid item xs={12}>
//                                 <Cropper
//                                     ref={cropperRef}
//                                     style={{ height: 250, width: "100%" }} // Decrease the height slightly
//                                     zoomTo={0} // Zoom level when the image is loaded
//                                     initialAspectRatio={1}
//                                     aspectRatio={1} // Keep the aspect ratio square
//                                     src={image}
//                                     viewMode={1}
//                                     minCropBoxHeight={10}
//                                     minCropBoxWidth={10}
//                                     background={false}
//                                     responsive={true}
//                                     autoCropArea={0.9} // Reduce the auto-crop area to allow more movement
//                                     checkOrientation={false}
//                                     guides={true}
//                                     cropBoxResizable={true} // Allow resizing of the crop box
//                                     dragMode="move" // Allow moving the image
//                                     preview=".img-preview"
//                                 />
//                             </Grid>

//                             {/* Preview Section */}
//                             <Grid item xs={2}>
//                                 <Typography
//                                     variant="subtitle1"
//                                     gutterBottom
//                                     style={{ fontWeight: "bold" }}
//                                 >
//                                     Preview Here
//                                 </Typography>
//                                 <div
//                                     className="img-preview"
//                                     style={{
//                                         height: "9rem",
//                                         overflow: "hidden",
//                                         border: "1px solid #ccc",
//                                         margin: "0 auto",
//                                     }}
//                                 />
//                             </Grid>

//                             <Grid
//                                 item
//                                 xs={10}
//                                 style={{ textAlign: "right" }} // Aligns content to the right
//                             >
//                                 <Button
//                                     variant="contained"
//                                     onClick={handleCrop}
//                                     style={{
//                                         backgroundColor: "#FFC107",
//                                         color: "#fff",
//                                         padding: "0px 10px",
//                                     }}
//                                 >
//                                     Crop Image
//                                 </Button>
//                             </Grid>

//                             {/* Upload Button */}

//                             <Grid item xs={12} >
//                                 <Button
//                                     variant="contained"
//                                     color="primary"
//                                     onClick={handleUpload}
//                                     style={{
//                                         backgroundColor: "#FFC107",
//                                         color: "#fff",
//                                         padding: "0px 9px"

//                                         //   fontWeight: "bold",
//                                         //   marginTop: 20,
//                                     }}
//                                 >
//                                     Upload Image
//                                 </Button>
//                             </Grid>

//                         </Grid>
//                     )}
//                 </Box>
//             </Modal>
//         </div>
//     );
// };

// export default ImageCropper;

import React, { useState, useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Modal, Box, Button, Typography, Grid } from "@mui/material";

const ImageCropper = ({ onCropComplete }) => {
    const [image, setImage] = useState("");
    const [croppedImage, setCroppedImage] = useState("");
    const [open, setOpen] = useState(false);
    const cropperRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
                setOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCrop = () => {
        const cropper = cropperRef.current?.cropper;
        if (cropper) {
            const croppedDataUrl = cropper.getCroppedCanvas().toDataURL();
            setCroppedImage(croppedDataUrl);
        }
    };

    const handleUpload = () => {
        const imageToUpload = croppedImage || image; // Use cropped image if available, otherwise use the original
        onCropComplete?.(imageToUpload);
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="image-cropper">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 800,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography
                        variant="h6"
                        component="h2"
                        gutterBottom
                        style={{ textAlign: "center", marginBottom: 20 }}
                    >
                        Change Your Dish Image
                    </Typography>
                    {image && (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Cropper
                                    ref={cropperRef}
                                    style={{ height: 250, width: "100%" }}
                                    zoomTo={0}
                                    initialAspectRatio={1}
                                    aspectRatio={1}
                                    src={image}
                                    viewMode={1}
                                    minCropBoxHeight={10}
                                    minCropBoxWidth={10}
                                    background={false}
                                    responsive={true}
                                    autoCropArea={0.9}
                                    checkOrientation={false}
                                    guides={true}
                                    cropBoxResizable={true}
                                    dragMode="move"
                                    preview=".img-preview"
                                />
                            </Grid>

                            <Grid item xs={2}>
                                <Typography
                                    variant="subtitle1"
                                    gutterBottom
                                    style={{ fontWeight: "bold" }}
                                >
                                    Preview Here
                                </Typography>
                                <div
                                    className="img-preview"
                                    style={{
                                        height: "9rem",
                                        overflow: "hidden",
                                        border: "1px solid #ccc",
                                        margin: "0 auto",
                                    }}
                                />
                            </Grid>

                            <Grid
                                item
                                xs={10}
                                style={{ textAlign: "right" }}
                            >
                                <Button
                                    variant="contained"
                                    onClick={handleCrop}
                                    style={{
                                        backgroundColor: "#FFC107",
                                        color: "#fff",
                                        padding: "0px 10px",
                                    }}
                                >
                                    Crop Image
                                </Button>
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleUpload}
                                    style={{
                                        backgroundColor: "#FFC107",
                                        color: "#fff",
                                        padding: "0px 9px",
                                    }}
                                >
                                    Upload Image
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                </Box>
            </Modal>
        </div>
    );
};

export default ImageCropper;