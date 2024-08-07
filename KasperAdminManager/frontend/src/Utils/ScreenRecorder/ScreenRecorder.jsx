import React, { useRef, useState } from "react";
import { Modal, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  BsRecordCircle,
  BsStopCircle,
  BsDownload,
  BsCamera,
  BsArrowsFullscreen,
  BsArrowsCollapse,
} from "react-icons/bs";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const ScreenRecorder = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [recording, setRecording] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const { darkMode } = useTheme();

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    videoRef.current.srcObject = stream;
    videoRef.current.play();

    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => {
      setChunks((prev) => [...prev, event.data]);
    };
    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);
  };

  const downloadRecording = () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "recording.webm";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const takeScreenshot = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "screenshot.png";
    a.click();
  };

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <>
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip
            style={{ overflow: "hidden" }}
            className="border border-2 p-0 rounded-5 "
            id="button-tooltip"
          >
            Screen Recorder
          </Tooltip>
        }
      >
        <button
          style={{
            color: darkMode
              ? "var(--secondaryDashColorDark)"
              : "var(--primaryDashMenuColor)",
          }}
          className="btn d-flex align-items-center justify-content-center p-0"
          onClick={handleShow}
        >
          <BsRecordCircle />
        </button>
      </OverlayTrigger>

      <Modal
        show={showModal}
        onHide={handleClose}
        size={isMaximized ? "xl" : "lg"}
        className="p-0"
      >
        <Modal.Header closeButton className="px-3 py-0">
          <h6 className="p-1 m-1">Screen Recorder</h6>
          <Button
            variant="outline-secondary"
            className="ml-auto"
            onClick={() => setIsMaximized(!isMaximized)}
          >
            {isMaximized ? <BsArrowsCollapse /> : <BsArrowsFullscreen />}
          </Button>
        </Modal.Header>

        <Modal.Body>
          <video ref={videoRef} style={{ width: "100%" }}></video>
          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
          <div className="d-flex mt-2">
            {recording ? (
              <Button variant="danger" onClick={stopRecording} className="mr-2">
                <BsStopCircle size={20} />
              </Button>
            ) : (
              <Button
                variant="success"
                onClick={startRecording}
                className="mr-2"
              >
                <BsRecordCircle size={20} />
              </Button>
            )}
            <Button
              variant="primary"
              onClick={downloadRecording}
              disabled={!chunks.length}
              className="mr-2"
            >
              <BsDownload size={20} />
            </Button>
            <Button
              variant="secondary"
              onClick={takeScreenshot}
              className="mr-2"
            >
              <BsCamera size={20} />
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ScreenRecorder;
